import { useEffect, useState } from 'react'

import { useQuizContext } from '@/contexts/quiz-context'
import { sounds } from '@/lib/audio'

const COUNTDOWN_FROM = 3

export function Countdown() {
  const { actions } = useQuizContext()
  const [count, setCount] = useState(COUNTDOWN_FROM)

  useEffect(() => {
    sounds.countdownTick()
  }, [count])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        sounds.go()
        actions.start(performance.now())
      }
    }, 1000)

    return () => window.clearTimeout(timeout)
  }, [count, actions])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <p className="text-muted-foreground">Get ready</p>
      <span
        key={count}
        className="animate-in text-8xl font-semibold text-primary tabular-nums duration-300 zoom-in-50 fade-in"
      >
        {count}
      </span>
    </div>
  )
}
