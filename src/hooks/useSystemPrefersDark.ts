import { useSyncExternalStore } from 'react'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)

  return () => query.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(DARK_QUERY).matches
}

export function useSystemPrefersDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
