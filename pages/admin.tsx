import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [q, setQ] = useState('')
  const [tickets, setTickets] = useState<any[]>([])

  async function search(e?: any) {
    if (e) e.preventDefault()
    const res = await fetch(`/api/admin/tickets?q=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${secret}` } })
    const j = await res.json()
    setTickets(j || [])
  }

  async function toggle(id: string) {
    await fetch('/api/admin/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` }, body: JSON.stringify({ id, action: 'toggle' }) })
    await search()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-medium text-white">Admin - Tickets</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input placeholder="Admin secret" value={secret} onChange={e=>setSecret(e.target.value)} className="p-2 bg-transparent border border-white/6 rounded-md text-white" />
        <form onSubmit={search} className="md:col-span-2 flex gap-2">
          <input placeholder="search id or email" value={q} onChange={e=>setQ(e.target.value)} className="flex-1 p-2 bg-transparent border border-white/6 rounded-md text-white" />
          <button className="btn-primary">Search</button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {tickets.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-white">{t.id}</div>
              <div className="text-sm text-strong">{t.email} — {t.name}</div>
              <div className="text-xs text-strong">Used: {String(t.used)}</div>
            </div>
            <div>
              <button onClick={()=>toggle(t.id)} className="btn-ghost">Toggle used</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
