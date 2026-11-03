import { useEffect } from 'react'

import { startMusic } from '@/lib/audio'
import { HURRY_WHEN_MS_LEFT } from '@/lib/music'

export function useQuizMusic(endsAt: number | null) {
  useEffect(() => {
    if (endsAt === null) {
      return
    }

    const music = startMusic()

    if (!music) {
      return
    }

    const hurry = window.setTimeout(
      music.hurry,
      Math.max(0, endsAt - HURRY_WHEN_MS_LEFT - performance.now()),
    )

    return () => {
      window.clearTimeout(hurry)
      music.stop()
    }
  }, [endsAt])
}
