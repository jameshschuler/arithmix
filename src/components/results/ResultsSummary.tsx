import { StarRank } from '@/components/shared/StarRank'
import { Stat } from '@/components/shared/Stat'
import { TIER_LABELS } from '@/components/shared/rank-styles'
import { formatElapsed, formatPercent } from '@/lib/format'
import { MODES } from '@/lib/modes'
import { accuracy, rankFor } from '@/lib/scoring'
import type { QuizResult } from '@/types/quiz'

type ResultsSummaryProps = { result: QuizResult }

export function ResultsSummary({ result }: ResultsSummaryProps) {
  const rank = rankFor(result)
  const modeLabel = MODES.find((mode) => mode.id === result.mode)?.label

  return (
    <section className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {modeLabel} · {result.duration}s
      </p>
      <StarRank rank={rank} />
      <p className="font-medium">{rank ? TIER_LABELS[rank.tier] : 'Keep practicing'}</p>
      <div className="flex flex-col items-center">
        <span className="text-7xl font-semibold tabular-nums">{result.correct}</span>
        <span className="text-muted-foreground">correct</span>
      </div>
      <div className="grid w-full grid-cols-4 gap-2">
        <Stat label="Accuracy" value={formatPercent(accuracy(result))} />
        <Stat label="Misses" value={String(result.misses)} />
        <Stat label="Skips" value={String(result.skips)} />
        <Stat label="Time" value={formatElapsed(result.elapsedMs)} />
      </div>
    </section>
  )
}
