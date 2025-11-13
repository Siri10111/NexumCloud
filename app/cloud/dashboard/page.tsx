'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [ok, setOk] = useState<boolean|null>(null)
  const [email, setEmail] = useState<string|null>(null)
  const [trialEnd, setTrialEnd] = useState<Date|null>(null)

  useEffect(() => {
    (async () => {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { location.href = '/cloud/auth'; return }
      setEmail(user.email ?? null)

      // get trial info
      const { data: p } = await supabase.from('profiles').select('trial_until').eq('id', user.id).maybeSingle()
      const trialUntil = p?.trial_until ? new Date(p.trial_until) : null
      setTrialEnd(trialUntil)

      // TODO: later also check subscriptions table (synced by Stripe webhook)
      const hasTrial = !!trialUntil && trialUntil.getTime() > Date.now()
      setOk(hasTrial)
    })()
  }, [])

  if (ok === null) return <p style={{padding:24}}>Checking access…</p>
  if (!ok) return (
    <main style={{padding:24}}>
      <h1>Subscription required</h1>
      <p>You’re signed in{email?` as ${email}`:''}, but don’t have access yet.</p>
      <a href="https://nexumserver.com"><button>Buy a subscription on nexumserver.com</button></a>
      <p style={{opacity:.8,marginTop:8}}>Already purchased? You’ll get access as soon as we enable payments.</p>
    </main>
  )

  return (
    <main style={{padding:24}}>
      <h1>Welcome{email?`, ${email}`:''} 👋</h1>
      {trialEnd && <p>Trial active until <b>{trialEnd.toLocaleString()}</b></p>}
      <p>Your cloud tools go here.</p>
      <button onClick={()=>supabase.auth.signOut()}>Sign out</button>
    </main>
  )
}
