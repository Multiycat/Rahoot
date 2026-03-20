import type { QuizzMusic } from "@rahoot/common/types/game"
import type { Status } from "@rahoot/common/types/game/status"
import { useCallback, useEffect, useRef, useState } from "react"

// Map status to music key
const STATUS_TO_MUSIC: Record<string, keyof QuizzMusic> = {
  SHOW_ROOM: "lobby",
  SHOW_START: "lobby",
  SHOW_PREPARED: "question",
  SHOW_QUESTION: "question",
  SELECT_ANSWER: "answer",
  SHOW_RESULT: "results",
  SHOW_RESPONSES: "results",
  SHOW_LEADERBOARD: "leaderboard",
  FINISHED: "podium",
  WAIT: "lobby",
}

type UseMusicOptions = {
  music?: QuizzMusic
  status?: Status
  volume?: number
  enabled?: boolean
}

export const useMusic = ({ music, status, volume = 0.5, enabled = true }: UseMusicOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  const play = useCallback((url: string) => {
    if (!url || !enabled) return

    // If same track is already playing, don't restart
    if (currentTrack === url && isPlaying) return

    stop()

    try {
      audioRef.current = new Audio(url)
      audioRef.current.volume = volume
      audioRef.current.loop = true
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setCurrentTrack(url)
        })
        .catch((error) => {
          console.warn("Failed to play music:", error)
        })
    } catch (error) {
      console.warn("Failed to create audio:", error)
    }
  }, [enabled, volume, currentTrack, isPlaying, stop])

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))
    }
  }, [])

  // Play music based on status
  useEffect(() => {
    if (!music || !status || !enabled) {
      stop()
      return
    }

    const musicKey = STATUS_TO_MUSIC[status]
    if (!musicKey) {
      stop()
      return
    }

    const trackUrl = music[musicKey]
    if (trackUrl) {
      play(trackUrl)
    } else {
      stop()
    }
  }, [music, status, enabled, play, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return {
    isPlaying,
    currentTrack,
    play,
    stop,
    setVolume,
  }
}

export default useMusic
