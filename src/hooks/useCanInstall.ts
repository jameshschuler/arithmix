import { useSyncExternalStore } from 'react'

import { canInstall, subscribeToInstallPrompt } from '@/lib/install-prompt'

export function useCanInstall(): boolean {
  return useSyncExternalStore(subscribeToInstallPrompt, canInstall)
}
