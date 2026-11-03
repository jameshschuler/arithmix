import type { Duration, Mode, Problem, QuizEvent, QuizResult } from '@/types/quiz'

export type QuizStatus = 'ready' | 'playing' | 'finished' | 'voided'

export type QuizState = {
  status: QuizStatus
  mode: Mode
  duration: Duration
  seed: number
  problems: Problem[]
  queue: Problem[]
  input: string
  correct: number
  misses: number
  skips: number
  events: QuizEvent[]
  startedAt: number
  endsAt: number
  finishedAt: number
}

export type QuizAction =
  | { type: 'start'; time: number }
  | { type: 'digit'; digit: number; time: number }
  | { type: 'backspace'; time: number }
  | { type: 'skip'; time: number }
  | { type: 'expire' }
  | { type: 'void' }

export function createQuiz(
  mode: Mode,
  duration: Duration,
  seed: number,
  problems: Problem[],
): QuizState {
  return {
    status: 'ready',
    mode,
    duration,
    seed,
    problems,
    queue: problems,
    input: '',
    correct: 0,
    misses: 0,
    skips: 0,
    events: [],
    startedAt: 0,
    endsAt: 0,
    finishedAt: 0,
  }
}

function logEvent(state: QuizState, event: Omit<QuizEvent, 'problemId'>): QuizEvent[] {
  return [...state.events, { ...event, problemId: state.queue[0].id }]
}

function enterDigit(state: QuizState, digit: number, time: number): QuizState {
  const problem = state.queue[0]
  const input = state.input + digit
  const events = logEvent(state, { time, kind: 'digit', digit })
  const answer = String(problem.answer)

  if (input === answer) {
    const queue = state.queue.slice(1)

    return {
      ...state,
      queue,
      input: '',
      correct: state.correct + 1,
      events: [...events, { time, kind: 'correct', problemId: problem.id }],
      ...(queue.length === 0 && { status: 'finished', finishedAt: time }),
    }
  }

  if (input.length >= answer.length) {
    return {
      ...state,
      input: '',
      misses: state.misses + 1,
      events: [...events, { time, kind: 'miss', problemId: problem.id }],
    }
  }

  return { ...state, input, events }
}

function skipProblem(state: QuizState, time: number): QuizState {
  if (state.queue.length < 2) {
    return state
  }

  const [current, ...rest] = state.queue

  return {
    ...state,
    queue: [...rest, current],
    input: '',
    skips: state.skips + 1,
    events: logEvent(state, { time, kind: 'skip' }),
  }
}

function inputAccepted(state: QuizState, time: number): boolean {
  return state.status === 'playing' && time < state.endsAt
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start': {
      if (state.status !== 'ready') {
        return state
      }

      return {
        ...state,
        status: 'playing',
        startedAt: action.time,
        endsAt: action.time + state.duration * 1000,
      }
    }

    case 'digit': {
      return inputAccepted(state, action.time)
        ? enterDigit(state, action.digit, action.time)
        : state
    }

    case 'backspace': {
      if (!inputAccepted(state, action.time) || state.input === '') {
        return state
      }

      return {
        ...state,
        input: state.input.slice(0, -1),
        events: logEvent(state, { time: action.time, kind: 'backspace' }),
      }
    }

    case 'skip': {
      return inputAccepted(state, action.time) ? skipProblem(state, action.time) : state
    }

    case 'expire': {
      return state.status === 'playing'
        ? { ...state, status: 'finished', finishedAt: state.endsAt }
        : state
    }

    case 'void': {
      return state.status === 'playing' ? { ...state, status: 'voided' } : state
    }
  }
}

export function toResult(state: QuizState): QuizResult {
  return {
    mode: state.mode,
    duration: state.duration,
    seed: state.seed,
    problems: state.problems,
    events: state.events,
    correct: state.correct,
    misses: state.misses,
    skips: state.skips,
    elapsedMs: state.finishedAt - state.startedAt,
    finishedEarly: state.finishedAt < state.endsAt,
  }
}

export function missedProblems(result: Pick<QuizResult, 'problems' | 'events'>): Problem[] {
  const missedIds = new Set(
    result.events.filter((event) => event.kind === 'miss').map((event) => event.problemId),
  )

  return result.problems.filter((problem) => missedIds.has(problem.id))
}

export type Outcome = 'correct' | 'miss'

export function lastOutcome(events: QuizEvent[]): Outcome | null {
  const event = events.findLast(
    (candidate) => candidate.kind === 'correct' || candidate.kind === 'miss',
  )

  return event ? (event.kind as Outcome) : null
}
