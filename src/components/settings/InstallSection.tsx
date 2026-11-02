import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCanInstall } from '@/hooks/useCanInstall'
import { promptInstall } from '@/lib/install-prompt'
import { canAddToHomeScreen, isStandalone } from '@/lib/platform'

export function InstallSection() {
  const installable = useCanInstall()
  const addToHomeScreen = canAddToHomeScreen(navigator.userAgent, navigator.maxTouchPoints)

  if (isStandalone() || (!installable && !addToHomeScreen)) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">App</span>
      {installable ? (
        <Button size="lg" variant="outline" className="h-12 text-base" onClick={promptInstall}>
          <Download data-icon="inline-start" />
          Install Arithmix
        </Button>
      ) : (
        <p className="rounded-lg bg-muted/30 px-3 py-2 text-sm">
          To install, tap <span className="font-medium">Share</span>, then{' '}
          <span className="font-medium">Add to Home Screen</span>.
        </p>
      )}
      <p className="text-xs text-muted-foreground">Opens full screen and works without internet.</p>
    </section>
  )
}
