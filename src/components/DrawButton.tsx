interface DrawButtonProps {
  onClick: () => void
  disabled: boolean
  isDrawing: boolean
  hasResult: boolean
}

export function DrawButton({ onClick, disabled, isDrawing, hasResult }: DrawButtonProps) {
  const label = isDrawing ? 'SORTEANDO...' : hasResult ? 'SORTEAR NOVAMENTE' : 'SORTEAR'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isDrawing}
      className="w-full rounded-full bg-brand-vibrant px-8 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand-vibrant/30 transition-all duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40 disabled:shadow-none sm:w-auto sm:min-w-[280px]"
      aria-live="polite"
    >
      {label}
    </button>
  )
}
