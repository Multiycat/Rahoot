import type { GameUpdateQuestion } from "@rahoot/common/types/game"
import { create } from "zustand"

type QuestionStore = {
  questionStates: GameUpdateQuestion | null
  questionMusic: string | undefined
  setQuestionStates: (_state: GameUpdateQuestion | null) => void
  setQuestionMusic: (_music: string | undefined) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionStates: null,
  questionMusic: undefined,
  setQuestionStates: (state) => set({ questionStates: state }),
  setQuestionMusic: (music) => set({ questionMusic: music }),
}))
