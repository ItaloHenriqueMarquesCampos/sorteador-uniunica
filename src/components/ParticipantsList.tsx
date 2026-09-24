import { useEffect, useRef } from 'react'

interface ParticipantsListProps {
  participants: string[]
  highlightName: string | null
}

export function ParticipantsList({ participants, highlightName }: ParticipantsListProps) {
  const highlightRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    highlightRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [highlightName])

  const firstHighlightIndex = highlightName !== null ? participants.indexOf(highlightName) : -1

  return (
    <aside
      aria-label="Lista de participantes do sorteio"
      className="hidden max-h-[80dvh] w-72 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl lg:flex"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Participantes</p>
      <p className="mb-4 text-xs text-white/50">
        {participants.length} {participants.length === 1 ? 'pessoa na lista' : 'pessoas na lista'}
      </p>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {participants.map((name, index) => {
          const isHighlighted = highlightName !== null && name === highlightName
          const isScrollTarget = index === firstHighlightIndex

          return (
            <li
              key={index}
              ref={isScrollTarget ? highlightRef : undefined}
              className={`flex items-baseline gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors duration-150 ${
                isHighlighted ? 'bg-brand-vibrant/40 font-semibold text-white' : 'text-white/80'
              }`}
            >
              <span className="shrink-0 text-xs tabular-nums text-white/40">{index + 1}.</span>
              <span className="truncate">{name}</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
