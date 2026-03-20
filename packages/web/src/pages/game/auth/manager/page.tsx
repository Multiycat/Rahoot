import type { Quizz, QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import CreateQuizz from "@rahoot/web/features/game/components/create/CreateQuizz"
import ManagerPassword from "@rahoot/web/features/game/components/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/features/game/components/create/SelectQuizz"
import StatsOverview from "@rahoot/web/features/game/components/stats/StatsOverview"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import clsx from "clsx"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

type Tab = "select" | "create" | "stats"

const ManagerAuthPage = () => {
  const { setGameId, setStatus, setMusic } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("select")

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:gameCreated", ({ gameId, inviteCode, music }) => {
    setGameId(gameId)
    setMusic(music)
    setStatus(STATUS.SHOW_ROOM, {
      text: "Waiting for the players",
      inviteCode,
    })
    navigate(`/party/manager/${gameId}`)
  })

  useEvent("manager:quizzSaved", (quizz) => {
    toast.success(`Quizz "${quizz.subject}" saved!`)
    setActiveTab("select")
  })

  useEvent("manager:quizzDeleted", () => {
    toast.success("Quizz deleted!")
  })

  useEvent("manager:errorMessage", (message) => {
    toast.error(message)
  })

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }

  const handleSelectQuizz = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  const handleSaveQuizz = (quizz: Quizz) => {
    socket?.emit("manager:saveQuizz", quizz)
  }

  const handleDeleteQuizz = (quizzId: string) => {
    socket?.emit("manager:deleteQuizz", quizzId)
  }

  const handleExportQuizz = (quizzId: string) => {
    const quizz = quizzList.find((q) => q.id === quizzId)

    if (!quizz) {
      toast.error("Quizz not found")
      return
    }

    const { id, ...quizzWithoutId } = quizz
    const blob = new Blob([JSON.stringify(quizzWithoutId, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    const safeName = quizz.subject.replace(/[^a-z0-9]/gi, "-").toLowerCase()

    anchor.href = url
    anchor.download = `${safeName || "quizz"}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success("Quizz exported")
  }

  const handleImportQuizz = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as Quizz

      if (!parsed.subject || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        toast.error("Invalid quizz JSON")
        return
      }

      socket?.emit("manager:saveQuizz", parsed)
      toast.success("Quizz imported")
    } catch {
      toast.error("Failed to import quizz")
    }
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return (
    <div className="z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-4">
      <div className="flex gap-2 rounded-md bg-white p-2 shadow-sm">
        <button
          onClick={() => setActiveTab("select")}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-lg font-semibold transition-colors",
            activeTab === "select"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Select Quizz
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-lg font-semibold transition-colors",
            activeTab === "create"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Create Quizz
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-lg font-semibold transition-colors",
            activeTab === "stats"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Statistics
        </button>
      </div>

      {activeTab === "select" && (
        <SelectQuizz
          quizzList={quizzList}
          onSelect={handleSelectQuizz}
          onDelete={handleDeleteQuizz}
          onExport={handleExportQuizz}
          onImport={handleImportQuizz}
        />
      )}
      {activeTab === "create" && (
        <CreateQuizz
          onSubmit={handleSaveQuizz}
          onCancel={() => setActiveTab("select")}
        />
      )}
      {activeTab === "stats" && <StatsOverview quizzList={quizzList} />}
    </div>
  )
}

export default ManagerAuthPage
