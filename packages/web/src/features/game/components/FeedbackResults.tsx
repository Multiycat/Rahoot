import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import Button from "@rahoot/web/features/game/components/Button"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useState } from "react"

const FeedbackResults = () => {
  const { socket } = useSocket()
  const { gameId } = useManagerStore()
  const [feedbackList, setFeedbackList] = useState<
    { username: string; rating: number }[]
  >([])
  const [isOpen, setIsOpen] = useState(false)

  useEvent("manager:feedbackReceived", (data) => {
    setFeedbackList((prev) => [...prev, data])
  })

  const closeFeedback = () => {
    if (!gameId) return
    socket?.emit("manager:closeFeedback", {
      gameId,
    })
  }

  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length
        ).toFixed(1)
      : "0"

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)}>
          📊 Feedback ({feedbackList.length})
        </Button>
      )}

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-white rounded-lg shadow-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Feedback Results</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {feedbackList.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm mb-3">
                Waiting for player feedback...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-blue-600">{averageRating}</p>
                <p className="text-xs text-gray-500">out of 5</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Distribution
                </h4>
                {[1, 2, 3, 4, 5].map((rating) => {
                  const count = feedbackList.filter((f) => f.rating === rating).length
                  const percentage =
                    feedbackList.length > 0
                      ? Math.round((count / feedbackList.length) * 100)
                      : 0
                  return (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold w-6 text-gray-600">
                        {rating}⭐
                      </span>
                      <div className="flex-1 bg-gray-200 rounded h-2">
                        <div
                          className="bg-blue-500 h-full rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-3 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Responses
                </h4>
                {feedbackList.map((feedback, idx) => (
                  <div key={idx} className="text-xs py-1 px-2 bg-gray-50 rounded mb-1">
                    <p className="text-gray-800 font-medium">
                      {feedback.username}: {feedback.rating}⭐
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={closeFeedback}
                className="w-full mt-3 bg-green-500 hover:bg-green-600"
              >
                Close Feedback
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedbackResults
