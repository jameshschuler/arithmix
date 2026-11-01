import { StarRank } from '@/components/shared/StarRank'
import { Stat } from '@/components/shared/Stat'
import { TIER_LABELS } from '@/components/shared/rank-styles'
import { formatElapsed, formatPercent } from '@/lib/format'
import { MODES } from '@/lib/modes'
import { accuracy } from '@/lib/scoring'
import type { Run } from '@/types/quiz'

type ResultsSummaryProps = { run: Run; newPersonalBest: boolean }

export function ResultsSummary({ run, newPersonalBest }: ResultsSummaryProps) {
  const { rank } = run
  const modeLabel = MODES.find((mode) => mode.id === run.mode)?.label

  return (
    <section className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {modeLabel} · {run.duration}s
      </p>
      <StarRank rank={rank} />
      <p className="font-medium">{rank ? TIER_LABELS[rank.tier] : 'Keep practicing'}</p>
      <div className="flex flex-col items-center">
        <span className="text-7xl font-semibold tabular-nums">{run.correct}</span>
        <span className="text-muted-foreground">correct</span>
      </div>
      {newPersonalBest && (
        <p className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
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
