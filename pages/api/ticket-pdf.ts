import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id || '')
  if (!id) return res.status(400).json({ error: 'missing id' })

  const { data: ticket, error } = await supabase.from('tickets').select('*').eq('id', id).single()
  if (error || !ticket) return res.status(404).json({ error: 'not_found' })

  // ticket.qr is a data URL (data:image/png;base64,...)
  const imgData = ticket.qr || ''

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="ticket-${id}.pdf"`)

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  doc.pipe(res)

  doc.fontSize(20).text('Event Ticket', { align: 'center' })
  doc.moveDown()

  doc.fontSize(14).text(`Name: ${ticket.name}`)
  doc.text(`Email: ${ticket.email}`)
  doc.text(`Ticket ID: ${ticket.id}`)
  doc.moveDown()

  if (imgData.startsWith('data:image')) {
    const base64 = imgData.split(',')[1]
    const img = Buffer.from(base64, 'base64')
    // place QR
    try {
      doc.image(img, { fit: [200, 200], align: 'center' })
    } catch (e) {
      console.error('pdf image error', e)
    }
  }

  doc.end()
}
