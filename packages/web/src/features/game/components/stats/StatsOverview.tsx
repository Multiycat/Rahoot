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
    <div className="stats-shell z-10 flex w-full max-w-5xl flex-col gap-6 rounded-3xl p-2">
      <div className="glass-card relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-orange-300/40 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-300/35 blur-3xl"></div>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Rahoot Analytics</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">Beautiful game intelligence</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Track engagement, winners, and quiz quality in one visual dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="glass-card lift-card rounded-2xl p-4">
          <div className="text-3xl font-black text-primary">{globalStats.totalGames}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Total Games</div>
        </div>
        <div className="glass-card lift-card rounded-2xl p-4">
          <div className="text-3xl font-black text-blue-500">{globalStats.totalPlayers}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Total Players</div>
        </div>
        <div className="glass-card lift-card rounded-2xl p-4">
          <div className="text-3xl font-black text-green-500">{averagePlayersPerGame}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Avg Players/Game</div>
        </div>
        <div className="glass-card lift-card rounded-2xl p-4">
          <div className="text-3xl font-black text-purple-500">{formatDuration(globalStats.totalDuration)}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Total Play Time</div>
        </div>
      </div>

      {globalStats.bestScore && (
        <div className="lift-card rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-5 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.15em] opacity-85">All-Time Best Score</div>
              <div className="text-2xl font-black">{globalStats.bestScore.username}</div>
              <div className="text-sm font-medium opacity-95">
                {globalStats.bestScore.points} pts on "{globalStats.bestScore.quizSubject}"
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/70 px-4 py-3">
          <h2 className="text-lg font-bold text-gray-800">Quiz Statistics</h2>
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">{quizzList.length} quizzes</span>
        </div>

        {quizzList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No quizzes yet. Create your first quiz!</div>
        ) : (
          <div className="divide-y divide-gray-100/80">
            {sortedQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz)}
                className="w-full p-4 text-left transition-colors hover:bg-orange-50/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{quiz.subject}</div>
                    <div className="text-sm text-gray-500">
                      {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-center">
                      <div className="font-bold text-primary">{quiz.stats?.timesPlayed || 0}</div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-400">plays</div>
                    </div>
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-center">
                      <div className="font-bold text-blue-500">{quiz.stats?.totalPlayers || 0}</div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-400">players</div>
                    </div>
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-center">
                      <div className="font-bold text-yellow-500">{quiz.stats?.bestScore?.points || 0}</div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-400">best</div>
                    </div>
                    <div className="rounded-lg bg-white/70 px-3 py-2 text-right">
                      <div className="text-xs font-semibold text-gray-500">Last played</div>
                      <div className="text-xs text-gray-600">{formatDate(quiz.stats?.lastPlayed)}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {globalStats.totalGames > 0 && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-white/60 bg-white/70 px-4 py-3">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100/80">
            {sortedQuizzes
              .flatMap((quiz) =>
                (quiz.stats?.history || []).map((game) => ({
                  ...game,
                  quizSubject: quiz.subject,
                })),
              )
              .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
              .slice(0, 10)
              .map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-semibold text-gray-800">{game.quizSubject}</div>
                    <div className="text-sm text-gray-500">
                      {game.playerCount} player{game.playerCount > 1 ? "s" : ""} • {formatDuration(game.duration)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-600">{game.topPlayers[0]?.username || "No winner"}</div>
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
