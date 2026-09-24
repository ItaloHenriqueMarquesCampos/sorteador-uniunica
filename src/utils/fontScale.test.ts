import { describe, expect, it } from 'vitest'
import { getResultFontSize } from './fontScale'

function maxRem(clamp: string): number {
  const match = clamp.match(/,\s*([\d.]+)rem\)$/)
  if (!match) throw new Error(`Could not parse clamp value: ${clamp}`)
  return Number(match[1])
}

describe('getResultFontSize', () => {
  it('returns a valid clamp() expression', () => {
    expect(getResultFontSize('João Silva')).toMatch(/^clamp\(.+\)$/)
  })

  it('shrinks the max font size as the name gets longer', () => {
    const names = [
      'João Silva',
      'Maria Eduarda Oliveira',
      'João Victor dos Santos Fernandes',
      'Maria Eduarda Fernandes de Oliveira Santos',
      'João Victor dos Santos Fernandes de Oliveira Pereira',
    ]

    const sizes = names.map((name) => maxRem(getResultFontSize(name)))

    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeLessThanOrEqual(sizes[i - 1])
    }
    // and the shortest/longest names are meaningfully different
    expect(sizes[0]).toBeGreaterThan(sizes[sizes.length - 1])
  })

  it('handles a single-character name without throwing', () => {
    expect(() => getResultFontSize('A')).not.toThrow()
  })
})
