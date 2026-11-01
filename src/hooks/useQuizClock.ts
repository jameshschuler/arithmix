import { useEffect, useEffectEvent } from 'react'

export function useQuizClock(endsAt: number | null, onExpire: () => void) {
  const expire = useEffectEvent(onExpire)

  useEffect(() => {
    if (endsAt === null) {
      return
    }

    const timeout = window.setTimeout(expire, Math.max(0, endsAt - performance.now()))

    return () => window.clearTimeout(timeout)
  }, [endsAt])
}
