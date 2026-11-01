import type { PointerEvent, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type KeypadKeyProps = {
  label: string
  onPress: (time: number) => void
  className?: string
  children: ReactNode
}

export function KeypadKey({ label, onPress, className, children }: KeypadKeyProps) {
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onPress(event.timeStamp)
  }

  return (
    <Button
      variant="outline"
      aria-label={label}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      className={cn('h-16 text-3xl font-medium active:bg-muted', className)}
    >
      {children}
    </Button>
  )
}
