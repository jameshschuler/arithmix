type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> }

let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

function setDeferredPrompt(event: BeforeInstallPromptEvent | null) {
  deferredPrompt = event
  listeners.forEach((listener) => listener())
}

export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    setDeferredPrompt(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => setDeferredPrompt(null))
}

export function subscribeToInstallPrompt(listener: () => void): () => void {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

export function canInstall(): boolean {
  return deferredPrompt !== null
}

export async function promptInstall(): Promise<void> {
  const event = deferredPrompt

  if (!event) {
    return
  }

  setDeferredPrompt(null)
  await event.prompt()
}
