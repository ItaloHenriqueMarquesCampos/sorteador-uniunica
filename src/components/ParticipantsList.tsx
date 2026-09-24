import { useEffect, useRef } from 'react'

interface ParticipantsListProps {
  participants: string[]
  highlightName: string | null
}

export function ParticipantsList({ participants, highlightName }: ParticipantsListProps) {
  const highlightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    highlightRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [highlightName])

  const firstHighlightIndex = highlightName !== null ? participants.indexOf(highlightName) : -1

  return (
    <section
      aria-label="Lista de participantes do sorteio"
      className="flex max-h-28 w-full max-w-3xl shrink-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl sm:max-h-32"
    >
      <p className="mb-2 shrink-0 text-center text-xs font-semibold uppercase tracking-widest text-white/60">
        Participantes ({participants.length})
      </p>

      <div className="flex min-h-0 flex-1 flex-wrap content-start justify-center gap-1.5 overflow-y-auto">
        {participants.map((name, index) => {
          const isHighlighted = highlightName !== null && name === highlightName
          const isScrollTarget = index === firstHighlightIndex

          return (
            <span
              key={index}
              ref={isScrollTarget ? highlightRef : undefined}
              className={`h-fit rounded-full px-3 py-1 text-xs transition-colors duration-150 sm:text-sm ${
                isHighlighted
                  ? 'bg-brand-vibrant font-semibold text-white shadow-[0_0_12px_rgba(139,61,255,0.7)]'
                  : 'bg-white/10 text-white/75'
              }`}
            >
              {name}
            </span>
          )
        })}
      </div>
    </section>
  )
}
