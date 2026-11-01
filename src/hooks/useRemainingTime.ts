import { useEffect, useState } from 'react'

export function useRemainingTime(endsAt: number): number {
  const [remaining, setRemaining] = useState(() => endsAt - performance.now())

  useEffect(() => {
    let frame = 0

    const tick = () => {
      const next = endsAt - performance.now()
      setRemaining(next)

      if (next > 0) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [endsAt])

  return remaining
}
