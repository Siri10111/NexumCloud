'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState<string|null>(null)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (s) location.href = '/cloud/pricing' })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr(error.message)
  }
  const signUp = async () => {
    setErr(null)
    if (pw.length < 8 || pw !== confirm) return setErr('Password must be ≥8 characters and match.')
    const { error } = await supabase.auth.signUp({ email, password: pw })
    if (error) setErr(error.message)
  }

  return (
    <main style={{display:'grid',placeItems:'center',minHeight:'70dvh'}}>
      <div style={{width:340,padding:16,border:'1px solid #ddd',borderRadius:12}}>
        <h2>{mode==='signin'?'Sign in':'Create account'}</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',margin:'8px 0',padding:8}}/>
        <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} style={{width:'100%',margin:'8px 0',padding:8}}/>
        {mode==='signup' && (
          <input placeholder="Confirm password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} style={{width:'100%',margin:'8px 0',padding:8}}/>
        )}
        {err && <p style={{color:'#d33'}}>{err}</p>}
        {mode==='signin' ? (
          <>
            <button onClick={signIn}>Sign in</button>
            <p style={{opacity:.8,marginTop:8}}>New? <a onClick={()=>setMode('signup')} style={{textDecoration:'underline',cursor:'pointer'}}>Create an account</a></p>
          </>
        ) : (
          <>
            <button disabled={pw.length<8 || pw!==confirm} onClick={signUp}>Sign up</button>
            <p style={{opacity:.8,marginTop:8}}>Have an account? <a onClick={()=>setMode('signin')} style={{textDecoration:'underline',cursor:'pointer'}}>Sign in</a></p>
          </>
        )}
      </div>
    </main>
  )
}
