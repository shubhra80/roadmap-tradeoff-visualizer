import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function Login({ session }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
      else setExpanded(false)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-xs text-[#8CA3BC]">
        <span className="hidden sm:inline">{session.user.email}</span>
        <button
          onClick={handleLogout}
          className="rounded-sm border border-ink/30 px-2 py-1 text-ink hover:bg-ink/10"
        >
          Log out
        </button>
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="shrink-0 rounded-sm border border-ink bg-ink/15 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/25"
      >
        Log In
      </button>
    )
  }

  return (
    <div className="relative shrink-0">
      <div className="absolute right-0 top-0 z-50 w-64 rounded-sm border border-ink/25 bg-navy p-3 text-xs text-[#DCE8F5] shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading font-semibold text-ink">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </span>
          <button
            onClick={() => setExpanded(false)}
            className="text-[#8CA3BC] hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
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
    </div>
  )
}