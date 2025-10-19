import type { NextApiRequest, NextApiResponse } from 'next'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'
import { PassThrough } from 'stream'

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '')

// configure nodemailer transporter using Gmail SMTP (app password)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, metadata } = req.body
  // verify signature using HMAC SHA256
  const secret = process.env.RAZORPAY_KEY_SECRET || ''
  const generated_signature = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex')
  if (generated_signature !== razorpay_signature) {
    console.warn('invalid razorpay signature', { generated_signature, razorpay_signature })
    return res.status(400).json({ error: 'invalid_signature' })
  }

  // create ticket record in Supabase
  try {
    const id = `TICKET_${Date.now()}`
    const qrData = `${id}|${metadata?.email}`
    const qrSvg = await QRCode.toDataURL(qrData)
  await supabase.from('tickets').insert([{ id, name: metadata?.name, email: metadata?.email, user_id: metadata?.user_id || null, payment_id: razorpay_payment_id, qr: qrSvg, created_at: new Date() }])
    // send email with ticket link and attach PDF
    const ticketUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/ticket/${id}`

    // generate PDF in-memory
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const stream = new PassThrough()
    const buffers: any[] = []
    doc.pipe(stream)
    doc.fontSize(20).text('Event Ticket', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text(`Name: ${metadata?.name}`)
    doc.text(`Email: ${metadata?.email}`)
    doc.text(`Ticket ID: ${id}`)
    doc.moveDown()
    if (qrSvg.startsWith('data:image')) {
      const base64 = qrSvg.split(',')[1]
      const img = Buffer.from(base64, 'base64')
      try { doc.image(img, { fit: [200,200], align: 'center' }) } catch(e) { console.error('pdf image error', e) }
    }
    doc.end()

    // collect buffer
    stream.on('data', (chunk) => buffers.push(chunk))
    await new Promise<void>((resolve) => stream.on('end', () => resolve()))
    const pdfBuffer = Buffer.concat(buffers)

    // upload PDF to Supabase Storage bucket 'tickets'
    const bucket = 'tickets'
    const filePath = `${id}.pdf`
    try {
      // try to create bucket if it doesn't exist (ignores error if exists)
      await supabase.storage.createBucket(bucket, { public: false })
    } catch (e) {
      // ignore - likely already exists or not permitted; we'll proceed to upload
    }
    const uploadRes = await supabase.storage.from(bucket).upload(filePath, pdfBuffer, { contentType: 'application/pdf', upsert: true })
    if (uploadRes.error) {
      console.error('upload error', uploadRes.error)
    }

    // create signed URL for download (expires in seconds)
    const expires = Number(process.env.STORAGE_URL_EXPIRES || '604800') // default 7 days
    const { data: signedData, error: signedErr } = await supabase.storage.from(bucket).createSignedUrl(filePath, expires)
    if (signedErr) console.error('signed url err', signedErr)
    const pdfUrl = signedData?.signedUrl || `${ticketUrl}`

    // send email via SMTP with inline QR and signed download link
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: metadata?.email,
      subject: 'Your Ticket',
      html: `
        <div style="font-family: Arial, sans-serif; font-size:14px; color:#111">
          <p>Hi ${metadata?.name},</p>
          <p>Thanks for your purchase. Your ticket is ready — open it here: <a href="${ticketUrl}">View Ticket</a></p>
          <p><img src="${qrSvg}" alt="QR" style="width:200px;height:200px"/></p>
          <p>You can download a printable PDF here: <a href="${pdfUrl}">Download ticket PDF</a></p>
          <p>Show this QR at entry.</p>
        </div>
      `,
    })

    return res.json({ ticketUrl, pdfUrl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'ticket_failed' })
  }
}
