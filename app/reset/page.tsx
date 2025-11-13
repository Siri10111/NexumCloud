'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Reset() {
  const [pw, setPw] = useState(''); const [msg, setMsg] = useState<string|null>(null)
  useEffect(() => {
    supabase.auth.onAuthStateChange((_e, _s) => {}) // ensures URL hash is parsed
  }, [])
  return (
    <main className="wrap">
      <div className="card">
        <h2>Set new password</h2>
        <input type="password" placeholder="New password" value={pw} onChange={e=>setPw(e.target.value)} />
        <button onClick={async()=>{
          const { error } = await supabase.auth.updateUser({ password: pw })
          setMsg(error ? error.message : 'Password updated. You can close this tab and sign in.')
        }}>Update</button>
        {msg && <p className="muted">{msg}</p>}
      </div>
    </main>
  )
}
