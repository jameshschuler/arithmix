import { useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router'

import { Countdown } from '@/components/quiz/Countdown'
import { Keypad } from '@/components/quiz/Keypad'
import { ProblemDisplay } from '@/components/quiz/ProblemDisplay'
import { QuizStatusBar } from '@/components/quiz/QuizStatusBar'
import { SaveFailedNotice } from '@/components/quiz/SaveFailedNotice'
import { VoidedNotice } from '@/components/quiz/VoidedNotice'
import { useQuizContext } from '@/contexts/quiz-context'
import { toResult } from '@/lib/quiz'
import { saveRun } from '@/lib/storage'

export function QuizScreen() {
  const { state } = useQuizContext()
  const navigate = useNavigate()

  const [saveFailed, setSaveFailed] = useState(false)
  const saveResult = useEffectEvent(() => saveRun(toResult(state)))

  useEffect(() => {
    if (state.status !== 'finished') {
      return
    }

    let mounted = true

    saveResult().then(
      (runId) =>
        mounted && navigate(`/results/${runId}`, { replace: true, state: { celebrate: true } }),
      () => mounted && setSaveFailed(true),
    )

    return () => {
      mounted = false
    }
  }, [state.status, navigate])

  if (state.status === 'ready') {
    return <Countdown />
  }

  if (saveFailed) {
    return <SaveFailedNotice correct={state.correct} />
  }

  if (state.status === 'voided') {
    return <VoidedNotice />
  }

  return (
    <div className="flex flex-1 touch-manipulation flex-col gap-4 select-none">
      <QuizStatusBar />
      <ProblemDisplay />
      <Keypad />
    </div>
  )
}
