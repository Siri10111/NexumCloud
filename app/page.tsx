'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [view, setView] = useState<'signin' | 'signup' | 'home'>('signin')
  const [email, setEmail] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setView('home'); setEmail(data.session.user.email ?? null) }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) { setView('home'); setEmail(session.user.email ?? null) } else { setView('signin'); setEmail(null) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setErr(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false); if (error) setErr(error.message)
  }

  const signUp = async (email: string, password: string) => {
    setErr(null); setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false); if (error) setErr(error.message); else setView('signin')
  }

  const reset = async (email: string) => {
    setErr(null); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${location.origin}/reset` : undefined
    })
    setLoading(false); if (error) setErr(error.message)
  }

  if (view === 'home') return (
    <main className="wrap">
      <h1>Nexum</h1>
      <p>Signed in{email ? ` as ${email}` : ''}.</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </main>
  )

  // tiny form UI
  return (
    <main className="wrap">
      <h1>Nexum</h1>
      <AuthForms loading={loading} onSignIn={signIn} onSignUp={signUp} onReset={reset} err={err} setView={setView} view={view} />
    </main>
  )
}

function AuthForms({
  loading, onSignIn, onSignUp, onReset, err, setView, view
}: {
  loading:boolean; onSignIn:(e:string,p:string)=>void; onSignUp:(e:string,p:string)=>void;
  onReset:(e:string)=>void; err:string|null; view:'signin'|'signup'; setView:(v:any)=>void
}) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [confirm, setConfirm] = useState('')
  return (
    <div className="card">
      {view === 'signin' ? (
        <>
          <h2>Sign in</h2>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          {err && <p className="error">{err}</p>}
          <button disabled={loading} onClick={()=>onSignIn(email,pw)}>{loading?'…':'Sign in'}</button>
          <p className="muted">New here? <a onClick={()=>setView('signup')}>Create an account</a></p>
          <p className="muted"><a onClick={()=>onReset(email)}>Forgot password?</a></p>
        </>
      ) : (
        <>
          <h2>Create account</h2>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          <input placeholder="Confirm password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
          {err && <p className="error">{err}</p>}
          <button disabled={loading || pw!==confirm || pw.length<8}
                  onClick={()=>onSignUp(email,pw)}>{loading?'…':'Sign up'}</button>
          <p className="muted">Already have an account? <a onClick={()=>setView('signin')}>Sign in</a></p>
        </>
      )}
      <style jsx global>{`
        :root { font-family: system-ui, Segoe UI, Roboto, sans-serif; color-scheme: light dark; }
        body { margin:0 }
        .wrap { min-height:100dvh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:24px; }
        .card { width:340px; display:flex; flex-direction:column; gap:10px; padding:16px; border:1px solid #ffffff22; border-radius:12px; background:#151517; color:#eee; box-shadow: 0 12px 28px #0007; }
        input { background:#101013; color:#eee; padding:10px 12px; border-radius:8px; border:1px solid #2a2a2a; }
        button { padding:10px 12px; border-radius:10px; border:1px solid #2a2a2a; cursor:pointer; background:#1a1a1c; color:#fafafa; }
        .muted { opacity:.85; font-size:14px; }
        .error { color:#ff6b6b }
        a { text-decoration: underline; cursor: pointer; color:#79d2ff; }
      `}</style>
    </div>
  )
}
