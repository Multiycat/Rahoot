import {
  SocketProvider,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useEffect } from "react"
import { Outlet, useLocation } from "react-router"

const Copyright = () => (
  <div className="fixed bottom-2 left-0 right-0 z-50 text-center">
    <span className="text-xs text-white/50">
      © {new Date().getFullYear()} Multiycat. All rights reserved.
    </span>
  </div>
)

const GameLayoutWrapped = () => {
  const { isConnected, connect } = useSocket()
  const location = useLocation()
  
  // Hide copyright on game party pages (during active games)
  const isPartyPage = location.pathname.includes("/party/")
  
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEffect(() => {
    document.body.classList.add("bg-secondary")

    return () => {
      document.body.classList.remove("bg-secondary")
    }
  }, [])

  return (
    <div className="antialiased bg-secondary min-h-dvh">
      <Outlet />
      {!isPartyPage && <Copyright />}
    </div>
  )
}

export const GameLayout = () => (
  <SocketProvider>
    <GameLayoutWrapped />
  </SocketProvider>
)
