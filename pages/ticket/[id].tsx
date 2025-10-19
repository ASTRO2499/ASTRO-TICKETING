import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function TicketPage() {
  const router = useRouter()
  const { id } = router.query
  const [ticket, setTicket] = useState<any>(null)

  useEffect(()=>{
    if (!id) return
    fetch(`/api/ticket/${id}`).then(r=>r.json()).then(setTicket)
  },[id])

  if (!ticket) return <div className="p-6 text-strong">Loading...</div>
  return (
    <div className="max-w-lg mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-medium text-white">Your Ticket</h1>
  <p className="mt-2 text-strong">Name: {ticket.name}</p>
        <p className="text-sm text-blue-200">Email: {ticket.email}</p>
        <div className="mt-6 flex gap-6 items-center">
          <img src={ticket.qr} alt="QR code" width={200} className="rounded-lg" />
          <div>
            <a className="btn-primary" href={ticket.pdfUrl || `/api/ticket-pdf?id=${ticket.id}`}>Download PDF</a>
          </div>
        </div>
      </div>
    </div>
  )
}
