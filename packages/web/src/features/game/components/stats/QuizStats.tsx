import type { GameReport, QuizzWithId } from "@rahoot/common/types/game"
import { useState } from "react"
import GameReportView from "./GameReport"

type Props = {
  quiz: QuizzWithId
  onBack: () => void
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

const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatRelativeDate = (isoDate?: string): string => {
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

const QuizStats = ({ quiz, onBack }: Props) => {
  const [selectedReport, setSelectedReport] = useState<GameReport | null>(null)
  const stats = quiz.stats
  const history = stats?.history || []
  
  const averagePlayersPerGame = stats && stats.timesPlayed > 0 
    ? Math.round(stats.totalPlayers / stats.timesPlayed * 10) / 10 
    : 0

  const totalDuration = history.reduce((sum, game) => sum + game.duration, 0)
  const averageDuration = history.length > 0 
    ? Math.round(totalDuration / history.length) 
    : 0

  // Calculate average score across all games
  const allScores = history.flatMap(game => game.topPlayers.map(p => p.points))
  const averageTopScore = allScores.length > 0 
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) 
    : 0

  // Get unique top players
  const playerWins = history.reduce((acc, game) => {
    const winner = game.topPlayers[0]
    if (winner) {
      acc[winner.username] = (acc[winner.username] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topWinners = Object.entries(playerWins)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (selectedReport) {
    return (
      <div className="z-10 flex w-full max-w-4xl flex-col gap-4">
        <button
          onClick={() => setSelectedReport(null)}
          className="w-fit rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
        >
          ← Back to Stats
        </button>
        <GameReportView report={selectedReport} quizSubject={quiz.subject} />
      </div>
    )
  }

  return (
    <div className="z-10 flex w-full max-w-4xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{quiz.subject}</h1>
          <p className="text-gray-500">{quiz.questions.length} questions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{stats?.timesPlayed || 0}</div>
          <div className="text-sm text-gray-500">Times Played</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-blue-500">{stats?.totalPlayers || 0}</div>
          <div className="text-sm text-gray-500">Total Players</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-green-500">{averagePlayersPerGame}</div>
          <div className="text-sm text-gray-500">Avg Players/Game</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-purple-500">{formatDuration(averageDuration)}</div>
          <div className="text-sm text-gray-500">Avg Duration</div>
        </div>
      </div>

      {/* Best Score & Last Played */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats?.bestScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏆</div>
              <div>
                <div className="text-sm opacity-90">Best Score</div>
                <div className="text-2xl font-bold">{stats.bestScore.username}</div>
                <div className="text-xl">{stats.bestScore.points} points</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🕐</div>
            <div>
              <div className="text-sm text-gray-500">Last Played</div>
              <div className="text-xl font-semibold text-gray-800">
                {formatRelativeDate(stats?.lastPlayed)}
              </div>
              {stats?.lastPlayed && (
                <div className="text-sm text-gray-400">
                  {formatDate(stats.lastPlayed)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Winners */}
      {topWinners.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Top Winners</h2>
          </div>
          <div className="divide-y">
            {topWinners.map(([username, wins], index) => (
              <div key={username} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? "bg-yellow-500" :
                    index === 1 ? "bg-gray-400" :
                    index === 2 ? "bg-amber-600" :
                    "bg-gray-300"
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{username}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {wins} win{wins > 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Game History</h2>
        </div>
        
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No games played yet
          </div>
        ) : (
          <div className="divide-y">
            {history.map((game) => (
              <div key={game.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {formatDate(game.playedAt)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{game.playerCount} player{game.playerCount > 1 ? "s" : ""}</span>
                    <span>{formatDuration(game.duration)}</span>
                  </div>
                </div>
                {game.report && (
                  <button
                    onClick={() => setSelectedReport(game.report!)}
                    className="mb-3 rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Voir le rapport
                  </button>
                )}
                
                {/* Podium */}
                <div className="flex items-end justify-center gap-2">
                  {/* 2nd place */}
                  {game.topPlayers[1] && (
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-700 mb-1 truncate max-w-[80px]">
                        {game.topPlayers[1].username}
                      </div>
                      <div className="bg-gray-300 w-20 h-16 rounded-t-lg flex items-center justify-center">
                        <span className="text-2xl">🥈</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{game.topPlayers[1].points} pts</div>
                    </div>
                  )}
                  
                  {/* 1st place */}
                  {game.topPlayers[0] && (
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-700 mb-1 truncate max-w-[80px]">
                        {game.topPlayers[0].username}
                      </div>
                      <div className="bg-yellow-400 w-20 h-24 rounded-t-lg flex items-center justify-center">
                        <span className="text-3xl">🥇</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{game.topPlayers[0].points} pts</div>
                    </div>
                  )}
                  
                  {/* 3rd place */}
                  {game.topPlayers[2] && (
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-700 mb-1 truncate max-w-[80px]">
                        {game.topPlayers[2].username}
                      </div>
                      <div className="bg-amber-600 w-20 h-12 rounded-t-lg flex items-center justify-center">
                        <span className="text-xl">🥉</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{game.topPlayers[2].points} pts</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total play time:</span>
              <span className="ml-2 font-medium">{formatDuration(totalDuration)}</span>
            </div>
            <div>
              <span className="text-gray-500">Avg top score:</span>
              <span className="ml-2 font-medium">{averageTopScore} pts</span>
            </div>
            <div>
              <span className="text-gray-500">Games recorded:</span>
              <span className="ml-2 font-medium">{history.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizStats
