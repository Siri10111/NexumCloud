'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const PLANS = [
  { id: 'starter', label: 'Starter', desc: 'Great to start' },
  { id: 'pro',     label: 'Pro',     desc: 'For teams & scale' },
]

export default function Pricing() {
  const [userEmail, setUserEmail] = useState<string|null>(null)
  const [loading, setLoading] = useState<string|null>(null)
  const [msg, setMsg] = useState<string|null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null))
  }, [])

  const subscribe = async (plan: string) => {
    setMsg(null)
    setLoading(plan)
    const r = await fetch('/api/subscribe/intent', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ plan, source: 'cloud', startTrial: true }) // set to false if you don’t want trial
    })
    const d = await r.json()
    setLoading(null)
    if (r.ok) setMsg(d.message || 'Saved. You now have trial access while payments are being set up.')
    else setMsg(d.error || 'Something went wrong.')
  }

  return (
    <main style={{display:'grid',placeItems:'center',minHeight:'70dvh'}}>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        {PLANS.map(p => (
          <div key={p.id} style={{border:'1px solid #ddd',padding:20,borderRadius:12,width:280}}>
            <h3>{p.label}</h3><p>{p.desc}</p>
            <button onClick={()=>subscribe(p.id)} disabled={loading===p.id}>
              {loading===p.id ? 'Saving…' : userEmail ? 'Get access' : 'Sign in to continue'}
            </button>
            {!userEmail && <p style={{opacity:.8,marginTop:8}}>
              <a href="/cloud/auth" style={{textDecoration:'underline'}}>Sign in or create an account</a>
            </p>}
          </div>
        ))}
      </div>
      {msg && <p style={{marginTop:16}}>{msg}</p>}
    </main>
  )
}
