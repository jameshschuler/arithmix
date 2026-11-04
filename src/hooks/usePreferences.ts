import { useSyncExternalStore } from 'react'

import { getPreferences, subscribeToPreferences, type Preferences } from '@/lib/preferences'

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribeToPreferences, getPreferences)
}
