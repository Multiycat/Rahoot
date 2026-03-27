import type { QuizzTheme } from "@rahoot/common/types/game"
import type { Status } from "@rahoot/common/types/game/status"
import background from "@rahoot/web/assets/background.webp"
import Button from "@rahoot/web/features/game/components/Button"
import Loader from "@rahoot/web/features/game/components/Loader"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import { useQuestionStore } from "@rahoot/web/features/game/stores/question"
import { MANAGER_SKIP_BTN } from "@rahoot/web/features/game/utils/constants"
import clsx from "clsx"
import { type PropsWithChildren, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  manager?: boolean
  onBackToManager?: () => void
}

const BACK_TO_MANAGER_STATUSES: Status[] = ["SHOW_ROOM", "FINISHED"]

const GameWrapper = ({ children, statusName, onNext, manager, onBackToManager }: Props) => {
  const navigate = useNavigate()
  const { isConnected } = useSocket()
  const { theme: managerTheme } = useManagerStore()
  const { theme: playerTheme } = usePlayerStore()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
    setIsDisabled(false)
  })

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  const showBackToManager = manager && statusName && BACK_TO_MANAGER_STATUSES.includes(statusName)
  const theme: QuizzTheme = manager ? managerTheme : playerTheme

  const handleBackToManager = () => {
    if (onBackToManager) {
      onBackToManager()
    } else {
      navigate("/manager")
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-game-theme", theme)
  }, [theme])

  return (
    <section className="relative min-h-dvh flex">
      <div className="fixed top-0 left-0 h-full w-full">
        <img
          className="pointer-events-none h-full w-full object-cover"
          src={background}
          alt="background"
        />
        <div className={clsx("theme-overlay absolute inset-0", `theme-${theme}`)}></div>
      </div>

      <div className="z-10 flex flex-1 w-full flex-col justify-between">
        {!isConnected && !statusName ? (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
            <Loader className="h-30" />
            <h1 className="text-4xl font-bold text-white">Connecting...</h1>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-between p-4">
              {showBackToManager && (
                <Button
                  className="bg-gray-700 px-4 text-white hover:bg-gray-800"
                  onClick={handleBackToManager}
                >
                  ← Back to Manager
                </Button>
              )}

              {questionStates && (
                <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
                  {`${questionStates.current} / ${questionStates.total}`}
                </div>
              )}

              <div className="flex gap-2">
                {manager && next && (
                  <Button
                    className={clsx("bg-white px-4 text-black!", {
                      "pointer-events-none": isDisabled,
                    })}
                    onClick={handleNext}
                  >
                    {next}
                  </Button>
                )}
              </div>
            </div>

            {children}

            {!manager && (
              <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
                <p className="text-gray-800">{player?.username}</p>
                <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
                  {player?.points}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default GameWrapper
