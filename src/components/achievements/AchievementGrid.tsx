import { useLiveQuery } from 'dexie-react-hooks'

import { AchievementTile } from '@/components/achievements/AchievementTile'
import { Skeleton } from '@/components/ui/skeleton'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { getUnlockedAchievements } from '@/lib/storage'

export function AchievementGrid() {
  const unlocked = useLiveQuery(getUnlockedAchievements)

  if (unlocked === undefined) {
    return <Skeleton className="h-64 w-full rounded-lg" />
  }

  const unlockedAtById = new Map(
    unlocked.map((achievement) => [achievement.id, achievement.unlockedAt]),
  )

  return (
    <section className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        {unlocked.length} of {ACHIEVEMENTS.length} unlocked
      </p>
      <ul className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementTile
            key={achievement.id}
            achievement={achievement}
            unlockedAt={unlockedAtById.get(achievement.id)}
          />
        ))}
      </ul>
    </section>
  )
}
