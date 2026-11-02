import { useState } from 'react'

import { LeaderboardList } from '@/components/leaderboard/LeaderboardList'
import { OptionGroup } from '@/components/shared/OptionGroup'
import { PageHeader } from '@/components/shared/PageHeader'
import { DURATION_OPTIONS, MODES } from '@/lib/modes'
import type { Duration, Mode } from '@/types/quiz'

export function LeaderboardRoute() {
  const [mode, setMode] = useState<Mode>('multiply')
  const [duration, setDuration] = useState<Duration>(60)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Leaderboard" />
      <OptionGroup label="Quiz" options={MODES} value={mode} onChange={setMode} />
      <OptionGroup
        label="Time"
        options={DURATION_OPTIONS}
        value={duration}
        onChange={setDuration}
      />
      <LeaderboardList mode={mode} duration={duration} />
    </div>
  )
}
