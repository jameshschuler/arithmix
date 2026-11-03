import { useEffect, useState } from 'react'

import { easeOutCubic } from '@/lib/celebration'
import { prefersReducedMotion } from '@/lib/platform'

export function useCountUp(target: number, durationMs: number, enabled: boolean): number {
  const [animate] = useState(() => enabled && !prefersReducedMotion())
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!animate) {
      return
    }

    const startedAt = performance.now()
    let frame = 0

    const tick = () => {
      const progress = (performance.now() - startedAt) / durationMs
      setValue(Math.round(target * easeOutCubic(progress)))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [animate, target, durationMs])

  return animate ? value : target
}
