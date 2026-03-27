import {
  GameHistory,
  GameReport,
  QuestionBankItem,
  Quizz,
  QuizzQuestion,
  QuizzStats,
  QuizzWithId,
} from "@rahoot/common/types/game"
import fs from "fs"
import { resolve } from "path"
import { v4 as uuid } from "uuid"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path)

class Config {
  static init() {
    const isConfigFolderExists = fs.existsSync(getPath())

    if (!isConfigFolderExists) {
      fs.mkdirSync(getPath())
    }

    const isGameConfigExists = fs.existsSync(getPath("game.json"))

    if (!isGameConfigExists) {
      fs.writeFileSync(
        getPath("game.json"),
        JSON.stringify(
          {
            managerPassword: "PASSWORD",
          },
          null,
          2,
        ),
      )
    }

    const isQuizzExists = fs.existsSync(getPath("quizz"))

    if (!isQuizzExists) {
      fs.mkdirSync(getPath("quizz"))

      fs.writeFileSync(
        getPath("quizz/example.json"),
        JSON.stringify(
          {
            subject: "Example Quizz",
            questions: [
              {
                question: "What is good answer ?",
                answers: ["No", "Good answer", "No", "No"],
                solution: 1,
                cooldown: 5,
                time: 15,
              },
              {
                question: "What is good answer with image ?",
                answers: ["No", "No", "No", "Good answer"],
                image: "https://placehold.co/600x400.png",
                solution: 3,
                cooldown: 5,
                time: 20,
              },
              {
                question: "What is good answer with two answers ?",
                answers: ["Good answer", "No"],
                image: "https://placehold.co/600x400.png",
                solution: 0,
                cooldown: 5,
                time: 20,
              },
            ],
          },
          null,
          2,
        ),
      )
    }

    const isQuestionBankExists = fs.existsSync(getPath("question-bank.json"))

    if (!isQuestionBankExists) {
      fs.writeFileSync(getPath("question-bank.json"), JSON.stringify([], null, 2))
    }
  }

  static game() {
    const isExists = fs.existsSync(getPath("game.json"))

    if (!isExists) {
      throw new Error("Game config not found")
    }

    try {
      const config = fs.readFileSync(getPath("game.json"), "utf-8")

      return JSON.parse(config)
    } catch (error) {
      console.error("Failed to read game config:", error)
    }

    return {}
  }

  static quizz() {
    const isExists = fs.existsSync(getPath("quizz"))

    if (!isExists) {
      return []
    }

    try {
      const files = fs
        .readdirSync(getPath("quizz"))
        .filter((file) => file.endsWith(".json"))

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getPath(`quizz/${file}`), "utf-8")
        const config = JSON.parse(data)

        const id = file.replace(".json", "")

        return {
          id,
          ...config,
        }
      })

      return quizz || []
    } catch (error) {
      console.error("Failed to read quizz config:", error)

      return []
    }
  }

  static saveQuizz(quizz: Quizz): QuizzWithId {
    const quizzPath = getPath("quizz")
    
    if (!fs.existsSync(quizzPath)) {
      fs.mkdirSync(quizzPath, { recursive: true })
    }

    // Generate a unique ID for the quizz
    const id = uuid()
    const fileName = `${id}.json`
    const filePath = getPath(`quizz/${fileName}`)

    fs.writeFileSync(filePath, JSON.stringify(quizz, null, 2))

    console.log(`Quizz saved: ${filePath}`)

    return {
      id,
      ...quizz,
    }
  }

  static deleteQuizz(quizzId: string): boolean {
    const filePath = getPath(`quizz/${quizzId}.json`)

    if (!fs.existsSync(filePath)) {
      return false
    }

    fs.unlinkSync(filePath)
    console.log(`Quizz deleted: ${filePath}`)

    return true
  }

  static updateQuizz(quizzId: string, quizz: Quizz): QuizzWithId | null {
    const filePath = getPath(`quizz/${quizzId}.json`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    fs.writeFileSync(filePath, JSON.stringify(quizz, null, 2))
    console.log(`Quizz updated: ${filePath}`)

    return {
      id: quizzId,
      ...quizz,
    }
  }

  static questionBank(): QuestionBankItem[] {
    const filePath = getPath("question-bank.json")

    if (!fs.existsSync(filePath)) {
      return []
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8")
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error("Failed to read question bank:", error)
      return []
    }
  }

  static saveQuestionBankItem(question: QuizzQuestion): QuestionBankItem {
    const current = Config.questionBank()
    const item: QuestionBankItem = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      question,
    }

    current.unshift(item)
    fs.writeFileSync(getPath("question-bank.json"), JSON.stringify(current, null, 2))

    return item
  }

  static deleteQuestionBankItem(id: string): boolean {
    const current = Config.questionBank()
    const next = current.filter((item) => item.id !== id)

    if (next.length === current.length) {
      return false
    }

    fs.writeFileSync(getPath("question-bank.json"), JSON.stringify(next, null, 2))
    return true
  }

  static updateQuizzStats(
    quizzId: string, 
    playerCount: number, 
    topPlayers: { username: string; points: number }[],
    gameDuration: number,
    report?: GameReport
  ): void {
    const filePath = getPath(`quizz/${quizzId}.json`)

    if (!fs.existsSync(filePath)) {
      console.error(`Quizz not found: ${quizzId}`)
      return
    }

    try {
      const data = fs.readFileSync(filePath, "utf-8")
      const quizz: Quizz = JSON.parse(data)

      const currentStats: QuizzStats = quizz.stats || {
        timesPlayed: 0,
        totalPlayers: 0,
        history: [],
      }

      // Update stats
      currentStats.timesPlayed += 1
      currentStats.totalPlayers += playerCount
      currentStats.lastPlayed = new Date().toISOString()

      // Update best score if this winner beat the previous record
      const winner = topPlayers[0]
      if (winner && (!currentStats.bestScore || winner.points > currentStats.bestScore.points)) {
        currentStats.bestScore = {
          username: winner.username,
          points: winner.points,
        }
      }

      // Add to history (keep last 10 games)
      const gameHistoryEntry: GameHistory = {
        id: uuid(),
        playedAt: new Date().toISOString(),
        playerCount,
        duration: gameDuration,
        topPlayers: topPlayers.slice(0, 3).map((p, index) => ({
          username: p.username,
          points: p.points,
          rank: index + 1,
        })),
        report,
      }

      currentStats.history = currentStats.history || []
      currentStats.history.unshift(gameHistoryEntry)
      currentStats.history = currentStats.history.slice(0, 10) // Keep only last 10 games

      quizz.stats = currentStats

      fs.writeFileSync(filePath, JSON.stringify(quizz, null, 2))
      console.log(`Quizz stats updated: ${quizzId}`)
    } catch (error) {
      console.error("Failed to update quizz stats:", error)
    }
  }
}
export default Config
