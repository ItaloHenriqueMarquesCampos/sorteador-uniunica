import { useId, useRef, useState } from 'react'
import type { DragEvent } from 'react'

interface FileUploaderProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
}

export function FileUploader({ onFileSelected, disabled }: FileUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onFileSelected(file)
    event.target.value = ''
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        isDragging ? 'border-brand-vibrant bg-white/10' : 'border-white/25 bg-white/5'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <span aria-hidden="true" className="text-4xl">
        📄
      </span>
      <p className="text-sm text-white/80">Arraste seu arquivo CSV aqui</p>
      <p className="text-xs uppercase tracking-widest text-white/40">ou</p>

      <label
        htmlFor={inputId}
        className="cursor-pointer rounded-full bg-white/15 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25 focus-within:ring-2 focus-within:ring-brand-vibrant focus-within:ring-offset-2 focus-within:ring-offset-brand-deep"
      >
        Selecionar arquivo
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled}
          aria-label="Selecionar arquivo CSV com a lista de participantes"
        />
      </label>

      <p className="text-[11px] text-white/40">Formatos aceitos: CSV</p>
    </div>
  )
}
