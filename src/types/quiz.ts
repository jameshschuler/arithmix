export type Operation = 'multiply' | 'divide'

export type Mode = 'multiply' | 'divide' | 'mixed'

export type Duration = 30 | 60 | 90

export type Problem = {
  id: number
  left: number
  right: number
  operation: Operation
  answer: number
}

export type QuizEventKind = 'digit' | 'backspace' | 'skip' | 'correct' | 'miss'

export type QuizEvent = {
  time: number
  kind: QuizEventKind
  problemId: number
  digit?: number
}

export type Tier = 'bronze' | 'silver' | 'gold'

export type Stars = 1 | 2 | 3

export type Rank = { tier: Tier; stars: Stars }

export type QuizResult = {
  mode: Mode
  duration: Duration
  seed: number
  problems: Problem[]
  events: QuizEvent[]
  correct: number
  misses: number
  skips: number
  elapsedMs: number
  finishedEarly: boolean
}
