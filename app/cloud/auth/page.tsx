'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { supabase } from '@/lib/supabase'

const card: CSSProperties = {
  borderRadius: 18,
  padding: 18,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.98))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.7)',
  maxWidth: 380,
  width: '100%',
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If already signed in, bounce to /cloud
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = '/cloud'
      }
    })
  }, [])

  const handleEmailAuth = async () => {
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Email and password are required.')
        return
      }

      if (mode === 'signup') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters.')
          return
        }
        if (password !== confirm) {
          setError('Passwords do not match.')
          return
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/cloud`,
          },
        })
        if (signUpError) {
          setError(signUpError.message)
          return
        }
        // Supabase may require email confirmation depending on your settings
        alert('Check your email to confirm your account, then sign in.')
        setMode('signin')
        setPassword('')
        setConfirm('')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          setError(signInError.message)
          return
        }
        window.location.href = '/cloud'
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const redirectTo = `${window.location.origin}/cloud`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (oauthError) {
        setError(oauthError.message)
        setLoading(false)
      }
      // On success, Supabase will redirect to Google then back to /cloud.
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'radial-gradient(circle at top, #141622 0, #050509 60%)',
      }}
    >
      <div style={card}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Welcome to</div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Nexum Cloud</h1>
          <p style={{ fontSize: 12, opacity: 0.75 }}>
            {mode === 'signin'
              ? 'Sign in to manage your compute, data, and intelligent workloads.'
              : 'Create an account to start using Nexum Cloud.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Email</label>
          <input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Password</label>
          <input
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        {mode === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, opacity: 0.8 }}>Confirm password</label>
            <input
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
            />
          </div>
        )}

        {error && (
          <p style={{ fontSize: 12, color: '#FF4F6E', marginTop: 4, marginBottom: 6 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 6,
            padding: '8px 12px',
            borderRadius: 14,
            border: '1px solid rgba(78,240,255,0.9)',
            background: 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))',
            fontSize: 13,
          }}
        >
          {loading
            ? 'Please wait…'
            : mode === 'signin'
            ? 'Sign in with email'
            : 'Create account'}
        </button>

        <div style={{ margin: '10px 0', fontSize: 11, textAlign: 'center', opacity: 0.7 }}>or</div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(5,5,15,0.95)',
            fontSize: 13,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: 'conic-gradient(from 180deg,#4285F4,#34A853,#FBBC05,#EA4335,#4285F4)',
            }}
          />
          <span>{loading ? 'Redirecting…' : 'Continue with Google'}</span>
        </button>

        <div style={{ fontSize: 12, marginTop: 10, textAlign: 'center', opacity: 0.85 }}>
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4EF0FF',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: 12,
                  textDecoration: 'underline',
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4EF0FF',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: 12,
                  textDecoration: 'underline',
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 10, textAlign: 'center' }}>
          By continuing you agree to Nexum&apos;s usage policies.
        </div>
      </div>
    </div>
  )
}
