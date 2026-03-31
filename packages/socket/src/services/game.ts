import {
  Answer,
  GameReport,
  Player,
  PlayerResult,
  QuestionResult,
  Quizz,
  QuizzTheme,
} from "@rahoot/common/types/game"
import { Server, Socket } from "@rahoot/common/types/game/socket"
import { Status, STATUS, StatusDataMap } from "@rahoot/common/types/game/status"
import { usernameValidator } from "@rahoot/common/validators/auth"
import Config from "@rahoot/socket/services/config"
import Registry from "@rahoot/socket/services/registry"
import { createInviteCode, timeToPoint } from "@rahoot/socket/utils/game"
import sleep from "@rahoot/socket/utils/sleep"
import { v4 as uuid } from "uuid"

const registry = Registry.getInstance()

// Extended answer type for tracking response time
type DetailedAnswer = Answer & {
  responseTime: number  // ms since question started
  username: string
}

class Game {
  io: Server

  gameId: string
  quizzId: string
  manager: {
    id: string
    clientId: string
    connected: boolean
  }
  inviteCode: string
  started: boolean
  gameStartTime: number  // Track when the game started

  lastBroadcastStatus: { name: Status; data: StatusDataMap[Status] } | null =
    null
  managerStatus: { name: Status; data: StatusDataMap[Status] } | null = null
  playerStatus: Map<string, { name: Status; data: StatusDataMap[Status] }> =
    new Map()

  leaderboard: Player[]
  tempOldLeaderboard: Player[] | null

  quizz: Quizz
  players: Player[]

  round: {
    currentQuestion: number
    playersAnswers: DetailedAnswer[]
    startTime: number
  }

  cooldown: {
    active: boolean
    ms: number
  }

  // Store all answers for report generation
  allAnswers: Map<number, DetailedAnswer[]>  // questionIndex -> answers

  constructor(io: Server, socket: Socket, quizz: Quizz, quizzId: string) {
    if (!io) {
      throw new Error("Socket server not initialized")
    }

    this.io = io
    this.gameId = uuid()
    this.quizzId = quizzId
    this.manager = {
      id: "",
      clientId: "",
      connected: false,
    }
    this.inviteCode = ""
    this.started = false
    this.gameStartTime = 0

    this.lastBroadcastStatus = null
    this.managerStatus = null
    this.playerStatus = new Map()

    this.leaderboard = []
    this.tempOldLeaderboard = null

    this.players = []

    this.round = {
      playersAnswers: [],
      currentQuestion: 0,
      startTime: 0,
    }

    this.cooldown = {
      active: false,
      ms: 0,
    }

    this.allAnswers = new Map()

    const roomInvite = createInviteCode()
    this.inviteCode = roomInvite
    this.manager = {
      id: socket.id,
      clientId: socket.handshake.auth.clientId,
      connected: true,
    }
    this.quizz = quizz

    socket.join(this.gameId)
    socket.emit("manager:gameCreated", {
      gameId: this.gameId,
      inviteCode: roomInvite,
      music: quizz.music,
      theme: quizz.theme,
    })

    console.log(
      `New game created: ${roomInvite} subject: ${this.quizz.subject}`,
    )
  }

  broadcastStatus<T extends Status>(status: T, data: StatusDataMap[T]) {
    const statusData = { name: status, data }
    this.lastBroadcastStatus = statusData
    this.io.to(this.gameId).emit("game:status", statusData)
  }

  sendStatus<T extends Status>(
    target: string,
    status: T,
    data: StatusDataMap[T],
  ) {
    const statusData = { name: status, data }

    if (this.manager.id === target) {
      this.managerStatus = statusData
    } else {
      this.playerStatus.set(target, statusData)
    }

    this.io.to(target).emit("game:status", statusData)
  }

