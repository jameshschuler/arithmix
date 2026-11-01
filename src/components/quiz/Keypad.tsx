import { Delete } from 'lucide-react'

import { KeypadKey } from '@/components/quiz/KeypadKey'
import { useQuizContext } from '@/contexts/quiz-context'

const DIGIT_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function Keypad() {
  const { actions } = useQuizContext()

  return (
    <div className="grid grid-cols-3 gap-2 pb-[env(safe-area-inset-bottom)]">
      {DIGIT_ROWS.map((digit) => (
        <KeypadKey
          key={digit}
          label={String(digit)}
          onPress={(time) => actions.enterDigit(digit, time)}
        >
          {digit}
        </KeypadKey>
      ))}
      <KeypadKey label="Delete" onPress={actions.backspace}>
        <Delete className="size-7" />
      </KeypadKey>
      <KeypadKey label="0" onPress={(time) => actions.enterDigit(0, time)}>
        0
      </KeypadKey>
      <KeypadKey label="Skip" onPress={actions.skip} className="text-xl text-muted-foreground">
        Skip
      </KeypadKey>
    </div>
  )
}
