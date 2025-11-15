'use client'

import { useEffect, useState, type CSSProperties } from 'react'

const cardStyle: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.96))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
}

const statNumberStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 600,
}

const statLabelStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.75,
}

const pillStyle: CSSProperties = {
  fontSize: 11,
  padding: '4px 8px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(10,10,24,0.9)',
}

export default function CloudDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const done = window.localStorage.getItem('nexumOnboarded')
    setShowOnboarding(!done)
  }, [])

  const completeOnboarding = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nexumOnboarded', '1')
    }
    setShowOnboarding(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Row 1: greeting + stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.2fr) minmax(0,1.4fr)', gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Welcome to Nexum Cloud</div>
            <span style={pillStyle}>{showOnboarding ? 'Getting started' : 'Ready'}</span>
          </div>
          <h2 style={{ fontSize: 24, margin: '4px 0 12px' }}>
            Your intelligent cloud control center.
          </h2>
          <p style={{ fontSize: 13, opacity: 0.8, maxWidth: 420 }}>
            Use this space to launch compute jobs, connect data vaults, and orchestrate intelligent workloads
            across your infrastructure.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowOnboarding(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid rgba(78,240,255,0.9)',
                background: 'linear-gradient(135deg, rgba(78,240,255,0.18), rgba(142,124,255,0.3))',
                color: '#f5f5ff',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              🧭 Run onboarding
            </button>
            <a href="/cloud/jobs">
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(5,5,15,0.9)',
                  color: '#f5f5ff',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ⚙️ Go to Jobs
              </button>
            </a>
            <a href="/cloud/data">
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(5,5,15,0.9)',
                  color: '#f5f5ff',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                🗄️ Go to Data vaults
              </button>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10 }}>
          <div style={cardStyle}>
            <div style={statLabelStyle}>Active jobs</div>
            <div style={statNumberStyle}>0</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>No workloads are running yet</div>
          </div>
          <div style={cardStyle}>
            <div style={statLabelStyle}>Data vaults</div>
            <div style={statNumberStyle}>0</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>Create your first bucket in Data</div>
          </div>
          <div style={cardStyle}>
            <div style={statLabelStyle}>Orchestrator</div>
            <div style={statNumberStyle}>AI</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>Describe workloads in natural language</div>
          </div>
        </div>
      </section>

      {/* Row 2: empty-state guidance */}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.1fr) minmax(0,1.5fr)', gap: 18 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>Next actions</div>
          <ul style={{ listStyle: 'none', fontSize: 12, opacity: 0.85, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              <span style={{ marginRight: 8 }}>1.</span>
              <a href="/cloud/settings" style={{ textDecoration: 'underline' }}>Secure your workspace</a> by confirming
              your region, theme, and telemetry preferences.
            </li>
            <li>
              <span style={{ marginRight: 8 }}>2.</span>
              <a href="/cloud/data" style={{ textDecoration: 'underline' }}>Create a data vault bucket</a> for datasets,
              models, or artifacts.
            </li>
            <li>
              <span style={{ marginRight: 8 }}>3.</span>
              <a href="/cloud/jobs" style={{ textDecoration: 'underline' }}>Launch your first compute job</a> using a
              preset that fits your workload.
            </li>
            <li>
              <span style={{ marginRight: 8 }}>4.</span>
              <a href="/cloud/orchestrator" style={{ textDecoration: 'underline' }}>Ask the Orchestrator</a> to draft a
              job configuration from plain English.
            </li>
          </ul>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Environment status</div>
          <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            This workspace is initialized but idle. Nexum will visualize cluster utilization and job timelines here as
            you start using compute and storage.
          </p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            For now, use onboarding to set up your environment and run your first job. Everything in this prototype is
            local to your account and safe to experiment with.
          </p>
        </div>
      </section>

      {/* Onboarding overlay */}
      {showOnboarding && (
        <OnboardingOverlay
          step={step}
          setStep={setStep}
          onClose={() => setShowOnboarding(false)}
          onComplete={completeOnboarding}
        />
      )}
    </div>
  )
}

function OnboardingOverlay({
  step,
  setStep,
  onClose,
  onComplete,
}: {
  step: number
  setStep: (s: number) => void
  onClose: () => void
  onComplete: () => void
}) {
  const steps = [
    {
      title: 'Secure your environment',
      body: 'Review your primary region, theme, and telemetry settings. This defines how Nexum behaves for your workspace.',
      cta: 'Open settings',
      href: '/cloud/settings',
    },
    {
      title: 'Create a data vault bucket',
      body: 'Set up a bucket to store datasets, models, or artifacts. This is where your jobs will read and write data.',
      cta: 'Open Data vaults',
      href: '/cloud/data',
    },
    {
      title: 'Launch your first job',
      body: 'Use a preset to start a compute job, or ask the Orchestrator to generate a configuration from natural language.',
      cta: 'Open Jobs',
      href: '/cloud/jobs',
    },
  ]

  const current = steps[step]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...cardStyle,
          width: 420,
          maxWidth: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Onboarding</div>
            <h2 style={{ fontSize: 18 }}>{current.title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(5,5,15,0.9)',
              fontSize: 11,
              padding: '4px 8px',
            }}
          >
            Skip
          </button>
        </div>
        <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>{current.body}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.75 }}>
            Step {step + 1} of {steps.length}
          </div>
          <a href={current.href}>
            <button
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(78,240,255,0.9)',
                background: 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))',
                fontSize: 12,
              }}
            >
              {current.cta}
            </button>
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(5,5,15,0.9)',
              fontSize: 12,
              opacity: step === 0 ? 0.4 : 1,
              cursor: step === 0 ? 'default' : 'pointer',
            }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(78,240,255,0.9)',
                background: 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))',
                fontSize: 12,
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={onComplete}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(111,207,151,0.9)',
                background: 'linear-gradient(135deg, rgba(111,207,151,0.3), rgba(78,240,255,0.25))',
                fontSize: 12,
              }}
            >
              Finish onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
