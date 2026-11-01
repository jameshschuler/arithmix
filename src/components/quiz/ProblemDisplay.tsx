import { useQuizContext } from '@/contexts/quiz-context'
import { formatProblem } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ProblemDisplay() {
  const { state } = useQuizContext()
  const problem = state.queue[0]

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p aria-label="Problem" className="text-6xl font-semibold tabular-nums">
        {formatProblem(problem)}
      </p>
      <div
        key={state.misses}
        aria-label="Your answer"
        aria-live="polite"
        className={cn(
          'flex h-20 min-w-32 items-center justify-center rounded-lg border-2 border-border bg-muted/30 px-4 text-5xl font-semibold tabular-nums',
          state.misses > 0 && 'animate-miss',
        )}
      >
        {state.input || <span className="text-muted-foreground/40">?</span>}
      </div>
    </div>
  )
}
