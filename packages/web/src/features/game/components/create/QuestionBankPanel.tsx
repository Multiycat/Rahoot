import type { QuestionBankItem, QuizzQuestion } from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import clsx from "clsx"
import { useMemo, useState } from "react"

type Props = {
  items: QuestionBankItem[]
  onInsert: (_question: QuizzQuestion) => void
  onDelete: (_id: string) => void
}

const QuestionBankPanel = ({ items, onInsert, onDelete }: Props) => {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((item) => {
      const text = [item.question.question, ...item.question.answers].join(" ").toLowerCase()
      return text.includes(normalized)
    })
  }, [items, query])

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Question Bank</h3>
        <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">{items.length}</span>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="mb-3 w-full rounded bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="max-h-60 space-y-2 overflow-auto pr-1">
        {filtered.length === 0 && (
          <p className="rounded bg-gray-700 p-2 text-xs text-gray-400">No question found.</p>
        )}

        {filtered.map((item) => (
          <div key={item.id} className="rounded bg-gray-700 p-2">
            <p className="line-clamp-2 text-xs font-semibold text-white">{item.question.question}</p>
            <p className="mt-1 text-[11px] text-gray-300">{item.question.answers.length} answers</p>
            <div className="mt-2 flex gap-2">
              <Button
                className="flex-1 bg-orange-500 px-2 py-1 text-xs text-white hover:bg-orange-600"
                onClick={() => onInsert(item.question)}
              >
                Insert
              </Button>
              <button
                className={clsx(
                  "rounded bg-red-500/30 px-2 py-1 text-xs font-semibold text-red-100",
                  "hover:bg-red-500/50",
                )}
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionBankPanel
