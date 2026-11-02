import { AchievementGrid } from '@/components/achievements/AchievementGrid'
import { PageHeader } from '@/components/shared/PageHeader'

export function AchievementsRoute() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Achievements" />
      <AchievementGrid />
    </div>
  )
}
