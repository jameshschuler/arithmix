import { useLiveQuery } from 'dexie-react-hooks'

import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow'
import { Skeleton } from '@/components/ui/skeleton'
import { getTopRuns } from '@/lib/storage'
import type { Duration, Mode } from '@/types/quiz'

const SKELETON_ROWS = [1, 2, 3]

type LeaderboardListProps = { mode: Mode; duration: Duration }

export function LeaderboardList({ mode, duration }: LeaderboardListProps) {
  const runs = useLiveQuery(() => getTopRuns(mode, duration), [mode, duration])

  if (runs === undefined) {
    return (
      <div className="flex flex-col gap-2">
        {SKELETON_ROWS.map((row) => (
          <Skeleton key={row} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (runs.length === 0) {
    return (
      <p className="rounded-lg bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        No scores yet for this quiz. Play one to get on the board.
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-2">
      {runs.map((run, index) => (
        <LeaderboardRow key={run.id} run={run} place={index + 1} />
      ))}
    </ol>
  )
}
