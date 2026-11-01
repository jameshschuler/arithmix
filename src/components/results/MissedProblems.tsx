import { formatProblem } from '@/lib/format'
import { missedProblems } from '@/lib/quiz'
import type { QuizResult } from '@/types/quiz'

type MissedProblemsProps = { result: QuizResult }

export function MissedProblems({ result }: MissedProblemsProps) {
  const missed = missedProblems(result)

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">Review</h2>
      {missed.length === 0 ? (
        <p className="rounded-lg bg-muted/30 px-3 py-2 text-sm">No misses. Nice work!</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {missed.map((problem) => (
            <li
              key={problem.id}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 tabular-nums"
            >
              <span className="truncate">{formatProblem(problem)}</span>
              <span className="font-medium">{problem.answer}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
