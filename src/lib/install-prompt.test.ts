import { beforeEach, describe, expect, it, vi } from 'vitest'

type InstallPromptModule = typeof import('@/lib/install-prompt')

let installPrompt: InstallPromptModule

function installPromptEvent() {
  return Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
    prompt: vi.fn().mockResolvedValue(undefined),
  })
}

beforeEach(async () => {
  vi.resetModules()
  installPrompt = await import('@/lib/install-prompt')
  installPrompt.listenForInstallPrompt()
})

describe('install prompt', () => {
  it('cannot install before the browser offers it', () => {
    expect(installPrompt.canInstall()).toBe(false)
  })

  it('holds the browser prompt and notifies subscribers', () => {
    const listener = vi.fn()
    installPrompt.subscribeToInstallPrompt(listener)
    const event = installPromptEvent()

    window.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(installPrompt.canInstall()).toBe(true)
    expect(listener).toHaveBeenCalled()
  })

  it('shows the prompt once even when tapped twice', async () => {
    const event = installPromptEvent()
    window.dispatchEvent(event)

    await Promise.all([installPrompt.promptInstall(), installPrompt.promptInstall()])

    expect(event.prompt).toHaveBeenCalledOnce()
    expect(installPrompt.canInstall()).toBe(false)
  })

  it('clears the prompt after the app is installed', () => {
    window.dispatchEvent(installPromptEvent())
    window.dispatchEvent(new Event('appinstalled'))

    expect(installPrompt.canInstall()).toBe(false)
  })

  it('does nothing when there is no prompt', async () => {
    await expect(installPrompt.promptInstall()).resolves.toBeUndefined()
  })
})
