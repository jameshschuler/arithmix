import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getNickname, NICKNAME_MAX_LENGTH, saveNickname } from '@/lib/storage'

export function NicknameForm() {
  const saved = useLiveQuery(getNickname)
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? saved ?? ''
  const changed = draft !== null && draft.trim() !== saved

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await saveNickname(value)
    setDraft(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="nickname" className="text-sm font-medium text-muted-foreground">
        Nickname (optional)
      </Label>
      <div className="flex gap-2">
        <Input
          id="nickname"
          value={value}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder="Player"
          autoComplete="off"
          disabled={saved === undefined}
          onChange={(event) => setDraft(event.target.value)}
          className="h-12 text-base"
        />
        <Button type="submit" size="lg" className="h-12 px-4" disabled={!changed}>
          Save
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Shown next to your scores. Stays on this device.
      </p>
    </form>
  )
}
