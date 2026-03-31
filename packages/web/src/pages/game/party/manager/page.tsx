import GameWrapper from "@rahoot/web/features/game/components/GameWrapper"
import FeedbackResults from "@rahoot/web/features/game/components/FeedbackResults"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useMusic } from "@rahoot/web/features/game/hooks/useMusic"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import { useQuestionStore } from "@rahoot/web/features/game/stores/question"
import {
  GAME_STATE_COMPONENTS_MANAGER,
  MANAGER_SKIP_EVENTS,
  isKeyOf,
} from "@rahoot/web/features/game/utils/constants"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router"

const ManagerGamePage = () => {
  const navigate = useNavigate()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { gameId, status, music, setGameId, setStatus, setPlayers, setMusic, setTheme, reset } =
    useManagerStore()
  const { setQuestionStates } = useQuestionStore()

  // Use custom music if available
  useMusic({
    music,
    status: status?.name,
    volume: 0.3,
    enabled: !!music,
  })

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS_MANAGER) {
      setStatus(name, data)
    }
  })

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("manager:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent(
    "manager:successReconnect",
    ({ gameId, status, players, currentQuestion, music, theme }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayers(players)
      setQuestionStates(currentQuestion)
      setMusic(music)
      setTheme(theme || "classic")
    },
  )

  useEvent("game:theme", (theme) => {
    setTheme(theme)
  })

  useEvent("game:reset", (message) => {
    navigate("/manager")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  const handleSkip = () => {
    if (!gameId || !status) {
      return
    }

    if (isKeyOf(MANAGER_SKIP_EVENTS, status.name)) {
      socket?.emit(MANAGER_SKIP_EVENTS[status.name], { gameId })
    }
  }

  const handleBackToManager = () => {
    reset()
    setQuestionStates(null)
    navigate("/manager")
  }

  const CurrentComponent =
    status && isKeyOf(GAME_STATE_COMPONENTS_MANAGER, status.name)
      ? GAME_STATE_COMPONENTS_MANAGER[status.name]
      : null

  return (
    <>
      <FeedbackResults />
      <GameWrapper 
        statusName={status?.name} 
        onNext={handleSkip} 
        manager
        onBackToManager={handleBackToManager}
      >
        {CurrentComponent && <CurrentComponent data={status!.data as never} />}
      </GameWrapper>
    </>
  )
}

export default ManagerGamePage
