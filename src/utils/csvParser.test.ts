import { describe, expect, it } from 'vitest'
import { CsvParseError, parseParticipants } from './csvParser'

describe('parseParticipants', () => {
  it('extracts names from a simple CSV with a "nome" header', () => {
    const csv = 'nome\nJoão da Silva\nMaria Oliveira\nCarlos Henrique'
    expect(parseParticipants(csv)).toEqual(['João da Silva', 'Maria Oliveira', 'Carlos Henrique'])
  })

  it('is case-insensitive and accent-insensitive on the header name', () => {
    expect(parseParticipants('NOME\nAna Paula')).toEqual(['Ana Paula'])
    expect(parseParticipants('Nome\nPedro Santos')).toEqual(['Pedro Santos'])
  })

  it('uses semicolon as delimiter and ignores other columns', () => {
    const csv = 'Nome;Email;CPF\nJoão Silva;joao@email.com;00000000000\nMaria Souza;maria@email.com;11111111111'
    expect(parseParticipants(csv)).toEqual(['João Silva', 'Maria Souza'])
  })

  it('uses comma as delimiter', () => {
    const csv = 'nome,email,cidade\nCarlos,carlos@email.com,SP\nAna,ana@email.com,RJ'
    expect(parseParticipants(csv)).toEqual(['Carlos', 'Ana'])
  })

  it('handles accented characters correctly', () => {
    const csv = 'nome\nJosé António\nMaría Fernández'
    expect(parseParticipants(csv)).toEqual(['José António', 'María Fernández'])
  })

  it('strips a UTF-8 BOM before the header', () => {
    const csv = '﻿nome\nJoão'
    expect(parseParticipants(csv)).toEqual(['João'])
  })

  it('trims whitespace and removes empty lines', () => {
    const csv = 'nome\n  João Silva  \n\nMaria Oliveira\n   \n'
    expect(parseParticipants(csv)).toEqual(['João Silva', 'Maria Oliveira'])
  })

  it('keeps duplicate names as separate entries', () => {
    const csv = 'nome\nJoão\nMaria\nJoão'
    expect(parseParticipants(csv)).toEqual(['João', 'Maria', 'João'])
  })

  it('handles a single participant', () => {
    expect(parseParticipants('nome\nÚnico Participante')).toEqual(['Único Participante'])
  })

  it('handles a plain list of names with no header', () => {
    const csv = 'João da Silva\nMaria Oliveira\nCarlos Henrique'
    expect(parseParticipants(csv)).toEqual(['João da Silva', 'Maria Oliveira', 'Carlos Henrique'])
  })

  it('handles a large list of participants', () => {
    const names = Array.from({ length: 500 }, (_, i) => `Participante ${i + 1}`)
    const csv = `nome\n${names.join('\n')}`
    expect(parseParticipants(csv)).toHaveLength(500)
  })

  it('throws a friendly error for an empty CSV', () => {
    expect(() => parseParticipants('')).toThrow(CsvParseError)
  })

  it('throws a friendly error when no rows contain a name', () => {
    expect(() => parseParticipants('nome\n\n\n')).toThrow(CsvParseError)
  })

  it('throws a friendly error when the name column cannot be identified', () => {
    const csv = 'email,cpf\njoao@email.com,00000000000'
    expect(() => parseParticipants(csv)).toThrow('Não foi possível identificar a coluna de nomes.')
  })
})
