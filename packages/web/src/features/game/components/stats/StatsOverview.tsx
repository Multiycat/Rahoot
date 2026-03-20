import type { QuizzWithId } from "@rahoot/common/types/game"
import { useState } from "react"
import QuizStats from "./QuizStats"

type Props = {
  quizzList: QuizzWithId[]
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "Never"
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const StatsOverview = ({ quizzList }: Props) => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizzWithId | null>(null)

  // Calculate global stats
  const globalStats = quizzList.reduce(
    (acc, quiz) => {
      if (quiz.stats) {
        acc.totalGames += quiz.stats.timesPlayed
        acc.totalPlayers += quiz.stats.totalPlayers
        if (quiz.stats.lastPlayed) {
          const lastPlayedDate = new Date(quiz.stats.lastPlayed)
          if (!acc.lastPlayed || lastPlayedDate > new Date(acc.lastPlayed)) {
            acc.lastPlayed = quiz.stats.lastPlayed
          }
        }
        if (quiz.stats.bestScore) {
          if (!acc.bestScore || quiz.stats.bestScore.points > acc.bestScore.points) {
            acc.bestScore = {
              ...quiz.stats.bestScore,
              quizSubject: quiz.subject,
            }
          }
        }
        // Calculate total duration from history
        if (quiz.stats.history) {
          acc.totalDuration += quiz.stats.history.reduce((sum, game) => sum + game.duration, 0)
        }
      }
      return acc
    },
    {
      totalGames: 0,
      totalPlayers: 0,
      lastPlayed: null as string | null,
      bestScore: null as { username: string; points: number; quizSubject: string } | null,
      totalDuration: 0,
    }
  )

  const averagePlayersPerGame = globalStats.totalGames > 0 
    ? Math.round(globalStats.totalPlayers / globalStats.totalGames * 10) / 10 
    : 0

  // Sort quizzes by times played
  const sortedQuizzes = [...quizzList].sort((a, b) => {
    const aPlayed = a.stats?.timesPlayed || 0
    const bPlayed = b.stats?.timesPlayed || 0
    return bPlayed - aPlayed
  })

  if (selectedQuiz) {
    return (
      <QuizStats 
        quiz={selectedQuiz} 
        onBack={() => setSelectedQuiz(null)} 
      />
    )
  }

  return (
    <div className="z-10 flex w-full max-w-4xl flex-col gap-6">
      {/* Global Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{globalStats.totalGames}</div>
          <div className="text-sm text-gray-500">Total Games</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-blue-500">{globalStats.totalPlayers}</div>
          <div className="text-sm text-gray-500">Total Players</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-green-500">{averagePlayersPerGame}</div>
          <div className="text-sm text-gray-500">Avg Players/Game</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-purple-500">{formatDuration(globalStats.totalDuration)}</div>
          <div className="text-sm text-gray-500">Total Play Time</div>
        </div>
      </div>

      {/* Best Score Banner */}
      {globalStats.bestScore && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-lg text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <div className="text-sm opacity-90">All-Time Best Score</div>
              <div className="text-2xl font-bold">{globalStats.bestScore.username}</div>
              <div className="text-sm opacity-90">
                {globalStats.bestScore.points} pts on "{globalStats.bestScore.quizSubject}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List with Stats */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Quiz Statistics</h2>
        </div>
        
        {quizzList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No quizzes yet. Create your first quiz!
          </div>
        ) : (
          <div className="divide-y">
            {sortedQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{quiz.subject}</div>
                  <div className="text-sm text-gray-500">
                    {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-primary">{quiz.stats?.timesPlayed || 0}</div>
                    <div className="text-gray-400 text-xs">plays</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-500">{quiz.stats?.totalPlayers || 0}</div>
                    <div className="text-gray-400 text-xs">players</div>
                  </div>
                  {quiz.stats?.bestScore && (
                    <div className="text-center">
                      <div className="font-bold text-yellow-500">{quiz.stats.bestScore.points}</div>
                      <div className="text-gray-400 text-xs">best</div>
                    </div>
                  )}
                  <div className="text-gray-400 text-xs w-16 text-right">
                    {formatDate(quiz.stats?.lastPlayed)}
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {globalStats.totalGames > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Recent Activity</h2>
          </div>
          <div className="divide-y">
            {sortedQuizzes
              .flatMap(quiz => 
                (quiz.stats?.history || []).map(game => ({
                  ...game,
                  quizSubject: quiz.subject,
                  quizId: quiz.id,
                }))
              )
              .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
              .slice(0, 10)
              .map((game) => (
                <div key={game.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{game.quizSubject}</div>
                    <div className="text-sm text-gray-500">
                      {game.playerCount} player{game.playerCount > 1 ? "s" : ""} • {formatDuration(game.duration)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-yellow-600">
                      {game.topPlayers[0]?.username || "No winner"}
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(game.playedAt)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsOverview
