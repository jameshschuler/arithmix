import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'

import { MissedProblems } from '@/components/results/MissedProblems'
import { NewAchievements } from '@/components/results/NewAchievements'
import { ResultsActions } from '@/components/results/ResultsActions'
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton'
import { ResultsSummary } from '@/components/results/ResultsSummary'
import { useCelebrationSounds } from '@/hooks/useCelebrationSounds'
import { achievementRevealDelay } from '@/lib/celebration'
import { getRunDetails } from '@/lib/storage'

type ResultsLocationState = { celebrate?: boolean } | null

export function ResultsRoute() {
  const runId = Number(useParams().runId)
  const location = useLocation()
  const navigate = useNavigate()
  const [celebrate] = useState((location.state as ResultsLocationState)?.celebrate === true)
  const details = useLiveQuery(
    () => (Number.isInteger(runId) ? getRunDetails(runId) : null),
    [runId],
  )
  const stars = details?.run.rank?.stars ?? 0

  useEffect(() => {
    if (location.state !== null) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.state, location.pathname, navigate])

  useCelebrationSounds(celebrate && Boolean(details), stars, details?.unlocked.length ?? 0)

  if (details === undefined) {
    return <ResultsSkeleton />
  }

  if (details === null) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <ResultsSummary
        run={details.run}
        newPersonalBest={details.newPersonalBest}
        celebrate={celebrate}
      />
      <NewAchievements
        unlocked={details.unlocked}
        revealDelay={celebrate ? achievementRevealDelay(stars) : 0}
      />
      <MissedProblems result={details.run} />
      <ResultsActions result={details.run} />
    </div>
  )
}
