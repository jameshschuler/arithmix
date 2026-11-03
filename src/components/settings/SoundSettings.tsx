import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/hooks/usePreferences'
import { setPreference, type Preferences } from '@/lib/preferences'

const SETTINGS: { key: keyof Preferences; label: string; description: string }[] = [
  { key: 'soundEffects', label: 'Sound effects', description: 'Beeps for right and wrong answers' },
  { key: 'music', label: 'Music', description: 'Plays during a quiz and speeds up near the end' },
  { key: 'vibration', label: 'Vibration', description: 'Buzz on a wrong answer, where supported' },
]

export function SoundSettings() {
  const preferences = usePreferences()

  return (
    <section className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">Sound</span>
      <div className="flex flex-col rounded-lg bg-muted/30">
        {SETTINGS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-3 px-3 py-3">
            <div className="flex min-w-0 flex-col">
              <Label htmlFor={key} className="font-medium">
                {label}
              </Label>
              <span className="truncate text-xs text-muted-foreground">{description}</span>
            </div>
            <Switch
              id={key}
              checked={preferences[key]}
              onCheckedChange={(checked) => setPreference(key, checked)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
