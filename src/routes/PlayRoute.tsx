import { Navigate, useLocation, useSearchParams } from 'react-router'

import { QuizSession } from '@/components/quiz/QuizSession'
import { isDuration, isMode } from '@/lib/modes'

export function PlayRoute() {
  const [params] = useSearchParams()
  const location = useLocation()
  const mode = params.get('mode')
  const duration = Number(params.get('duration'))

  if (!isMode(mode) || !isDuration(duration)) {
    return <Navigate to="/" replace />
  }

  return <QuizSession key={location.key} mode={mode} duration={duration} />
}
