interface ParticipantInfoProps {
  fileName: string
  participantCount: number
}

export function ParticipantInfo({ fileName, participantCount }: ParticipantInfoProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-6 py-4 text-center">
      <p className="text-xs text-white/50">
        Arquivo carregado: <span className="font-medium text-white/80">{fileName}</span>
      </p>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
        <span aria-hidden="true">✓</span> Lista carregada com sucesso
      </p>
      <p className="text-2xl font-extrabold text-white">
        {participantCount} <span className="text-base font-medium text-white/60">participantes</span>
      </p>
    </div>
  )
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-center text-sm font-medium text-red-200">
      {message}
    </p>
  )
}

export function ProcessingMessage() {
  return (
    <p role="status" className="text-center text-sm font-medium text-white/70">
      Processando lista...
    </p>
  )
}
