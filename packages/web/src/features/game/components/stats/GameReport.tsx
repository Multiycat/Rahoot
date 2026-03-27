import type { GameReport as GameReportType } from "@rahoot/common/types/game"
import clsx from "clsx"
import { useMemo, useState } from "react"

type Props = {
  report: GameReportType
  quizSubject: string
}

type Tab = "summary" | "participants" | "questions"

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins} min ${secs}s`
}

const formatMs = (ms: number): string => `${(ms / 1000).toFixed(2)}s`

const downloadReportAsPdf = (report: GameReportType, quizSubject: string) => {
  const rows = report.players
    .map(
      (player) =>
        `<tr><td>${player.rank}</td><td>${player.username}</td><td>${player.finalPoints}</td><td>${player.accuracy}%</td><td>${formatMs(player.averageResponseTime)}</td></tr>`,
    )
    .join("")

  const html = `
  <html>
    <head>
      <title>Report - ${quizSubject}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
        h1 { margin: 0; font-size: 28px; }
        h2 { margin-top: 28px; font-size: 20px; }
        .muted { color: #6b7280; margin-top: 8px; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top: 16px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 13px; }
        th { background: #f9fafb; }
      </style>
    </head>
    <body>
      <h1>${quizSubject}</h1>
      <p class="muted">Played at ${new Date(report.playedAt).toLocaleString()}</p>

      <div class="grid">
        <div class="card"><b>Participants</b><div>${report.totalPlayers}</div></div>
        <div class="card"><b>Questions</b><div>${report.totalQuestions}</div></div>
        <div class="card"><b>Overall accuracy</b><div>${report.overallAccuracy}%</div></div>
      </div>

      <h2>Participants</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
            <th>Accuracy</th>
            <th>Avg response</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
  </html>
  `

  const popup = window.open("", "_blank", "noopener,noreferrer,width=1000,height=900")
  if (!popup) {
    return
  }

  popup.document.open()
  popup.document.write(html)
  popup.document.close()
  popup.focus()
  popup.print()
}

const GameReport = ({ report, quizSubject }: Props) => {
  const [tab, setTab] = useState<Tab>("summary")

  const difficultQuestions = useMemo(
    () => report.questions.filter((q) => q.accuracy < 50),
    [report.questions],
  )

  const playersNeedHelp = useMemo(
    () => report.players.filter((p) => p.accuracy < 50),
    [report.players],
  )

  const ringStyle = {
    background: `conic-gradient(#16a34a ${report.overallAccuracy * 3.6}deg, #e5e7eb 0deg)`,
  }

  return (
    <div className="stats-shell rounded-3xl p-2">
      <div className="glass-card rounded-2xl p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">Rapport</p>
          <h2 className="text-2xl font-black text-gray-900">{quizSubject}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadReportAsPdf(report, quizSubject)}
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
          >
            Export PDF
          </button>
          <div className="rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
            En live • {report.totalPlayers} participants
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2 border-b border-gray-200">
        {[
          ["summary", "Synthese"],
          ["participants", `Participants (${report.players.length})`],
          ["questions", `Questions (${report.questions.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={clsx(
              "border-b-2 px-3 py-2 text-sm font-semibold",
              tab === key
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="grid gap-4 md:grid-cols-12">
          <div className="lift-card rounded-2xl bg-white p-5 shadow-sm md:col-span-6">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 rounded-full" style={ringStyle}>
                <div className="absolute inset-2 grid place-items-center rounded-full bg-white text-center">
                  <p className="text-2xl font-bold text-gray-900">{report.overallAccuracy}%</p>
                  <p className="text-xs font-semibold text-gray-600">bonnes reponses</p>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">La cle, c'est de s'entrainer !</h3>
                <p className="mt-1 text-gray-700">Rejoue et compare les performances.</p>
              </div>
            </div>
          </div>

          <div className="lift-card rounded-2xl bg-white p-5 shadow-sm md:col-span-3">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between"><span>Participants</span><b>{report.totalPlayers}</b></div>
              <div className="flex items-center justify-between"><span>Questions</span><b>{report.totalQuestions}</b></div>
              <div className="flex items-center justify-between"><span>Duree</span><b>{formatDuration(report.duration)}</b></div>
            </div>
          </div>

          <div className="lift-card rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 p-5 text-white shadow-sm md:col-span-3">
            <p className="text-sm">Podium</p>
            <p className="mt-1 text-2xl font-extrabold">Top 3</p>
          </div>

          <div className="lift-card rounded-2xl bg-white p-4 shadow-sm md:col-span-6">
            <h4 className="mb-3 text-lg font-bold">Questions difficiles ({difficultQuestions.length})</h4>
            <div className="space-y-2">
              {difficultQuestions.slice(0, 5).map((q) => (
                <div key={q.questionIndex} className="rounded border border-gray-200 p-3">
                  <p className="font-semibold">Q{q.questionIndex + 1} - {q.question}</p>
                  <p className="text-sm text-gray-600">{q.accuracy}% • Moy. {formatMs(q.averageResponseTime)}</p>
                </div>
              ))}
              {difficultQuestions.length === 0 && <p className="text-sm text-gray-600">Aucune question difficile.</p>}
            </div>
          </div>

          <div className="lift-card rounded-2xl bg-white p-4 shadow-sm md:col-span-3">
            <h4 className="mb-3 text-lg font-bold">Aide requise ({playersNeedHelp.length})</h4>
            <div className="space-y-2 text-sm">
              {playersNeedHelp.slice(0, 7).map((p) => (
                <div key={p.username} className="flex items-center justify-between">
                  <span>{p.username}</span><b>{p.accuracy}%</b>
                </div>
              ))}
            </div>
          </div>

          <div className="lift-card rounded-2xl bg-white p-4 shadow-sm md:col-span-3">
            <h4 className="mb-3 text-lg font-bold">Non termine ({report.playersNotFinished.length})</h4>
            <div className="space-y-2 text-sm">
              {report.playersNotFinished.slice(0, 7).map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <span>{name}</span><b>1</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "participants" && (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-[40px_1fr_120px_120px_120px] gap-2 border-b pb-2 text-xs font-semibold text-gray-500">
            <span>#</span><span>Joueur</span><span>Points</span><span>Precision</span><span>Temps moyen</span>
          </div>
          <div className="divide-y">
            {report.players.map((p) => (
              <div key={p.username} className="grid grid-cols-[40px_1fr_120px_120px_120px] gap-2 py-2 text-sm">
                <span>{p.rank}</span>
                <span className="font-semibold text-gray-800">{p.username}</span>
                <span>{p.finalPoints}</span>
                <span>{p.accuracy}%</span>
                <span>{formatMs(p.averageResponseTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div className="space-y-3">
          {report.questions.map((q) => (
            <div key={q.questionIndex} className="lift-card rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-bold">Q{q.questionIndex + 1} - {q.question}</h4>
                <span className="text-sm font-semibold text-gray-700">{q.accuracy}%</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1 text-sm">
                  {q.answerDistribution.map((a) => (
                    <div key={a.answerId} className="flex items-center justify-between">
                      <span>{a.answer}</span>
                      <b>{a.percentage}% ({a.count})</b>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-700">
                  <p>Total reponses: <b>{q.totalResponses}</b></p>
                  <p>Bonnes reponses: <b>{q.correctResponses}</b></p>
                  <p>Temps moyen: <b>{formatMs(q.averageResponseTime)}</b></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default GameReport
