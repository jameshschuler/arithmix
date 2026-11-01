import { Award } from 'lucide-react'

import type { Achievement } from '@/lib/achievements'
import { formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'

type AchievementTileProps = { achievement: Achievement; unlockedAt?: number }

export function AchievementTile({ achievement, unlockedAt }: AchievementTileProps) {
  const unlocked = unlockedAt !== undefined

  return (
    <li
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-lg px-3 py-3',
        unlocked ? 'border border-gold/40 bg-gold/10' : 'bg-muted/30',
      )}
    >
      <Award className={cn('size-5', unlocked ? 'text-gold' : 'text-muted-foreground/40')} />
      <span className={cn('truncate font-medium', !unlocked && 'text-muted-foreground')}>
        {achievement.name}
      </span>
      <span className="text-xs text-muted-foreground">{achievement.description}</span>
      {unlocked && (
        <span className="mt-auto text-xs text-muted-foreground">{formatDate(unlockedAt)}</span>
      )}
    </li>
  )
}
