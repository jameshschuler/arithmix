import { X } from 'lucide-react'
import { Link } from 'react-router'

import { TimerBar } from '@/components/quiz/TimerBar'
import { Button } from '@/components/ui/button'
import { useQuizContext } from '@/contexts/quiz-context'

export function QuizStatusBar() {
  const { state } = useQuizContext()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Quit quiz"
          nativeButton={false}
          render={<Link to="/" />}
        >
          <X className="size-5" />
        </Button>
        <p aria-label="Correct answers" className="text-lg font-medium tabular-nums">
          {state.correct}
          <span className="text-muted-foreground">/{state.problems.length}</span>
        </p>
      </div>
      <TimerBar />
    </div>
  )
}
