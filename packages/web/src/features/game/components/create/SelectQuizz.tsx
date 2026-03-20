import type { QuizzWithId } from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import clsx from "clsx"
import { useState } from "react"
import toast from "react-hot-toast"

type Props = {
  quizzList: QuizzWithId[]
  onSelect: (_id: string) => void
  onDelete?: (_id: string) => void
}

const SelectQuizz = ({ quizzList, onSelect, onDelete }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (id: string) => () => {
    if (selected === id) {
      setSelected(null)
    } else {
      setSelected(id)
    }
  }

  const handleSubmit = () => {
    if (!selected) {
      toast.error("Please select a quizz")

      return
    }

    onSelect(selected)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (onDelete && confirm("Are you sure you want to delete this quizz?")) {
      onDelete(id)
      if (selected === id) {
        setSelected(null)
      }
    }
  }

  return (
    <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl font-bold">Select a quizz</h1>
        <div className="w-full space-y-2">
          {quizzList.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No quizz available. Create one first!
            </p>
          ) : (
            quizzList.map((quizz) => (
              <button
                key={quizz.id}
                className={clsx(
                  "flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300",
                )}
                onClick={handleSelect(quizz.id)}
              >
                <div className="flex flex-col items-start">
                  <span>{quizz.subject}</span>
                  <span className="text-xs text-gray-500">
                    {quizz.questions.length} question{quizz.questions.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onDelete && (
                    <button
                      onClick={(e) => handleDelete(e, quizz.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-100"
                      title="Delete quizz"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <div
                    className={clsx(
                      "h-5 w-5 rounded outline outline-offset-3 outline-gray-300",
                      selected === quizz.id &&
                        "bg-primary border-primary/80 shadow-inset",
                    )}
                  ></div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={!selected}>
        Start Game
      </Button>
    </div>
  )
}

export default SelectQuizz
