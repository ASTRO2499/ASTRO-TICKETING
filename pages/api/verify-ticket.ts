import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { data } = req.body
  // data expected to be 'TICKET_...|email'
  const [id, email] = String(data).split('|')
  const { data: ticket, error } = await supabase.from('tickets').select('*').eq('id', id).single()
  if (error) return res.json({ valid: false })
  if (ticket?.used) return res.json({ valid: false, reason: 'already_used' })
  await supabase.from('tickets').update({ used: true, used_at: new Date() }).eq('id', id)
  return res.json({ valid: true, id })
}
