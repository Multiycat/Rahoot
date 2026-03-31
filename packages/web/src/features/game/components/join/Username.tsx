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

// Regex pattern: Name Initial. (e.g., Jean B.)
const USERNAME_PATTERN = /^[A-Z][a-z]*(\s[A-Z][a-z]*)* [A-Z]\.$/

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus, setTheme } = usePlayerStore()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const isValidUsername = username.length > 0 && USERNAME_PATTERN.test(username)

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    if (!isValidUsername) {
      setError("Username must follow the pattern: Name Initial. (e.g., Jean B.)")
      return
    }

    socket?.emit("player:login", { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    // Clear error when user starts typing if it becomes valid
    if (USERNAME_PATTERN.test(value)) {
      setError("")
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
        onChange={handleUsernameChange}
        onKeyDown={handleKeyDown}
        placeholder="Name Initial. (e.g., Jean B.)"
        value={username}
      />
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      <Button onClick={handleLogin} disabled={!isValidUsername}>
        Submit
      </Button>
    </Form>
  )
}

export default Username
