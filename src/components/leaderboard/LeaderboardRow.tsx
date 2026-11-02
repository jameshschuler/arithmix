import { StarRank } from '@/components/shared/StarRank'
import { formatDate } from '@/lib/dates'
import { formatElapsed } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Run } from '@/types/quiz'

type LeaderboardRowProps = { run: Run; place: number }

export function LeaderboardRow({ run, place }: LeaderboardRowProps) {
  return (
    <li
      className={cn(
        'flex h-14 items-center gap-3 rounded-lg px-3',
        place === 1 ? 'bg-primary/10' : 'bg-muted/30',
      )}
    >
      <span className="w-6 text-sm font-medium text-muted-foreground tabular-nums">{place}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium tabular-nums">{run.correct} correct</span>
        <span className="truncate text-xs text-muted-foreground">
          {[
            run.nickname,
            formatDate(run.playedAt),
            run.finishedEarly && formatElapsed(run.elapsedMs),
          ]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </div>
      <StarRank rank={run.rank} className="size-4" />
    </li>
  )
}
