import { describe, expect, it } from 'vitest'

import { consecutiveDaysEndingOn, localDayNumber } from '@/lib/dates'

const day = (dayOfMonth: number, hour = 12) => new Date(2026, 9, dayOfMonth, hour).getTime()

describe('localDayNumber', () => {
  it('is the same for morning and night of one local day', () => {
    expect(localDayNumber(day(10, 0))).toBe(localDayNumber(day(10, 23)))
  })

  it('increases by one each day, across month ends', () => {
    expect(localDayNumber(new Date(2026, 10, 1).getTime()) - localDayNumber(day(31))).toBe(1)
  })
})

describe('consecutiveDaysEndingOn', () => {
  it('counts back through unbroken days', () => {
    expect(consecutiveDaysEndingOn([day(8), day(9), day(9, 20), day(10)], day(10))).toBe(3)
  })

  it('stops at a gap', () => {
    expect(consecutiveDaysEndingOn([day(6), day(8), day(9), day(10)], day(10))).toBe(3)
  })

  it('is zero when the end day has no play', () => {
    expect(consecutiveDaysEndingOn([day(8)], day(10))).toBe(0)
  })

  it('is zero for no history', () => {
    expect(consecutiveDaysEndingOn([], day(10))).toBe(0)
  })
})
