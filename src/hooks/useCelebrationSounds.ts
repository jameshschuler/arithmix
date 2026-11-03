import { useEffect } from 'react'

import { sounds } from '@/lib/audio'
import { achievementRevealDelay, starRevealDelay } from '@/lib/celebration'
import { prefersReducedMotion } from '@/lib/platform'

export function useCelebrationSounds(enabled: boolean, stars: number, achievements: number) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const stagger = !prefersReducedMotion()
    sounds.finish()

    for (let index = 0; index < stars; index++) {
      sounds.star(index, stagger ? starRevealDelay(index) : 0)
    }

    if (achievements > 0) {
      sounds.achievement(stagger ? achievementRevealDelay(stars) : 0)
    }
  }, [enabled, stars, achievements])
}
