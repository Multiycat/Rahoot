import { Socket } from "@rahoot/common/types/game/socket"
import Game from "@rahoot/socket/services/game"
import Registry from "@rahoot/socket/services/registry"
import { QuizzQuestion } from "@rahoot/common/types/game"

export const withGame = (
  gameId: string | undefined,
  socket: Socket,
  callback: (_game: Game) => void
): void => {
  if (!gameId) {
    socket.emit("game:errorMessage", "Game not found")

    return
  }

  const registry = Registry.getInstance()
  const game = registry.getGameById(gameId)

  if (!game) {
    socket.emit("game:errorMessage", "Game not found")

    return
  }

  callback(game)
}

export const createInviteCode = (length = 6) => {
  let result = ""
  const characters = "0123456789"
  const charactersLength = characters.length

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters.charAt(randomIndex)
  }

  return result
}

export const timeToPoint = (startTime: number, secondes: number, multiplier: number = 1): number => {
  let points = 1000 * multiplier

  const actualTime = Date.now()
  const tempsPasseEnSecondes = (actualTime - startTime) / 1000

  points -= (1000 / secondes) * tempsPasseEnSecondes * multiplier
  points = Math.max(0, points)

  return points
}

/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in place
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Shuffles answers in a question while tracking the new index of the correct answer
 * @param question - The original question
 * @returns A new question object with shuffled answers and updated solution index
 */
export const shuffleQuestionAnswers = (question: QuizzQuestion): QuizzQuestion => {
  const originalAnswers = question.answers
  const originalSolutionIndex = question.solution

  // Create an array of indices to track the mapping
  const indexMapping = originalAnswers.map((_, index) => index)
  
  // Shuffle the indices
  const shuffledIndexMapping = shuffleArray(indexMapping)
  
  // Create shuffled answers
  const shuffledAnswers = shuffledIndexMapping.map(originalIndex => originalAnswers[originalIndex])
  
  // Find the new position of the correct answer
  const newSolutionIndex = shuffledIndexMapping.indexOf(originalSolutionIndex)
  
  return {
    ...question,
    answers: shuffledAnswers,
    solution: newSolutionIndex
  }
}
