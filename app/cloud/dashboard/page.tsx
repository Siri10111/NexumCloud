'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [email, setEmail] = useState<string|null>(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { location.href = '/cloud/auth'; return }
      setEmail(user.email ?? null)
    })()
  }, [])

  return (
    <main style={{padding:24}}>
      <h1>Dashboard</h1>
      <p>Welcome{email?`, ${email}`:''}.</p>
      <button onClick={()=>supabase.auth.signOut()}>Sign out</button>
    </main>
  )
}
