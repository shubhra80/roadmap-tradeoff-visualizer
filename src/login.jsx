import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function Login({ session }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2 rounded-sm border border-ink/20 bg-navy/90 px-3 py-1.5 text-xs text-[#8CA3BC] backdrop-blur">
        <span>{session.user.email}</span>
        <button
          onClick={handleLogout}
          className="rounded-sm border border-ink/30 px-2 py-0.5 text-ink hover:bg-ink/10"
        >
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-3 right-4 z-50 w-64 rounded-sm border border-ink/20 bg-navy/95 p-3 text-xs text-[#DCE8F5] backdrop-blur">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-sm border border-white/15 bg-transparent px-2 py-1.5 text-[#DCE8F5] placeholder:text-[#8CA3BC] focus:border-ink/50 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-sm border border-white/15 bg-transparent px-2 py-1.5 text-[#DCE8F5] placeholder:text-[#8CA3BC] focus:border-ink/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm border border-ink bg-ink/15 px-2 py-1.5 font-semibold text-ink hover:bg-ink/25 disabled:opacity-50"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login')
          setMessage('')
        }}
        className="mt-2 text-[#8CA3BC] underline hover:text-ink"
      >
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
      {message && <p className="mt-2 text-[#8CA3BC]">{message}</p>}
    </div>
  )
}