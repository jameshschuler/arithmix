import { Play } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { OptionGroup } from '@/components/home/OptionGroup'
import { Button } from '@/components/ui/button'
import { DURATIONS, MODES } from '@/lib/modes'
import { playPath } from '@/lib/routes'
import type { Duration, Mode } from '@/types/quiz'

const DURATION_OPTIONS = DURATIONS.map((duration) => ({ id: duration, label: `${duration}s` }))

export function QuizSetup() {
  const [mode, setMode] = useState<Mode>('multiply')
  const [duration, setDuration] = useState<Duration>(60)

  return (
    <div className="flex flex-1 flex-col gap-6">
      <OptionGroup label="Quiz" options={MODES} value={mode} onChange={setMode} />
      <OptionGroup
        label="Time"
        options={DURATION_OPTIONS}
        value={duration}
        onChange={setDuration}
      />
      <Button
        size="lg"
        className="mt-auto h-14 text-lg"
        nativeButton={false}
        render={<Link to={playPath(mode, duration)} />}
      >
        <Play data-icon="inline-start" className="size-5" />
        Start
      </Button>
    </div>
  )
}
