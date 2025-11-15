'use client'

import type { ReactNode, CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const shellStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  background: 'radial-gradient(circle at top, #141622 0, #050509 55%)',
  color: '#f5f5ff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
}

const sidebarStyle: CSSProperties = {
  width: 80,
  padding: '16px 12px',
  borderRight: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
}

const iconButtonStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(8,10,24,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  cursor: 'pointer',
}

const iconButtonActive: CSSProperties = {
  ...iconButtonStyle,
  border: '1px solid rgba(78,240,255,0.9)',
  boxShadow: '0 0 16px rgba(78,240,255,0.45)',
  background: 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.25))',
}

const mainColumnStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const headerStyle: CSSProperties = {
  height: 72,
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(16px)',
  background: 'linear-gradient(90deg, rgba(5,5,15,0.85), rgba(5,5,15,0.65))',
}

const logoTextStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const logoGlyphStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 12,
  background: 'conic-gradient(from 180deg, #4EF0FF, #8E7CFF, #FF4FD8, #4EF0FF)',
  boxShadow: '0 0 18px rgba(142,124,255,0.7)',
}

const tagStyle: CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  opacity: 0.7,
}

const userBadgeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(15,15,25,0.9)',
  border: '1px solid rgba(255,255,255,0.06)',
  fontSize: 12,
}

const avatarStyle: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 999,
  background: 'radial-gradient(circle at 30% 20%, #4EF0FF, #121424)',
  border: '1px solid rgba(255,255,255,0.24)',
}

const contentStyle: CSSProperties = {
  flex: 1,
  padding: '18px 22px 22px',
  overflowY: 'auto',
}

const navLinks = [
  { href: '/cloud', icon: '', label: 'Dashboard' },
  { href: '/cloud/jobs', icon: '⚙️', label: 'Jobs' },
  { href: '/cloud/data', icon: '🗄️', label: 'Data' },
  { href: '/cloud/orchestrator', icon: '🧠', label: 'Orchestrator' },
  { href: '/cloud/settings', icon: '⚡', label: 'Settings' },
]

export default function CloudLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)
  const [loadingSignOut, setLoadingSignOut] = useState(false)

  useEffect(() => {
    // Get current user from Supabase
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  const handleSignOut = async () => {
    setLoadingSignOut(true)
    await supabase.auth.signOut()
    setLoadingSignOut(false)
    setEmail(null)
    if (pathname !== '/cloud') {
      window.location.href = '/cloud'
    } else {
      window.location.reload()
    }
  }

  return (
    <div style={shellStyle}>
      <aside style={sidebarStyle}>
        <div style={{ ...iconButtonStyle, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>N</span>
        </div>
        {navLinks.map((item) => {
          const active = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              style={active ? iconButtonActive : iconButtonStyle}
            >
              <span>{item.icon}</span>
            </a>
          )
        })}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 10, opacity: 0.55 }}>v0.1.0</div>
      </aside>

      <div style={mainColumnStyle}>
        <header style={headerStyle}>
          <div style={logoTextStyle}>
            <div style={logoGlyphStyle} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Nexum Cloud</div>
              <div style={tagStyle}>Cloud · Compute · Intelligence</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={userBadgeStyle}>
              <div style={avatarStyle} />
              <div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {email ? 'Signed in as' : 'Not signed in'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>
                  {email ?? 'guest'}
                </div>
              </div>
            </div>
            {email ? (
              <button
                onClick={handleSignOut}
                disabled={loadingSignOut}
                style={{
                  padding: '6px 10px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(5,5,15,0.9)',
                  fontSize: 12,
                  marginLeft: 6,
                }}
              >
                {loadingSignOut ? 'Signing out…' : 'Sign out'}
              </button>
            ) : (
              <a href="/cloud/auth">
                <button
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(78,240,255,0.9)',
                    background: 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))',
                    fontSize: 12,
                    marginLeft: 6,
                  }}
                >
                  Sign in
                </button>
              </a>
            )}
          </div>
        </header>

        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  )
}
