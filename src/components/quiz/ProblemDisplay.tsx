import { useQuizContext } from '@/contexts/quiz-context'
import { formatProblem } from '@/lib/format'
import { lastOutcome, type Outcome } from '@/lib/quiz'
import { cn } from '@/lib/utils'

const OUTCOME_ANIMATIONS: Record<Outcome, string> = {
  correct: 'animate-correct',
  miss: 'animate-miss',
}

export function ProblemDisplay() {
  const { state } = useQuizContext()
  const problem = state.queue[0]
  const outcome = lastOutcome(state.events)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p
        key={`problem-${problem.id}-${state.skips}`}
        aria-label="Problem"
        className="animate-in text-6xl font-semibold tabular-nums duration-150 fade-in slide-in-from-right-6"
      >
        {formatProblem(problem)}
      </p>
      <div
        key={`answer-${state.correct}-${state.misses}`}
        aria-label="Your answer"
        aria-live="polite"
        className={cn(
          'flex h-20 min-w-32 items-center justify-center rounded-lg border-2 border-border bg-muted/30 px-4 text-5xl font-semibold tabular-nums',
          outcome && OUTCOME_ANIMATIONS[outcome],
        )}
      >
        {state.input || <span className="text-muted-foreground/40">?</span>}
      </div>
    </div>
  )
}
