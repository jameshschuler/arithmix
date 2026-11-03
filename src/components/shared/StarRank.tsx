import { Star } from 'lucide-react'

import { TIER_LABELS, TIER_STAR_CLASSES } from '@/components/shared/rank-styles'
import { starRevealDelay } from '@/lib/celebration'
import { cn } from '@/lib/utils'
import type { Rank } from '@/types/quiz'

const STAR_SLOTS = [0, 1, 2]

type StarRankProps = { rank: Rank | null; reveal?: boolean; className?: string }

export function StarRank({ rank, reveal = false, className }: StarRankProps) {
  const label = rank ? `${TIER_LABELS[rank.tier]}, ${rank.stars} of 3 stars` : 'No stars'

  return (
    <div role="img" aria-label={label} className="flex items-center gap-1">
      {STAR_SLOTS.map((slot) => {
        const earned = rank !== null && slot < rank.stars

        return (
          <Star
            key={slot}
            style={
              reveal && earned
                ? { animationDelay: `${starRevealDelay(slot)}s`, animationFillMode: 'both' }
                : undefined
            }
            className={cn(
              'size-10',
              earned ? TIER_STAR_CLASSES[rank.tier] : 'text-muted-foreground/30',
              reveal && earned && 'animate-in duration-500 zoom-in-0 spin-in-45',
              className,
            )}
          />
        )
      })}
    </div>
  )
}
