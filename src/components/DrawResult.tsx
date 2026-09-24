import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { DrawState } from '../hooks/useLottery'
import { getResultFontSize } from '../utils/fontScale'

interface DrawResultProps {
  drawState: DrawState
  reelName: string | null
  winner: string | null
}

function fireConfetti() {
  const colors = ['#8B3DFF', '#6C2BD9', '#FFFFFF']
  const duration = 1500
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 3,
      startVelocity: 35,
      spread: 70,
      angle: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    })
    confetti({
      particleCount: 3,
      startVelocity: 35,
      spread: 70,
      angle: 120,
      origin: { x: 1, y: 0.7 },
      colors,
    })

    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function DrawResult({ drawState, reelName, winner }: DrawResultProps) {
  const hasCelebrated = useRef(false)

  useEffect(() => {
    if (drawState === 'result' && !hasCelebrated.current) {
      hasCelebrated.current = true
      fireConfetti()
    }
    if (drawState !== 'result') {
      hasCelebrated.current = false
    }
  }, [drawState])

  if (drawState === 'idle') return null

  if (drawState === 'drawing') {
    return (
      <div className="flex max-h-[45dvh] min-h-[160px] w-full flex-col items-center justify-center gap-2 overflow-hidden px-4">
        <p
          key={reelName}
          className="animate-reel-tick w-full max-w-[90%] break-words text-center text-2xl font-extrabold uppercase tracking-wide text-white/90 sm:text-3xl"
        >
          {reelName}
        </p>
      </div>
    )
  }

  return (
    <div className="animate-result-in flex max-h-[45dvh] min-h-[160px] w-full flex-col items-center justify-center gap-3 overflow-hidden px-4 text-center">
      <span aria-hidden="true" className="shrink-0 text-4xl">
        🎉
      </span>
      <p className="shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Sorteio realizado</p>
      <p
        className="w-full max-w-[90%] break-words font-extrabold text-white drop-shadow-[0_0_25px_rgba(139,61,255,0.45)]"
        style={{ fontSize: winner ? getResultFontSize(winner) : undefined, overflowWrap: 'break-word' }}
      >
        {winner}
      </p>
    </div>
  )
}
