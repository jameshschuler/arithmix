export const STEPS_PER_BAR = 16

const BARS = [
  { bass: 36, chord: [72, 76, 79, 84] },
  { bass: 43, chord: [71, 74, 79, 83] },
  { bass: 45, chord: [69, 72, 76, 81] },
  { bass: 41, chord: [69, 72, 77, 81] },
]

export const LOOP_STEPS = BARS.length * STEPS_PER_BAR

const ARPEGGIO = [0, 1, 2, 1, 0, 1, 2, 3]
const BASS_STEPS = new Set([0, 4, 6, 8, 12, 14])
const OCTAVE_BASS_STEPS = new Set([6, 14])

export const NORMAL_TEMPO = 132
export const HURRY_TEMPO = 160
export const HURRY_WHEN_MS_LEFT = 10_000

export type StepNotes = { bass?: number; lead?: number; hat: boolean }

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

export function notesForStep(step: number): StepNotes {
  const loopStep = step % LOOP_STEPS
  const bar = BARS[Math.floor(loopStep / STEPS_PER_BAR)]
  const beat = loopStep % STEPS_PER_BAR
  const bass = BASS_STEPS.has(beat) ? bar.bass + (OCTAVE_BASS_STEPS.has(beat) ? 12 : 0) : undefined
  const lead = beat % 2 === 0 ? bar.chord[ARPEGGIO[beat / 2]] : undefined

  return { bass, lead, hat: beat % 2 === 1 }
}

export function stepSeconds(tempo: number): number {
  return 60 / tempo / 4
}
