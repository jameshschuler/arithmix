import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'

import { useKeyboardInput } from '@/hooks/useKeyboardInput'
import { useQuizClock } from '@/hooks/useQuizClock'
import { useVoidWhenHidden } from '@/hooks/useVoidWhenHidden'
import { generateProblems } from '@/lib/problems'
import { createQuiz, quizReducer, type QuizState } from '@/lib/quiz'
import type { Duration, Mode } from '@/types/quiz'

export type QuizActions = {
  start: (time: number) => void
  enterDigit: (digit: number, time: number) => void
  backspace: (time: number) => void
  skip: (time: number) => void
}

type QuizContextValue = { state: QuizState; actions: QuizActions }

const QuizContext = createContext<QuizContextValue | null>(null)

type QuizProviderProps = {
  mode: Mode
  duration: Duration
  seed: number
  children: ReactNode
}

export function QuizProvider({ mode, duration, seed, children }: QuizProviderProps) {
  const [state, dispatch] = useReducer(quizReducer, null, () =>
    createQuiz(mode, duration, seed, generateProblems(mode, seed)),
  )

  const actions = useMemo<QuizActions>(
    () => ({
      start: (time) => dispatch({ type: 'start', time }),
      enterDigit: (digit, time) => dispatch({ type: 'digit', digit, time }),
      backspace: (time) => dispatch({ type: 'backspace', time }),
      skip: (time) => dispatch({ type: 'skip', time }),
    }),
    [],
  )

  const playing = state.status === 'playing'

  useQuizClock(playing ? state.endsAt : null, () => dispatch({ type: 'expire' }))
  useVoidWhenHidden(playing, () => dispatch({ type: 'void' }))
  useKeyboardInput(playing, actions)

  return <QuizContext.Provider value={{ state, actions }}>{children}</QuizContext.Provider>
}

export function useQuizContext(): QuizContextValue {
  const context = useContext(QuizContext)

  if (!context) {
    throw new Error('useQuizContext must be used inside QuizProvider')
  }

  return context
}
