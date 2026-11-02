import { Button } from '@/components/ui/button'

type UpdateBannerProps = { onUpdate: () => void }

export function UpdateBanner({ onUpdate }: UpdateBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 py-2 pr-2 pl-3">
      <span className="min-w-0 truncate text-sm">A new version is ready.</span>
      <Button size="sm" onClick={onUpdate}>
        Update
      </Button>
    </div>
  )
}
