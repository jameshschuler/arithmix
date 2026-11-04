import { getPreferences } from '@/lib/preferences'
import { HURRY_TEMPO, midiToFrequency, NORMAL_TEMPO, notesForStep, stepSeconds } from '@/lib/music'

const EFFECTS_VOLUME = 0.18
const MUSIC_VOLUME = 0.06
const SCHEDULE_AHEAD_SECONDS = 0.12
const SCHEDULER_INTERVAL_MS = 25

type ToneOptions = {
  frequency: number
  endFrequency?: number
  start?: number
  duration: number
  type?: OscillatorType
  volume?: number
  destination?: AudioNode
}

let context: AudioContext | null = null
let effectsGain: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null

function getContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') {
    return null
  }

  if (!context) {
    context = new AudioContext()
    effectsGain = context.createGain()
    effectsGain.gain.value = EFFECTS_VOLUME
    effectsGain.connect(context.destination)
  }

  if (context.state !== 'running') {
    void context.resume()
  }

  return context
}

export function unlockAudioOnFirstGesture() {
  const unlock = () => {
    void getContext()?.resume()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }

  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}

function playTone(audio: AudioContext, at: number, options: ToneOptions) {
  const start = at + (options.start ?? 0)
  const end = start + options.duration
  const oscillator = audio.createOscillator()
  const envelope = audio.createGain()

  oscillator.type = options.type ?? 'triangle'
  oscillator.frequency.setValueAtTime(options.frequency, start)

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, end)
  }

  envelope.gain.setValueAtTime(0, start)
  envelope.gain.linearRampToValueAtTime(options.volume ?? 1, start + 0.005)
  envelope.gain.exponentialRampToValueAtTime(0.001, end)

  oscillator.connect(envelope).connect(options.destination ?? effectsGain ?? audio.destination)
  oscillator.start(start)
  oscillator.stop(end + 0.02)
}

function playEffect(tones: ToneOptions[]) {
  const audio = getPreferences().soundEffects ? getContext() : null

  if (!audio) {
    return
  }

  const now = audio.currentTime
  tones.forEach((tone) => playTone(audio, now, tone))
}

const C5 = 523.25
const E5 = 659.25
const G5 = 783.99
const C6 = 1046.5
const E6 = 1318.51
const G6 = 1567.98
const C7 = 2093

export const sounds = {
  countdownTick: () => playEffect([{ frequency: 660, duration: 0.09, type: 'sine' }]),
  go: () => playEffect([{ frequency: 990, duration: 0.18, type: 'sine' }]),
  correct: () =>
    playEffect([
      { frequency: C6, duration: 0.06 },
      { frequency: E6, start: 0.05, duration: 0.08 },
    ]),
  miss: () =>
    playEffect([
      { frequency: 180, endFrequency: 110, duration: 0.18, type: 'square', volume: 0.35 },
    ]),
  skip: () => playEffect([{ frequency: 520, endFrequency: 390, duration: 0.08, volume: 0.6 }]),
  finish: () =>
    playEffect(
      [C5, E5, G5, C6].map((frequency, index) => ({
        frequency,
        start: index * 0.09,
        duration: 0.14,
      })),
    ),
  star: (index: number, delaySeconds: number) =>
    playEffect([{ frequency: [C6, E6, G6][index], start: delaySeconds, duration: 0.3 }]),
  achievement: (delaySeconds: number) =>
    playEffect([
      { frequency: G6, start: delaySeconds, duration: 0.12, type: 'sine' },
      { frequency: C7, start: delaySeconds + 0.08, duration: 0.25, type: 'sine' },
    ]),
}

export function vibrate(pattern: number | number[]) {
  if (getPreferences().vibration && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function getNoiseBuffer(audio: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = audio.createBuffer(1, audio.sampleRate * 0.05, audio.sampleRate)
    const samples = noiseBuffer.getChannelData(0)

    for (let index = 0; index < samples.length; index++) {
      samples[index] = Math.random() * 2 - 1
    }
  }

  return noiseBuffer
}

function playHat(audio: AudioContext, start: number, destination: AudioNode) {
  const source = audio.createBufferSource()
  const filter = audio.createBiquadFilter()
  const envelope = audio.createGain()

  source.buffer = getNoiseBuffer(audio)
  filter.type = 'highpass'
  filter.frequency.value = 7000
  envelope.gain.setValueAtTime(0.25, start)
  envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.04)
  source.connect(filter).connect(envelope).connect(destination)
  source.start(start)
}

export type MusicPlayer = { hurry: () => void; stop: () => void }

export function startMusic(): MusicPlayer | null {
  const audio = getPreferences().music ? getContext() : null

  if (!audio) {
    return null
  }

  const musicGain = audio.createGain()
  musicGain.gain.value = MUSIC_VOLUME
  musicGain.connect(audio.destination)

  let tempo = NORMAL_TEMPO
  let step = 0
  let nextStepTime = audio.currentTime + 0.05

  const scheduleStep = () => {
    const notes = notesForStep(step)
    const length = stepSeconds(tempo)

    if (notes.bass !== undefined) {
      playTone(audio, nextStepTime, {
        frequency: midiToFrequency(notes.bass),
        duration: length * 1.8,
        type: 'square',
        volume: 0.5,
        destination: musicGain,
      })
    }

    if (notes.lead !== undefined) {
      playTone(audio, nextStepTime, {
        frequency: midiToFrequency(notes.lead),
        duration: length * 1.5,
        type: 'triangle',
        destination: musicGain,
      })
    }

    if (notes.hat) {
      playHat(audio, nextStepTime, musicGain)
    }

    nextStepTime += length
    step++
  }

  const scheduler = window.setInterval(() => {
    nextStepTime = Math.max(nextStepTime, audio.currentTime)

    while (nextStepTime < audio.currentTime + SCHEDULE_AHEAD_SECONDS) {
      scheduleStep()
    }
  }, SCHEDULER_INTERVAL_MS)

  return {
    hurry: () => {
      tempo = HURRY_TEMPO
    },
    stop: () => {
      window.clearInterval(scheduler)
      musicGain.gain.setTargetAtTime(0, audio.currentTime, 0.05)
      window.setTimeout(() => musicGain.disconnect(), 500)
    },
  }
}
