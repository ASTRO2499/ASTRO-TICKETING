import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function MyTickets() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    async function load() {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) {
        router.push('/auth')
        return
      }
      const uid = user.user.id
      const { data, error } = await supabase.from('tickets').select('*').eq('user_id', uid)
      if (error) console.error(error)
      setTickets(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="p-6 text-strong">Loading...</div>
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium text-white">My Tickets</h1>
        <button onClick={signOut} className="btn-ghost">Sign out</button>
      </div>
      <div className="space-y-4">
        {tickets.length === 0 && <p className="text-blue-200">No tickets yet.</p>}
        {tickets.map(t=> (
          <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center gap-4">
            <img src={t.qr} alt="qr" width={120} className="rounded-lg" />
            <div className="flex-1">
              <p className="font-medium text-white">{t.name}</p>
              <p className="text-sm text-strong">{t.email}</p>
              <div className="flex gap-3 mt-3">
                <a className="text-sm text-blue-200 hover:underline" href={`/ticket/${t.id}`}>Open ticket</a>
                <a className="text-sm text-blue-200 hover:underline" href={t.pdfUrl || `/api/ticket-pdf?id=${t.id}`}>Download PDF</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
