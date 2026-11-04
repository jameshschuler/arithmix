import { StarRank } from '@/components/shared/StarRank'
import { Stat } from '@/components/shared/Stat'
import { TIER_LABELS } from '@/components/shared/rank-styles'
import { useCountUp } from '@/hooks/useCountUp'
import { achievementRevealDelay, SCORE_COUNT_UP_MS } from '@/lib/celebration'
import { formatElapsed, formatPercent } from '@/lib/format'
import { MODES } from '@/lib/modes'
import { accuracy } from '@/lib/scoring'
import { cn } from '@/lib/utils'
import type { Run } from '@/types/quiz'

type ResultsSummaryProps = { run: Run; newPersonalBest: boolean; celebrate: boolean }

export function ResultsSummary({ run, newPersonalBest, celebrate }: ResultsSummaryProps) {
  const { rank } = run
  const score = useCountUp(run.correct, SCORE_COUNT_UP_MS, celebrate)
  const modeLabel = MODES.find((mode) => mode.id === run.mode)?.label

  return (
    <section className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {modeLabel} · {run.duration}s
      </p>
      <StarRank rank={rank} reveal={celebrate} />
      <p className="font-medium">{rank ? TIER_LABELS[rank.tier] : 'Keep practicing'}</p>
      <div className="flex flex-col items-center">
        <span className="text-7xl font-semibold tabular-nums">{score}</span>
        <span className="text-muted-foreground">correct</span>
      </div>
      {newPersonalBest && (
        <p
          style={
            celebrate
              ? {
                  animationDelay: `${achievementRevealDelay(rank?.stars ?? 0)}s`,
                  animationFillMode: 'both',
                }
              : undefined
          }
          className={cn(
            'rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary',
            celebrate && 'animate-in duration-300 zoom-in-50',
          )}
        >
          New personal best!
        </p>
      )}
      <div className="grid w-full grid-cols-4 gap-2">
        <Stat label="Accuracy" value={formatPercent(accuracy(run))} />
        <Stat label="Misses" value={String(run.misses)} />
        <Stat label="Skips" value={String(run.skips)} />
        <Stat label="Time" value={formatElapsed(run.elapsedMs)} />
      </div>
    </section>
  )
}
