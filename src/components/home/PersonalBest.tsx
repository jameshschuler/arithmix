import { useLiveQuery } from 'dexie-react-hooks'

import { TIER_LABELS } from '@/components/shared/rank-styles'
import { StarRank } from '@/components/shared/StarRank'
import { Skeleton } from '@/components/ui/skeleton'
import { getPersonalBest } from '@/lib/storage'
import type { Duration, Mode } from '@/types/quiz'

type PersonalBestProps = { mode: Mode; duration: Duration }

export function PersonalBest({ mode, duration }: PersonalBestProps) {
  const best = useLiveQuery(() => getPersonalBest(mode, duration), [mode, duration])

  if (best === undefined) {
    return <Skeleton className="h-16 w-full rounded-lg" />
  }

  return (
    <div className="flex h-16 items-center justify-between gap-3 rounded-lg bg-muted/50 px-4">
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">Personal best</span>
        <span className="truncate font-medium">
          {best
            ? `${best.correct} correct${best.rank ? ` · ${TIER_LABELS[best.rank.tier]}` : ''}`
            : 'Not played yet'}
        </span>
      </div>
      {best?.rank && <StarRank rank={best.rank} className="size-5" />}
    </div>
  )
}
