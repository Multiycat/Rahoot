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

export type Quizz = {
  subject: string
  music?: QuizzMusic
  questions: {
    question: string
    image?: string
    video?: string
    audio?: string
    answers: string[]
    solution: number
    cooldown: number
    time: number
  }[]
}

export type QuizzWithId = Quizz & { id: string }

export type GameUpdateQuestion = {
  current: number
  total: number
}
