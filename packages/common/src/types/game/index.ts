export type Player = {
  id: string
  clientId: string
  connected: boolean
  username: string
  points: number
}

export type Answer = {
  playerId: string
  answerId: number
  points: number
}

export type QuizzMusic = {
  lobby?: string       // Music played in the waiting room
  question?: string    // Music played during question display
  answer?: string      // Music played while waiting for answers
  results?: string     // Music played when showing results
  leaderboard?: string // Music played on leaderboard
  podium?: string      // Music played on final podium
}

export type QuizzTheme = "classic" | "sunset" | "ocean"

export type QuizzQuestion = {
  question: string
  image?: string
  video?: string
  audio?: string
  answers: string[]
  solution: number
  cooldown: number
  time: number
  pointsMultiplier?: number  // 1 (normal), 2 (double), 3 (triple), default is 1
}

export type QuestionBankItem = {
  id: string
  createdAt: string
  question: QuizzQuestion
}

// Detailed player result for reports
export type PlayerResult = {
  username: string
  finalPoints: number
  rank: number
  correctAnswers: number
  totalQuestions: number
  accuracy: number  // percentage
  averageResponseTime: number  // in ms
  answers: {
    questionIndex: number
    answerId: number | null  // null if didn't answer
    correct: boolean
    points: number
    responseTime: number  // in ms
  }[]
}

// Detailed question result for reports
export type QuestionResult = {
  questionIndex: number
  question: string
  image?: string
  correctAnswer: number
  totalResponses: number
  correctResponses: number
  accuracy: number  // percentage
  averageResponseTime: number  // in ms
  answerDistribution: {
    answerId: number
    answer: string
    count: number
    percentage: number
  }[]
  playersWhoFailed: string[]  // usernames
  playersWhoDidntAnswer: string[]  // usernames
}

// Full game report
export type GameReport = {
  id: string
  playedAt: string  // ISO date string
  duration: number  // in seconds
  
  // Summary stats
  totalPlayers: number
  totalQuestions: number
  overallAccuracy: number  // percentage of correct answers
  
  // Detailed data
  players: PlayerResult[]
  questions: QuestionResult[]
  
  // Quick access data
  difficultQuestions: number[]  // indices of questions with < 50% accuracy
  playersNeedingHelp: string[]  // usernames with < 50% accuracy
  playersNotFinished: string[]  // usernames who didn't answer all questions
}

export type GameHistory = {
  id: string
  playedAt: string  // ISO date string
  playerCount: number
  duration: number  // in seconds
  topPlayers: {
    username: string
    points: number
    rank: number
  }[]
  report?: GameReport  // Full detailed report
}

export type QuizzStats = {
  timesPlayed: number
  totalPlayers: number
  lastPlayed?: string  // ISO date string
  bestScore?: {
    username: string
    points: number
  }
  history?: GameHistory[]  // Last 10 games history
}

export type Quizz = {
  subject: string
  music?: QuizzMusic
  theme?: QuizzTheme
  stats?: QuizzStats
  shuffleAnswers?: boolean  // Enable/disable answer shuffling for this quiz
  questions: QuizzQuestion[]
}

export type QuizzWithId = Quizz & { id: string }

export type GameUpdateQuestion = {
  current: number
  total: number
  music?: string  // Optional music URL from quizz configuration
}
