import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Countdown } from '@/components/quiz/Countdown'
import { Keypad } from '@/components/quiz/Keypad'
import { ProblemDisplay } from '@/components/quiz/ProblemDisplay'
import { QuizStatusBar } from '@/components/quiz/QuizStatusBar'
import { VoidedNotice } from '@/components/quiz/VoidedNotice'
import { useQuizContext } from '@/contexts/quiz-context'
import { toResult } from '@/lib/quiz'

export function QuizScreen() {
  const { state } = useQuizContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.status === 'finished') {
      navigate('/results', { replace: true, state: toResult(state) })
    }
  }, [state, navigate])

  if (state.status === 'ready') {
    return <Countdown />
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
