import { Play } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { PersonalBest } from '@/components/home/PersonalBest'
import { OptionGroup } from '@/components/shared/OptionGroup'
import { Button } from '@/components/ui/button'
import { DURATION_OPTIONS, MODES } from '@/lib/modes'
import { playPath } from '@/lib/routes'
import type { Duration, Mode } from '@/types/quiz'

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
      <PersonalBest mode={mode} duration={duration} />
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
