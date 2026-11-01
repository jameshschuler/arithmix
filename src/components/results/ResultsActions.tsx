import { RotateCcw } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { playPath } from '@/lib/routes'
import type { QuizResult } from '@/types/quiz'

type ResultsActionsProps = { result: QuizResult }

export function ResultsActions({ result }: ResultsActionsProps) {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2 pb-[env(safe-area-inset-bottom)]">
      <Button
        variant="outline"
        size="lg"
        className="h-12 text-base"
        nativeButton={false}
        render={<Link to="/" />}
      >
        Change quiz
      </Button>
      <Button
        size="lg"
        className="h-12 text-base"
        nativeButton={false}
        render={<Link to={playPath(result.mode, result.duration)} />}
      >
        <RotateCcw data-icon="inline-start" />
        Play again
      </Button>
    </div>
  )
}
