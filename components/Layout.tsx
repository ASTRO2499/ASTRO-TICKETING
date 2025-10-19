import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
  <footer className="mt-12 text-center text-sm text-strong">© {new Date().getFullYear()} Event Tickets — created by <span className="font-medium text-strong-accent">ASTROCODEX</span></footer>

      {/* Watermark */}
      <div aria-hidden className="pointer-events-none fixed inset-0 flex items-end justify-end p-8 opacity-5 select-none">
        <div className="text-6xl font-extrabold text-white/6">ASTROCODEX</div>
      </div>
    </div>
  )
}
