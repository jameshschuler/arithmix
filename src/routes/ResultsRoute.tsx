import { useLiveQuery } from 'dexie-react-hooks'
import { Navigate, useParams } from 'react-router'

import { MissedProblems } from '@/components/results/MissedProblems'
import { NewAchievements } from '@/components/results/NewAchievements'
import { ResultsActions } from '@/components/results/ResultsActions'
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton'
import { ResultsSummary } from '@/components/results/ResultsSummary'
import { getRunDetails } from '@/lib/storage'

export function ResultsRoute() {
  const runId = Number(useParams().runId)
  const details = useLiveQuery(
    () => (Number.isInteger(runId) ? getRunDetails(runId) : null),
    [runId],
  )

  if (details === undefined) {
    return <ResultsSkeleton />
  }

  if (details === null) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <ResultsSummary run={details.run} newPersonalBest={details.newPersonalBest} />
      <NewAchievements unlocked={details.unlocked} />
      <MissedProblems result={details.run} />
      <ResultsActions result={details.run} />
    </div>
  )
}
