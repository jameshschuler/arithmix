import { useEffect } from 'react'

import { sounds, vibrate } from '@/lib/audio'
import type { QuizState } from '@/lib/quiz'

const MISS_VIBRATION_MS = 60

export function useQuizSounds({ correct, misses, skips }: QuizState) {
  useEffect(() => {
    if (correct > 0) {
      sounds.correct()
    }
  }, [correct])

  useEffect(() => {
    if (misses > 0) {
      sounds.miss()
      vibrate(MISS_VIBRATION_MS)
    }
  }, [misses])

  useEffect(() => {
    if (skips > 0) {
      sounds.skip()
    }
  }, [skips])
}
