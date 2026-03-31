import type {
  GameUpdateQuestion,
  Player,
  QuestionBankItem,
  QuizzMusic,
  QuizzTheme,
  QuizzWithId,
} from "@rahoot/common/types/game"
import type { Status, StatusDataMap } from "@rahoot/common/types/game/status"
import { Server as ServerIO, Socket as SocketIO } from "socket.io"

export type Server = ServerIO<ClientToServerEvents, ServerToClientEvents>
export type Socket = SocketIO<ClientToServerEvents, ServerToClientEvents>

export type Message<K extends keyof StatusDataMap = keyof StatusDataMap> = {
  gameId?: string
  status: K
  data: StatusDataMap[K]
}

export type MessageWithoutStatus<T = any> = {
  gameId?: string
  data: T
}

export type MessageGameId = {
  gameId?: string
}

export interface ServerToClientEvents {
  connect: () => void

  // Game events
  "game:status": (_data: { name: Status; data: StatusDataMap[Status] }) => void
  "game:successRoom": (_data: string) => void
  "game:successJoin": (_data: { gameId: string; theme?: QuizzTheme }) => void
  "game:totalPlayers": (_count: number) => void
  "game:errorMessage": (_message: string) => void
  "game:startCooldown": () => void
  "game:cooldown": (_count: number) => void
  "game:reset": (_message: string) => void
  "game:updateQuestion": (_data: { current: number; total: number }) => void
  "game:playerAnswer": (_count: number) => void
  "game:theme": (_theme: QuizzTheme) => void
  "game:feedbackConfirmed": () => void

  // Player events
  "player:successReconnect": (_data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    player: { username: string; points: number }
    currentQuestion: GameUpdateQuestion
    theme?: QuizzTheme
  }) => void
  "player:updateLeaderboard": (_data: { leaderboard: Player[] }) => void

  // Manager events
  "manager:successReconnect": (_data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    players: Player[]
    currentQuestion: GameUpdateQuestion
    music?: QuizzMusic
    theme?: QuizzTheme
  }) => void
  "manager:quizzList": (_quizzList: QuizzWithId[]) => void
  "manager:quizzSaved": (_quizz: QuizzWithId) => void
  "manager:quizzUpdated": (_quizz: QuizzWithId) => void
  "manager:quizzDeleted": (_quizzId: string) => void
  "manager:questionBankList": (_items: QuestionBankItem[]) => void
  "manager:questionBankSaved": (_item: QuestionBankItem) => void
  "manager:questionBankDeleted": (_id: string) => void
  "manager:gameCreated": (_data: {
    gameId: string
    inviteCode: string
    music?: QuizzMusic
    theme?: QuizzTheme
  }) => void
  "manager:statusUpdate": (_data: {
    status: Status
    data: StatusDataMap[Status]
  }) => void
  "manager:newPlayer": (_player: Player) => void
  "manager:removePlayer": (_playerId: string) => void
  "manager:errorMessage": (_message: string) => void
  "manager:playerKicked": (_playerId: string) => void
  "manager:feedbackReceived": (_data: { username: string; rating: number }) => void
}

export interface ClientToServerEvents {
  // Manager actions
  "game:create": (_quizzId: string) => void
  "manager:saveQuizz": (_quizz: import("@rahoot/common/types/game").Quizz) => void
  "manager:updateQuizz": (_data: {
    quizzId: string
    quizz: import("@rahoot/common/types/game").Quizz
  }) => void
  "manager:deleteQuizz": (_quizzId: string) => void
  "manager:getQuestionBank": () => void
  "manager:saveQuestionBankItem": (_question: import("@rahoot/common/types/game").QuizzQuestion) => void
  "manager:deleteQuestionBankItem": (_id: string) => void
  "manager:setQuizzTheme": (_message: { gameId: string; theme: QuizzTheme }) => void
  "manager:auth": (_password: string) => void
  "manager:reconnect": (_message: { gameId: string }) => void
  "manager:kickPlayer": (_message: { gameId: string; playerId: string }) => void
  "manager:startGame": (_message: MessageGameId) => void
  "manager:abortQuiz": (_message: MessageGameId) => void
   "manager:nextQuestion": (_message: MessageGameId) => void
   "manager:showLeaderboard": (_message: MessageGameId) => void
   "manager:requestFeedback": (_message: MessageWithoutStatus<{ question: string }>) => void
   "manager:closeFeedback": (_message: MessageGameId) => void

  // Player actions
  "player:join": (_inviteCode: string) => void
  "player:login": (_message: MessageWithoutStatus<{ username: string }>) => void
  "player:reconnect": (_message: { gameId: string }) => void
  "player:selectedAnswer": (
    _message: MessageWithoutStatus<{ answerKey: number }>,
  ) => void
  "player:feedback": (_message: MessageWithoutStatus<{ rating: number }>) => void

  // Common
  disconnect: () => void
}
