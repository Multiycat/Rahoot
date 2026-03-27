import type { Player, QuizzMusic, QuizzTheme } from "@rahoot/common/types/game"
import type { StatusDataMap } from "@rahoot/common/types/game/status"
import {
  createStatus,
  type Status,
} from "@rahoot/web/features/game/utils/createStatus"
import { create } from "zustand"

type ManagerStore<T> = {
  gameId: string | null
  status: Status<T> | null
  players: Player[]
  music: QuizzMusic | undefined
  theme: QuizzTheme

  setGameId: (_gameId: string | null) => void
  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void
  resetStatus: () => void
  setPlayers: (_players: Player[]) => void
  setMusic: (_music: QuizzMusic | undefined) => void
  setTheme: (_theme: QuizzTheme) => void

  reset: () => void
}

const initialState = {
  gameId: null,
  status: null,
  players: [],
  music: undefined,
  theme: "classic" as QuizzTheme,
}

export const useManagerStore = create<ManagerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: null }),

  setPlayers: (players) => set({ players }),
  setMusic: (music) => set({ music }),
  setTheme: (theme) => set({ theme }),

  reset: () => set(initialState),
}))
