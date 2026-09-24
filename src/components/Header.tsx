import logo from '../assets/logo.png'

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <img src={logo} alt="Centro Universitário Única" className="h-8 w-auto sm:h-9" />
      <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Sorteador</p>
    </header>
  )
}
