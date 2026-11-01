import { Star } from 'lucide-react'

import { TIER_LABELS, TIER_STAR_CLASSES } from '@/components/shared/rank-styles'
import { cn } from '@/lib/utils'
import type { Rank } from '@/types/quiz'

const STAR_SLOTS = [1, 2, 3]

type StarRankProps = { rank: Rank | null; className?: string }

export function StarRank({ rank, className }: StarRankProps) {
  const label = rank ? `${TIER_LABELS[rank.tier]}, ${rank.stars} of 3 stars` : 'No stars'

  return (
    <div role="img" aria-label={label} className="flex items-center gap-1">
      {STAR_SLOTS.map((slot) => (
        <Star
          key={slot}
          className={cn(
            'size-10',
            rank && slot <= rank.stars ? TIER_STAR_CLASSES[rank.tier] : 'text-muted-foreground/30',
            className,
          )}
        />
      ))}
    </div>
  )
}
