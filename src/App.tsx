import backgroundUrl from './assets/background.svg'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { FileUploader } from './components/FileUploader'
import { ParticipantInfo, ErrorMessage, ProcessingMessage } from './components/ParticipantInfo'
import { DrawButton } from './components/DrawButton'
import { DrawResult } from './components/DrawResult'
import { useLottery } from './hooks/useLottery'

function App() {
  const { listState, drawState, fileName, participants, errorMessage, winner, reelName, loadFile, draw } =
    useLottery()

  const isDrawing = drawState === 'drawing'
  const hasResult = drawState === 'result'
  const canDraw = listState === 'loaded' && !isDrawing
  const isDrawingOrResult = isDrawing || hasResult

  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden bg-brand-deep bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("${backgroundUrl}")` }}
    >
      <Header />

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-2">
        <div className="flex max-h-[80dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:max-w-lg sm:p-10">
          {!isDrawingOrResult && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">SORTEADOR</h1>
              <p className="mt-1 text-sm font-medium text-white/70">Sorteio de nomes</p>
              <p className="mt-3 text-sm text-white/60">
                Faça o upload da lista de participantes e realize o sorteio.
              </p>
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
            {!isDrawingOrResult && listState === 'empty' && <FileUploader onFileSelected={loadFile} />}

            {!isDrawingOrResult && listState === 'processing' && <ProcessingMessage />}

            {!isDrawingOrResult && listState === 'error' && (
              <>
                <FileUploader onFileSelected={loadFile} />
                {errorMessage && <ErrorMessage message={errorMessage} />}
              </>
            )}

            {!isDrawingOrResult && listState === 'loaded' && fileName && (
              <ParticipantInfo fileName={fileName} participantCount={participants.length} />
            )}

            {isDrawingOrResult && <DrawResult drawState={drawState} reelName={reelName} winner={winner} />}

            {listState === 'loaded' && (
              <div className="flex shrink-0 justify-center">
                <DrawButton onClick={draw} disabled={!canDraw} isDrawing={isDrawing} hasResult={hasResult} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
