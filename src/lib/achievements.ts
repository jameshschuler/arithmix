import { consecutiveDaysEndingOn } from '@/lib/dates'
import { MODES } from '@/lib/modes'
import { PROBLEMS_PER_QUIZ } from '@/lib/problems'
import type { Run } from '@/types/quiz'

export type Progress = {
  run: Run
  history: Run[]
  correctFacts: Set<string>
}

export type Achievement = {
  id: string
  name: string
  description: string
  earned: (progress: Progress) => boolean
}

const TABLES = Array.from({ length: 13 }, (_, table) => table)

export function longestCorrectStreak(run: Pick<Run, 'events'>): number {
  let current = 0
  let longest = 0

  for (const event of run.events) {
    if (event.kind === 'correct') {
      current++
      longest = Math.max(longest, current)
    } else if (event.kind === 'miss') {
      current = 0
    }
  }

  return longest
}

function factKey(left: number, right: number): string {
  return left <= right ? `${left}x${right}` : `${right}x${left}`
}

export function correctMultiplicationFacts(history: Run[]): Set<string> {
  const facts = new Set<string>()

  for (const run of history) {
    const problemsById = new Map(run.problems.map((problem) => [problem.id, problem]))

    for (const event of run.events) {
      const problem = problemsById.get(event.problemId)

      if (event.kind === 'correct' && problem?.operation === 'multiply') {
        facts.add(factKey(problem.left, problem.right))
      }
    }
  }

  return facts
}

function tableMastered(table: number, correctFacts: Set<string>): boolean {
  return TABLES.every((factor) => correctFacts.has(factKey(table, factor)))
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Finish a quiz',
    earned: () => true,
  },
  {
    id: 'perfect',
    name: 'Perfect',
    description: 'Get 20 or more right with no misses',
    earned: ({ run }) => run.misses === 0 && run.correct >= 20,
  },
  {
    id: 'clean-sweep',
    name: 'Clean Sweep',
    description: `Answer all ${PROBLEMS_PER_QUIZ} before time runs out`,
    earned: ({ run }) => run.finishedEarly,
  },
  {
    id: 'gold-rush',
    name: 'Gold Rush',
    description: 'Earn any gold rank',
    earned: ({ run }) => run.rank?.tier === 'gold',
  },
  {
    id: 'triple-crown',
    name: 'Triple Crown',
    description: 'Earn 3 gold stars in Multiply, Divide and Mixed',
    earned: ({ history }) => {
      const perfectModes = new Set(
        history
          .filter((run) => run.rank?.tier === 'gold' && run.rank.stars === 3)
          .map((run) => run.mode),
      )

      return MODES.every((mode) => perfectModes.has(mode.id))
    },
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Get 25 right in a row',
    earned: ({ run }) => longestCorrectStreak(run) >= 25,
  },
  {
    id: 'steady-hand',
    name: 'Steady Hand',
    description: 'Get 30 or more right in a 90s quiz without skipping',
    earned: ({ run }) => run.duration === 90 && run.skips === 0 && run.correct >= 30,
  },
  {
    id: 'daily-habit',
    name: 'Daily Habit',
    description: 'Play 7 days in a row',
    earned: ({ run, history }) =>
      consecutiveDaysEndingOn(
        history.map((other) => other.playedAt),
        run.playedAt,
      ) >= 7,
  },
  ...TABLES.map((table) => ({
    id: `table-${table}`,
    name: `×${table} Master`,
    description: `Answer every ×${table} fact correctly`,
    earned: ({ correctFacts }: Progress) => tableMastered(table, correctFacts),
  })),
]

export const ACHIEVEMENTS_BY_ID = new Map(
  ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]),
)

export function newlyEarnedAchievements(
  run: Run,
  history: Run[],
  unlockedIds: Set<string>,
): Achievement[] {
  const progress = { run, history, correctFacts: correctMultiplicationFacts(history) }

  return ACHIEVEMENTS.filter(
    (achievement) => !unlockedIds.has(achievement.id) && achievement.earned(progress),
  )
}
