import type { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useState } from "react"
import { useParams } from "react-router"

type Props = {
  data: CommonStatusDataMap["FEEDBACK"]
}

const Feedback = ({ data: { question } }: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (selectedRating: number) => {
    socket?.emit("player:feedback", {
      gameId,
      data: {
        rating: selectedRating,
      },
    })
    setSubmitted(true)
  }

  useEvent("game:feedbackConfirmed", () => {
    // Feedback has been received by server
  })

  if (submitted) {
    return (
      <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        <h2 className="text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          Thank you for your feedback!
        </h2>
        <p className="text-center text-xl text-white drop-shadow-lg">
          Your rating has been recorded
        </p>
      </section>
    )
  }

  return (
    <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8">
      <h2 className="text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {question}
      </h2>

      <div className="flex gap-4 flex-wrap justify-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleSubmit(value)}
            className="w-16 h-16 rounded-lg text-2xl font-bold transition-all transform hover:scale-110 active:scale-95"
            style={{
              backgroundColor: getEmojiColor(value),
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            {getEmoji(value)}
          </button>
        ))}
      </div>

      <div className="text-center text-white drop-shadow-lg">
        <p className="text-sm">Click on a rating to submit</p>
      </div>
    </section>
  )
}

function getEmoji(rating: number): string {
  const emojis = ["😢", "😟", "😐", "😊", "😍"]
  return emojis[rating - 1] || "😐"
}

function getEmojiColor(rating: number): string {
  const colors = ["#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E"]
  return colors[rating - 1] || "#6B7280"
}

export default Feedback
