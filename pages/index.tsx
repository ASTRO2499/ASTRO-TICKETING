import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      const data = await res.json()
      if (data?.orderId && data?.razorpayKey) {
        const options = {
          key: data.razorpayKey,
          amount: data.amount,
          currency: 'INR',
          name: 'Event Ticket',
          description: 'Ticket purchase',
          order_id: data.orderId,
          handler: async function (response: any) {
            const verify = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, metadata: { name, email } })
            })
            const v = await verify.json()
            if (v?.ticketUrl) window.location.href = v.ticketUrl
            else alert('Payment verified but ticket not generated')
          }
        }
        // @ts-ignore
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        alert('Failed to create order')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold mb-4">Get your ticket in minutes</h2>
          <p className="text-strong mb-6">Secure payments, instant PDF ticket and QR — email delivered. Small events, big experiences.</p>
          <div className="flex gap-3">
            <a href="#buy" className="btn-primary">Buy Ticket — ₹99</a>
            <a href="/verify" className="btn-ghost">Staff Verify</a>
          </div>
        </div>

        <div id="buy" className="card p-6 glass soft-border">
          <h3 className="text-xl font-semibold mb-3">Quick purchase</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input required value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full border p-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full border p-2 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-strong-accent">Price: <strong>₹99</strong></div>
              <button disabled={loading} className="btn-primary">{loading ? 'Processing…' : 'Pay ₹99'}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
