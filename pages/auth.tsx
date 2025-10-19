import { useState } from 'react'
import supabase from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function signInWithEmail(e: any) {
    e.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link (magic link)')
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card glass p-6">
        <h1 className="text-2xl font-medium text-white">Sign in / Sign up</h1>
        <form onSubmit={signInWithEmail} className="mt-4 space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2 bg-transparent border border-white/6 rounded-md text-white" />
          <button className="w-full btn-primary">Send magic link</button>
        </form>
        {message && <p className="mt-2 text-sm text-green-300">{message}</p>}
      </motion.div>
    </div>
  )
}
