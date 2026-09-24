/**
 * Returns a cryptographically random integer in [0, max), free of modulo bias
 * via rejection sampling.
 */
export function secureRandomIndex(max: number): number {
  if (max <= 0) throw new Error('max must be greater than 0')

  const range = 4294967296 // 2^32
  const limit = range - (range % max)

  const buffer = new Uint32Array(1)
  let value: number
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= limit)

  return value % max
}

/**
 * Draws one random participant from the list.
 * `excluded` allows future support for "don't repeat winners" without changing the call sites.
 */
export function drawRandomParticipant<T>(participants: T[], excluded: ReadonlySet<T> = new Set()): T {
  const pool = excluded.size > 0 ? participants.filter((p) => !excluded.has(p)) : participants

  if (pool.length === 0) {
    throw new Error('Não há participantes disponíveis para o sorteio.')
  }

  const index = secureRandomIndex(pool.length)
  return pool[index]
}
