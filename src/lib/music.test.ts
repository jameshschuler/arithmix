import { describe, expect, it } from 'vitest'

import { LOOP_STEPS, midiToFrequency, notesForStep, stepSeconds } from '@/lib/music'

describe('midiToFrequency', () => {
  it.each([
    { midi: 69, expected: 440 },
    { midi: 81, expected: 880 },
    { midi: 57, expected: 220 },
  ])('maps $midi to $expected Hz', ({ midi, expected }) => {
    expect(midiToFrequency(midi)).toBeCloseTo(expected)
  })
})

describe('notesForStep', () => {
  it('starts on the root of the first chord', () => {
    expect(notesForStep(0)).toEqual({ bass: 36, lead: 72, hat: false })
  })

  it('plays a hi-hat on off-beats without a lead note', () => {
    expect(notesForStep(1)).toEqual({ bass: undefined, lead: undefined, hat: true })
  })

  it('jumps the bass up an octave on step 6', () => {
    expect(notesForStep(6).bass).toBe(48)
  })

  it('moves to the next chord each bar', () => {
    expect(notesForStep(16).bass).toBe(43)
  })

  it('loops', () => {
    expect(notesForStep(LOOP_STEPS + 5)).toEqual(notesForStep(5))
  })
})

describe('stepSeconds', () => {
  it('is a sixteenth note at the tempo', () => {
    expect(stepSeconds(120)).toBe(0.125)
  })
})
