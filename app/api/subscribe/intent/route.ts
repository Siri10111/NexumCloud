import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSrv } from '@supabase/supabase-js'

export async function POST(req: Request) {
  // Supabase client bound to Next.js cookies (anon key under the hood)
  const supa = createRouteHandlerClient({ cookies })

  const { data: { user } } = await supa.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json().catch(() => null) as { plan?: string; source?: string; startTrial?: boolean }
  const plan = body?.plan || 'starter'
  const source = body?.source === 'root' ? 'root' : 'cloud'
  const startTrial = !!body?.startTrial

  // ensure profile/email
  const { data: profile } = await supa.from('profiles').select('email, trial_until').eq('id', user.id).maybeSingle()
  const email = profile?.email ?? user.email ?? ''

  // record intent
  await supa.from('subscription_intents').insert({
    email,
    user_id: user.id,
    plan,
    source,
    status: 'pending'
  })

  // optional: grant 7-day trial using service role (server-side only)
  if (startTrial && process.env.SUPABASE_SERVICE_ROLE) {
    const service = createSrv(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!)
    const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    await service.from('profiles').update({ trial_until: until }).eq('id', user.id)
    return NextResponse.json({ message: 'Trial started for 7 days. We’ll notify you when payments go live.' })
  }

  return NextResponse.json({ message: 'Intent saved. We’ll notify you when payments go live.' })
}
