import type { GameUpdateQuestion } from "@rahoot/common/types/game"
import { create } from "zustand"

type QuestionStore = {
  questionStates: GameUpdateQuestion | null
  questionMusic: string | undefined
  answerMusic: string | undefined
  currentAudio: HTMLAudioElement | null
  setQuestionStates: (_state: GameUpdateQuestion | null) => void
  setQuestionMusic: (_music: string | undefined) => void
  setAnswerMusic: (_music: string | undefined) => void
  setCurrentAudio: (_audio: HTMLAudioElement | null) => void
  stopAllMusic: () => void
  clearAll: () => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionStates: null,
  questionMusic: undefined,
  answerMusic: undefined,
  currentAudio: null,
  setQuestionStates: (state) => set({ questionStates: state }),
  setQuestionMusic: (music) => set({ questionMusic: music }),
  setAnswerMusic: (music) => set({ answerMusic: music }),
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  stopAllMusic: () => {
    set((state) => {
      // Stop all currently playing audio
      if (state.currentAudio) {
        state.currentAudio.pause()
        state.currentAudio.currentTime = 0
      }
      return { currentAudio: null }
    })
  },
  clearAll: () => {
    set((state) => {
      // Stop all music and clear state
      if (state.currentAudio) {
        state.currentAudio.pause()
        state.currentAudio.currentTime = 0
      }
      return {
        questionStates: null,
        questionMusic: undefined,
        answerMusic: undefined,
        currentAudio: null,
      }
    })
  },
}))
