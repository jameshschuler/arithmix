import { useQuizContext } from '@/contexts/quiz-context'
import { useRemainingTime } from '@/hooks/useRemainingTime'
import { formatSeconds } from '@/lib/format'
import { cn } from '@/lib/utils'

const LOW_TIME_MS = 5000

export function TimerBar() {
  const { state } = useQuizContext()
  const remaining = useRemainingTime(state.endsAt)
  const fraction = Math.max(0, remaining / (state.duration * 1000))
  const lowTime = remaining <= LOW_TIME_MS

  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full origin-left bg-primary', lowTime && 'bg-destructive')}
          style={{ transform: `scaleX(${fraction})` }}
        />
      </div>
      <span
        role="timer"
        aria-label="Seconds left"
        className={cn(
          'w-8 text-right text-lg font-medium tabular-nums',
          lowTime && 'animate-pulse text-destructive',
        )}
      >
        {formatSeconds(remaining)}
      </span>
    </div>
  )
}
