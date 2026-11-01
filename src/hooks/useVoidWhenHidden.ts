import { useEffect, useEffectEvent } from 'react'

export function useVoidWhenHidden(active: boolean, onHidden: () => void) {
  const hide = useEffectEvent(onHidden)

  useEffect(() => {
    if (!active) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hide()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [active])
}
