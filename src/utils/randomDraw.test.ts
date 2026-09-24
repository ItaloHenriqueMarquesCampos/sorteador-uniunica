import { describe, expect, it } from 'vitest'
import { drawRandomParticipant, secureRandomIndex } from './randomDraw'

describe('secureRandomIndex', () => {
  it('returns a value within [0, max)', () => {
    for (let i = 0; i < 200; i++) {
      const value = secureRandomIndex(7)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(7)
    }
  })

  it('always returns 0 when max is 1', () => {
    expect(secureRandomIndex(1)).toBe(0)
  })
})

describe('drawRandomParticipant', () => {
  it('returns the only participant when the list has one entry', () => {
    expect(drawRandomParticipant(['Único'])).toBe('Único')
  })

  it('returns a participant that exists in the list', () => {
    const participants = ['João', 'Maria', 'Carlos', 'Ana']
    for (let i = 0; i < 50; i++) {
      expect(participants).toContain(drawRandomParticipant(participants))
    }
  })

  it('produces a roughly uniform distribution over many draws', () => {
    const participants = ['A', 'B', 'C', 'D']
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
    const iterations = 4000

    for (let i = 0; i < iterations; i++) {
      counts[drawRandomParticipant(participants)]++
    }

    for (const name of participants) {
      const share = counts[name] / iterations
      expect(share).toBeGreaterThan(0.15)
      expect(share).toBeLessThan(0.35)
    }
  })

  it('throws when the participant list is empty', () => {
    expect(() => drawRandomParticipant([])).toThrow()
  })
})
