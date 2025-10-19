import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Header(){
  return (
    <header className="glass soft-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-800 to-grad-end flex items-center justify-center text-white font-bold shadow-lg">
            ET
          </motion.div>
          <div>
            <div className="text-lg font-medium leading-none text-white">Event Tickets</div>
            <div className="text-xs text-strong-accent flex items-center gap-2">Simple, fast, elegant <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/6 text-strong">ASTROCODEX</span></div>
          </div>
        </Link>

        <nav className="space-x-4 text-sm">
          <Link href="/" className="text-strong hover:text-white">Home</Link>
          <Link href="/my-tickets" className="text-strong hover:text-white">My Tickets</Link>
          <Link href="/verify" className="text-strong hover:text-white">Verify</Link>
          <Link href="/admin" className="text-strong hover:text-white">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