  join(socket: Socket, username: string) {
    const isAlreadyConnected = this.players.find(
      (p) => p.clientId === socket.handshake.auth.clientId,
    )

    if (isAlreadyConnected) {
      socket.emit("game:errorMessage", "Player already connected")

      return
    }

    const result = usernameValidator.safeParse(username)

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message)

      return
    }

    socket.join(this.gameId)

    const playerData = {
      id: socket.id,
      clientId: socket.handshake.auth.clientId,
      connected: true,
      username,
      points: 0,
    }

    this.players.push(playerData)

    this.io.to(this.manager.id).emit("manager:newPlayer", playerData)
    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)

    socket.emit("game:successJoin", { gameId: this.gameId, theme: this.quizz.theme })
  }

  kickPlayer(socket: Socket, playerId: string) {
    if (this.manager.id !== socket.id) {
      return
    }

    const player = this.players.find((p) => p.id === playerId)

    if (!player) {
      return
    }

    this.players = this.players.filter((p) => p.id !== playerId)
    this.playerStatus.delete(playerId)

    this.io.in(playerId).socketsLeave(this.gameId)
    this.io
      .to(player.id)
      .emit("game:reset", "You have been kicked by the manager")
    this.io.to(this.manager.id).emit("manager:playerKicked", player.id)

    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)
  }

  reconnect(socket: Socket) {
    const { clientId } = socket.handshake.auth
    const isManager = this.manager.clientId === clientId

    if (isManager) {
      this.reconnectManager(socket)
    } else {
      this.reconnectPlayer(socket)
    }
  }

  private reconnectManager(socket: Socket) {
    if (this.manager.connected) {
      socket.emit("game:reset", "Manager already connected")

      return
    }

    socket.join(this.gameId)
    this.manager.id = socket.id
    this.manager.connected = true

    const status = this.managerStatus ||
      this.lastBroadcastStatus || {
        name: STATUS.WAIT,
        data: { text: "Waiting for players" },
      }

    socket.emit("manager:successReconnect", {
      gameId: this.gameId,
      currentQuestion: {
        current: this.round.currentQuestion + 1,
        total: this.quizz.questions.length,
      },
      status,
      players: this.players,
      music: this.quizz.music,
      theme: this.quizz.theme,
    })
    socket.emit("game:totalPlayers", this.players.length)

    registry.reactivateGame(this.gameId)
    console.log(`Manager reconnected to game ${this.inviteCode}`)
  }

  private reconnectPlayer(socket: Socket) {
    const { clientId } = socket.handshake.auth
    const player = this.players.find((p) => p.clientId === clientId)

    if (!player) {
      return
    }

    if (player.connected) {
      socket.emit("game:reset", "Player already connected")

      return
    }

    socket.join(this.gameId)

    const oldSocketId = player.id
    player.id = socket.id
    player.connected = true

    const status = this.playerStatus.get(oldSocketId) ||
      this.lastBroadcastStatus || {
        name: STATUS.WAIT,
        data: { text: "Waiting for players" },
      }

    if (this.playerStatus.has(oldSocketId)) {
      const oldStatus = this.playerStatus.get(oldSocketId)!
      this.playerStatus.delete(oldSocketId)
      this.playerStatus.set(socket.id, oldStatus)
    }

    socket.emit("player:successReconnect", {
      gameId: this.gameId,
      currentQuestion: {
        current: this.round.currentQuestion + 1,
        total: this.quizz.questions.length,
      },
      status,
      player: {
        username: player.username,
        points: player.points,
      },
      theme: this.quizz.theme,
    })
    socket.emit("game:totalPlayers", this.players.length)
    console.log(
      `Player ${player.username} reconnected to game ${this.inviteCode}`,
    )
  }

  startCooldown(seconds: number): Promise<void> {
    if (this.cooldown.active) {
      return Promise.resolve()
    }

    this.cooldown.active = true
    let count = seconds - 1

    return new Promise<void>((resolve) => {
      const cooldownTimeout = setInterval(() => {
        if (!this.cooldown.active || count <= 0) {
          this.cooldown.active = false
          clearInterval(cooldownTimeout)
          resolve()

          return
        }

        this.io.to(this.gameId).emit("game:cooldown", count)
        count -= 1
      }, 1000)
    })
  }

  abortCooldown() {
    this.cooldown.active &&= false
  }

  async start(socket: Socket) {
    if (this.manager.id !== socket.id) {
      return
    }

    if (this.started) {
      return
    }

    if (this.players.length === 0) {
      socket.emit("game:errorMessage", "No players connected")

      return
    }

    this.started = true
    this.gameStartTime = Date.now()

    this.broadcastStatus(STATUS.SHOW_START, {
      time: 3,
      subject: this.quizz.subject,
    })

    await sleep(3)

    this.io.to(this.gameId).emit("game:startCooldown")
    await this.startCooldown(3)

    this.newRound()
  }

  async newRound() {
    const question = this.quizz.questions[this.round.currentQuestion]

    if (!this.started) {
      return
    }

    this.playerStatus.clear()

    this.io.to(this.gameId).emit("game:updateQuestion", {
      current: this.round.currentQuestion + 1,
      total: this.quizz.questions.length,
    })

    this.managerStatus = null
    this.broadcastStatus(STATUS.SHOW_PREPARED, {
      totalAnswers: question.answers.length,
      questionNumber: this.round.currentQuestion + 1,
    })

    await sleep(2)

    if (!this.started) {
      return
    }

    this.broadcastStatus(STATUS.SHOW_QUESTION, {
      question: question.question,
      image: question.image,
      cooldown: question.cooldown,
    })

    await sleep(question.cooldown)

    if (!this.started) {
      return
    }

    this.round.startTime = Date.now()

    this.broadcastStatus(STATUS.SELECT_ANSWER, {
      question: question.question,
      answers: question.answers,
      image: question.image,
      video: question.video,
      audio: question.audio,
      time: question.time,
      totalPlayer: this.players.length,
    })

    await this.startCooldown(question.time)

    if (!this.started) {
      return
    }

    this.showResults(question)
  }

  showResults(question: any) {
    const oldLeaderboard =
      this.leaderboard.length === 0
        ? this.players.map((p) => ({ ...p }))
        : this.leaderboard.map((p) => ({ ...p }))

    const totalType = this.round.playersAnswers.reduce(
      (acc: Record<number, number>, { answerId }) => {
        acc[answerId] = (acc[answerId] || 0) + 1

        return acc
      },
      {},
    )

    const sortedPlayers = this.players
      .map((player) => {
        const playerAnswer = this.round.playersAnswers.find(
          (a) => a.playerId === player.id,
        )

        const isCorrect = playerAnswer
          ? playerAnswer.answerId === question.solution
          : false

        const points =
          playerAnswer && isCorrect ? Math.round(playerAnswer.points) : 0

        player.points += points

        return { ...player, lastCorrect: isCorrect, lastPoints: points }
      })
      .sort((a, b) => b.points - a.points)

    this.players = sortedPlayers

    sortedPlayers.forEach((player, index) => {
      const rank = index + 1
      const aheadPlayer = sortedPlayers[index - 1]

      this.sendStatus(player.id, STATUS.SHOW_RESULT, {
        correct: player.lastCorrect,
        message: player.lastCorrect ? "Nice!" : "Too bad",
        points: player.lastPoints,
        myPoints: player.points,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      })
    })

    this.sendStatus(this.manager.id, STATUS.SHOW_RESPONSES, {
      question: question.question,
      responses: totalType,
      correct: question.solution,
      answers: question.answers,
      image: question.image,
    })

    this.leaderboard = sortedPlayers
    this.tempOldLeaderboard = oldLeaderboard

    // Store detailed answers for report before clearing
    const detailedAnswers: DetailedAnswer[] = this.round.playersAnswers.map(answer => {
      const player = this.players.find(p => p.id === answer.playerId)
      return {
        playerId: answer.playerId,
        answerId: answer.answerId,
        points: answer.points,
        responseTime: (answer as any).responseTime || 0,
        username: (answer as any).username || player?.username || "Unknown",
      }
    })
    this.allAnswers.set(this.round.currentQuestion, detailedAnswers)

    this.round.playersAnswers = []
  }
  selectAnswer(socket: Socket, answerId: number) {
    const player = this.players.find((player) => player.id === socket.id)
    const question = this.quizz.questions[this.round.currentQuestion]

    if (!player) {
      return
    }

    if (this.round.playersAnswers.find((p) => p.playerId === socket.id)) {
      return
    }

    this.round.playersAnswers.push({
      playerId: player.id,
      answerId,
      points: timeToPoint(this.round.startTime, question.time, question.pointsMultiplier || 1),
      // @ts-ignore - we add responseTime for tracking
      responseTime: Date.now() - this.round.startTime,
      username: player.username,
    })

    this.sendStatus(socket.id, STATUS.WAIT, {
      text: "Waiting for the players to answer",
    })

    socket
      .to(this.gameId)
      .emit("game:playerAnswer", this.round.playersAnswers.length)

    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)

    if (this.round.playersAnswers.length === this.players.length) {
      this.abortCooldown()
    }
  }

  nextRound(socket: Socket) {
    if (!this.started) {
      return
    }

    if (socket.id !== this.manager.id) {
      return
    }

    if (!this.quizz.questions[this.round.currentQuestion + 1]) {
      return
    }

    this.round.currentQuestion += 1
    this.newRound()
  }

  abortRound(socket: Socket) {
    if (!this.started) {
      return
    }

    if (socket.id !== this.manager.id) {
      return
    }

    this.abortCooldown()
  }


  private buildGameReport(gameDuration: number): GameReport {
    const totalQuestions = this.quizz.questions.length

    const questionResults: QuestionResult[] = this.quizz.questions.map((question, questionIndex) => {
      const answers = this.allAnswers.get(questionIndex) || []
      const totalResponses = answers.length
      const correctResponses = answers.filter((a) => a.answerId === question.solution).length
      const accuracy = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0

      const averageResponseTime = totalResponses > 0
        ? Math.round(answers.reduce((sum, a) => sum + a.responseTime, 0) / totalResponses)
        : 0

      const answerDistribution = question.answers.map((answer, answerId) => {
        const count = answers.filter((a) => a.answerId === answerId).length
        return {
          answerId,
          answer,
          count,
          percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
        }
      })

      const answeredUsernames = new Set(answers.map((a) => a.username))
      const playersWhoFailed = answers
        .filter((a) => a.answerId !== question.solution)
        .map((a) => a.username)
      const playersWhoDidntAnswer = this.players
        .filter((p) => !answeredUsernames.has(p.username))
        .map((p) => p.username)

      return {
        questionIndex,
        question: question.question,
        image: question.image,
        correctAnswer: question.solution,
        totalResponses,
        correctResponses,
        accuracy,
        averageResponseTime,
        answerDistribution,
        playersWhoFailed,
        playersWhoDidntAnswer,
      }
    })

    const playerResults: PlayerResult[] = this.players
      .map((player) => {
        const answers = this.quizz.questions.map((question, questionIndex) => {
          const questionAnswers = this.allAnswers.get(questionIndex) || []
          const playerAnswer = questionAnswers.find((a) => a.playerId === player.id)
          const correct = playerAnswer ? playerAnswer.answerId === question.solution : false

          return {
            questionIndex,
            answerId: playerAnswer ? playerAnswer.answerId : null,
            correct,
            points: playerAnswer ? Math.round(playerAnswer.points) : 0,
            responseTime: playerAnswer ? playerAnswer.responseTime : 0,
          }
        })

        const correctAnswers = answers.filter((a) => a.correct).length
        const answeredCount = answers.filter((a) => a.answerId !== null).length
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
        const averageResponseTime = answeredCount > 0
          ? Math.round(answers.filter((a) => a.answerId !== null).reduce((sum, a) => sum + a.responseTime, 0) / answeredCount)
          : 0

        return {
          username: player.username,
          finalPoints: player.points,
          rank: 0,
          correctAnswers,
          totalQuestions,
          accuracy,
          averageResponseTime,
          answers,
        }
      })
      .sort((a, b) => b.finalPoints - a.finalPoints)
      .map((player, index) => ({ ...player, rank: index + 1 }))

    const allAnswersCount = questionResults.reduce((sum, q) => sum + q.totalResponses, 0)
    const allCorrectAnswers = questionResults.reduce((sum, q) => sum + q.correctResponses, 0)
    const overallAccuracy = allAnswersCount > 0 ? Math.round((allCorrectAnswers / allAnswersCount) * 100) : 0

    const difficultQuestions = questionResults
      .filter((q) => q.accuracy < 50)
      .map((q) => q.questionIndex)

    const playersNeedingHelp = playerResults
      .filter((p) => p.accuracy < 50)
      .map((p) => p.username)

    const playersNotFinished = playerResults
      .filter((p) => p.answers.some((a) => a.answerId === null))
      .map((p) => p.username)

    return {
      id: uuid(),
      playedAt: new Date().toISOString(),
      duration: gameDuration,
      totalPlayers: this.players.length,
      totalQuestions,
      overallAccuracy,
      players: playerResults,
      questions: questionResults,
      difficultQuestions,
      playersNeedingHelp,
      playersNotFinished,
    }
  }
   showLeaderboard() {
     const isLastRound =
       this.round.currentQuestion + 1 === this.quizz.questions.length

     if (isLastRound) {
       this.started = false

       const gameDuration = Math.round((Date.now() - this.gameStartTime) / 1000)
       const topPlayers = this.leaderboard.slice(0, 3).map((p) => ({
         username: p.username,
         points: p.points,
       }))
       const report = this.buildGameReport(gameDuration)

       Config.updateQuizzStats(
         this.quizzId,
         this.players.length,
         topPlayers,
         gameDuration,
         report,
       )

       // Automatically request feedback at the end of the game
       this.broadcastStatus(STATUS.FEEDBACK, {
         question: "How would you rate this quiz?",
       })

       return
     }

    const oldLeaderboard = this.tempOldLeaderboard
      ? this.tempOldLeaderboard
      : this.leaderboard

    this.sendStatus(this.manager.id, STATUS.SHOW_LEADERBOARD, {
      oldLeaderboard: oldLeaderboard.slice(0, 5),
      leaderboard: this.leaderboard.slice(0, 5),
    })

    this.tempOldLeaderboard = null
  }

  setTheme(socket: Socket, theme: QuizzTheme) {
    if (socket.id !== this.manager.id) {
      return
    }

    this.quizz.theme = theme
    this.io.to(this.gameId).emit("game:theme", theme)
  }

  requestFeedback(socket: Socket, question: string) {
    if (socket.id !== this.manager.id) {
      return
    }

    this.broadcastStatus(STATUS.FEEDBACK, { question })
  }

   recordFeedback(socket: Socket, rating: number) {
     const player = this.players.find((p) => p.id === socket.id)

     if (!player) {
       return
     }

     // Notify the manager that feedback was received
     this.io
       .to(this.manager.id)
       .emit("manager:feedbackReceived", {
         username: player.username,
         rating,
       })

     // Send confirmation to player
     socket.emit("game:feedbackConfirmed")
   }

   closeFeedback(socket: Socket) {
     if (socket.id !== this.manager.id) {
       return
     }

     // Show the finished status with top players
     this.broadcastStatus(STATUS.FINISHED, {
       subject: this.quizz.subject,
       top: this.leaderboard.slice(0, 3),
     })
   }
}

export default Game

