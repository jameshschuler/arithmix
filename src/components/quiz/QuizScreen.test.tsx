import { act, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { QuizScreen } from '@/components/quiz/QuizScreen'
import { QuizProvider } from '@/contexts/quiz-context'
import { db } from '@/lib/db'
import { formatProblem } from '@/lib/format'
import { generateProblems } from '@/lib/problems'
import { getRunDetails } from '@/lib/storage'

const SEED = 1234
const PROBLEMS = generateProblems('multiply', SEED)

function renderQuiz() {
  const router = createMemoryRouter(
    [
      {
        path: '/play',
        element: (
          <QuizProvider mode="multiply" duration={30} seed={SEED}>
            <QuizScreen />
          </QuizProvider>
        ),
      },
      { path: '/results/:runId', element: <p>results</p> },
    ],
    { initialEntries: ['/play'] },
  )

  render(<RouterProvider router={router} />)

  return router
}

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds)
  })
}

function finishCountdown() {
  advance(1000)
  advance(1000)
  advance(1000)
}

function press(label: string) {
  fireEvent.pointerDown(screen.getByRole('button', { name: label }))
}

function typeAnswer(answer: number) {
  for (const digit of String(answer)) {
    press(digit)
  }
}

beforeEach(async () => {
  await db.delete()
  await db.open()
  vi.useFakeTimers({
    toFake: [
      'setTimeout',
      'clearTimeout',
      'Date',
      'performance',
      'requestAnimationFrame',
      'cancelAnimationFrame',
    ],
  })
  vi.setSystemTime(0)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('QuizScreen', () => {
  it('counts down before showing the first problem', () => {
    renderQuiz()

    expect(screen.getByText('3')).toBeInTheDocument()

    finishCountdown()

    expect(screen.getByLabelText('Problem')).toHaveTextContent(formatProblem(PROBLEMS[0]))
  })

  it('advances to the next problem when the keypad answer is correct', () => {
    renderQuiz()
    finishCountdown()

    typeAnswer(PROBLEMS[0].answer)

    expect(screen.getByLabelText('Problem')).toHaveTextContent(formatProblem(PROBLEMS[1]))
    expect(screen.getByLabelText('Correct answers')).toHaveTextContent('1/50')
  })

  it('accepts answers from the physical keyboard', () => {
    renderQuiz()
    finishCountdown()

    for (const digit of String(PROBLEMS[0].answer)) {
      fireEvent.keyDown(window, { key: digit })
    }

    expect(screen.getByLabelText('Problem')).toHaveTextContent(formatProblem(PROBLEMS[1]))
  })

  it('skips with the skip key', () => {
    renderQuiz()
    finishCountdown()

    press('Skip')

    expect(screen.getByLabelText('Problem')).toHaveTextContent(formatProblem(PROBLEMS[1]))
  })

  it('saves the run and shows its results when time runs out', async () => {
    const router = renderQuiz()
    finishCountdown()
    typeAnswer(PROBLEMS[0].answer)

    advance(30_000)

    await vi.waitFor(() => expect(router.state.location.pathname).toMatch(/^\/results\/\d+$/))
    const runId = Number(router.state.location.pathname.split('/').at(-1))
    const details = await getRunDetails(runId)
    expect(details?.run).toMatchObject({ correct: 1, elapsedMs: 30_000, finishedEarly: false })
  })

  it('voids the run when the page is hidden', () => {
    renderQuiz()
    finishCountdown()

    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(screen.getByText('Quiz stopped')).toBeInTheDocument()
  })

  it('shows the score with a warning when the run cannot be saved', async () => {
    vi.spyOn(db.runs, 'add').mockRejectedValue(new Error('QuotaExceededError'))
    renderQuiz()
    finishCountdown()
    typeAnswer(PROBLEMS[0].answer)

    advance(30_000)

    await vi.waitFor(() => expect(screen.getByText('1 correct')).toBeInTheDocument())
    expect(screen.getByText(/couldn.t be saved/)).toBeInTheDocument()
  })
})
