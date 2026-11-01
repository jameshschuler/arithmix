import { useState } from 'react'

import { QuizScreen } from '@/components/quiz/QuizScreen'
import { QuizProvider } from '@/contexts/quiz-context'
import { createSeed } from '@/lib/random'
import type { Duration, Mode } from '@/types/quiz'

type QuizSessionProps = { mode: Mode; duration: Duration }

export function QuizSession({ mode, duration }: QuizSessionProps) {
  const [seed] = useState(createSeed)

  return (
    <QuizProvider mode={mode} duration={duration} seed={seed}>
      <QuizScreen />
    </QuizProvider>
  )
}
