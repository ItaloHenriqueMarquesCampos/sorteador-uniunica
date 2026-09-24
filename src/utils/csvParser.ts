import Papa from 'papaparse'

export class CsvParseError extends Error {}

const NAME_COLUMN_CANDIDATES = ['nome', 'name', 'participante', 'aluno', 'estudante']

function normalizeHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
}

function findNameColumnIndex(headerRow: string[]): number {
  const normalized = headerRow.map(normalizeHeader)
  for (const candidate of NAME_COLUMN_CANDIDATES) {
    const index = normalized.indexOf(candidate)
    if (index !== -1) return index
  }
  return -1
}

function cleanName(rawName: unknown): string | null {
  if (typeof rawName !== 'string') return null
  const trimmed = rawName.replace(/\s+/g, ' ').trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Parses CSV text and extracts participant names.
 * Only the name column is read — any other columns (email, CPF, etc.) are discarded.
 */
export function parseParticipants(csvText: string): string[] {
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: 'greedy',
  })

  const rows = result.data.filter((row) => row.some((cell) => cleanName(cell) !== null))

  if (rows.length === 0) {
    throw new CsvParseError('Não encontramos participantes no arquivo.')
  }

  const columnCount = rows[0].length
  let dataRows = rows
  let nameColumnIndex = 0

  if (columnCount > 1) {
    // Multi-column CSV: the first row must be a header identifying the name column.
    nameColumnIndex = findNameColumnIndex(rows[0])
    if (nameColumnIndex === -1) {
      throw new CsvParseError('Não foi possível identificar a coluna de nomes.')
    }
    dataRows = rows.slice(1)
  } else {
    // Single-column CSV: treat the first row as a header only if it looks like one,
    // otherwise every row (including the first) is a name.
    const looksLikeHeader = findNameColumnIndex(rows[0]) !== -1
    if (looksLikeHeader) {
      dataRows = rows.slice(1)
    }
  }

  const names = dataRows
    .map((row) => cleanName(row[nameColumnIndex]))
    .filter((name): name is string => name !== null)

  if (names.length === 0) {
    throw new CsvParseError('Não encontramos participantes no arquivo.')
  }

  return names
}
