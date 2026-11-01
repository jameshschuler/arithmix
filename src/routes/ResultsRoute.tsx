import { Navigate, useLocation } from 'react-router'

import { MissedProblems } from '@/components/results/MissedProblems'
import { ResultsActions } from '@/components/results/ResultsActions'
import { ResultsSummary } from '@/components/results/ResultsSummary'
import type { QuizResult } from '@/types/quiz'

export function ResultsRoute() {
  const result = useLocation().state as QuizResult | null

  if (!result) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <ResultsSummary result={result} />
      <MissedProblems result={result} />
      <ResultsActions result={result} />
    </div>
  )
}
