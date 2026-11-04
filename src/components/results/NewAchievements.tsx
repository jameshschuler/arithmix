import { Award } from 'lucide-react'

import { ACHIEVEMENTS_BY_ID } from '@/lib/achievements'
import type { UnlockedAchievement } from '@/types/quiz'

type NewAchievementsProps = { unlocked: UnlockedAchievement[]; revealDelay?: number }

export function NewAchievements({ unlocked, revealDelay = 0 }: NewAchievementsProps) {
  const achievements = unlocked.flatMap(({ id }) => ACHIEVEMENTS_BY_ID.get(id) ?? [])

  if (achievements.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">Achievements unlocked</h2>
      <ul className="flex flex-col gap-2">
        {achievements.map(({ id, name, description }) => (
          <li
            key={id}
            style={{ animationDelay: `${revealDelay}s`, animationFillMode: 'both' }}
            className="flex animate-in items-center gap-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 duration-500 fade-in slide-in-from-bottom-2"
          >
            <Award className="size-5 shrink-0 text-gold" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{description}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
