import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/features/game/components/Button"
import Form from "@rahoot/web/features/game/components/Form"
import Input from "@rahoot/web/features/game/components/Input"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"

import { type KeyboardEvent, useState } from "react"
import { useNavigate } from "react-router"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus, setTheme } = usePlayerStore()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    socket?.emit("player:login", { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", ({ gameId, theme }) => {
    setStatus(STATUS.WAIT, { text: "Waiting for the players" })
    setTheme(theme || "classic")
    login(username)

    navigate(`/party/${gameId}`)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Username here"
      />
      <Button onClick={handleLogin}>Submit</Button>
    </Form>
  )
}

export default Username
