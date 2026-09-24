import { useCallback, useRef, useState } from 'react'
import { CsvParseError, parseParticipants } from '../utils/csvParser'
import { drawRandomParticipant } from '../utils/randomDraw'

export type ListState = 'empty' | 'processing' | 'loaded' | 'error'
export type DrawState = 'idle' | 'drawing' | 'result'

interface UseLotteryState {
  listState: ListState
  drawState: DrawState
  fileName: string | null
  participants: string[]
  errorMessage: string | null
  winner: string | null
}

const REEL_INTERVAL_MS = 80
const REEL_DURATION_MS = 2200

export function useLottery() {
  const [state, setState] = useState<UseLotteryState>({
    listState: 'empty',
    drawState: 'idle',
    fileName: null,
    participants: [],
    errorMessage: null,
    winner: null,
  })

  const [reelName, setReelName] = useState<string | null>(null)
  const reelTimerRef = useRef<number | null>(null)

  const loadFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setState((s) => ({ ...s, listState: 'error', errorMessage: 'Selecione um arquivo CSV válido.' }))
      return
    }

    setState((s) => ({ ...s, listState: 'processing', errorMessage: null }))

    try {
      const text = await file.text()
      if (text.trim().length === 0) {
        throw new CsvParseError('Não encontramos participantes no arquivo.')
      }

      const names = parseParticipants(text)

      setState({
        listState: 'loaded',
        drawState: 'idle',
        fileName: file.name,
        participants: names,
        errorMessage: null,
        winner: null,
      })
    } catch (error) {
      const message =
        error instanceof CsvParseError
          ? error.message
          : 'Não foi possível ler o arquivo. Verifique o formato do CSV.'
      setState({
        listState: 'error',
        drawState: 'idle',
        fileName: null,
        participants: [],
        errorMessage: message,
        winner: null,
      })
    }
  }, [])

  const draw = useCallback(() => {
    const participants = state.participants
    if (participants.length === 0) return

    const winner = drawRandomParticipant(participants)
    setState((s) => ({ ...s, drawState: 'drawing', winner: null }))

    if (reelTimerRef.current) window.clearInterval(reelTimerRef.current)

    reelTimerRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length)
      setReelName(participants[randomIndex])
    }, REEL_INTERVAL_MS)

    window.setTimeout(() => {
      if (reelTimerRef.current) {
        window.clearInterval(reelTimerRef.current)
        reelTimerRef.current = null
      }
      setReelName(null)
      setState((s) => ({ ...s, drawState: 'result', winner }))
    }, REEL_DURATION_MS)
  }, [state.participants])

  const reset = useCallback(() => {
    setState((s) => ({ ...s, drawState: 'idle', winner: null }))
  }, [])

  return {
    ...state,
    reelName,
    loadFile,
    draw,
    reset,
  }
}
