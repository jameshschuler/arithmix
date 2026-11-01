import { useEffect } from 'react'

import type { QuizActions } from '@/contexts/quiz-context'

const SKIP_KEYS = new Set([' ', 'Tab'])

export function useKeyboardInput(active: boolean, actions: QuizActions) {
  useEffect(() => {
    if (!active) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (/^[0-9]$/.test(event.key)) {
        actions.enterDigit(Number(event.key), event.timeStamp)
      } else if (event.key === 'Backspace') {
        actions.backspace(event.timeStamp)
      } else if (SKIP_KEYS.has(event.key)) {
        actions.skip(event.timeStamp)
      } else {
        return
      }

      event.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, actions])
}
