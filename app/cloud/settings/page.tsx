'use client'

import { useState } from 'react'

const card: React.CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.96))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
}

export default function SettingsPage() {
  const [region, setRegion] = useState('us-central-1')
  const [telemetry, setTelemetry] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState<'auto' | 'dark'>('dark')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  const apiKey = 'nexum_live_••••••••••••••••'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Settings</h1>
          <p style={{ fontSize: 12, opacity: 0.75 }}>
            Tune your Nexum Cloud environment, telemetry, and developer experience.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.2fr)', gap: 16 }}>
        <div style={card}>
          <h2 style={{ fontSize: 14, marginBottom: 10 }}>Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Primary region</div>
              <select value={region} onChange={e => setRegion(e.target.value)} style={{ fontSize: 12 }}>
                <option value="us-central-1">us-central-1 · Chicago</option>
                <option value="us-east-1">us-east-1 · Virginia</option>
                <option value="eu-west-1">eu-west-1 · Ireland</option>
                <option value="ap-south-1">ap-south-1 · Mumbai</option>
              </select>
              <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                This is where Nexum will prefer to schedule new workloads and store primary data replicas.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Theme</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setTheme('auto')}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: theme === 'auto' ? '1px solid rgba(78,240,255,0.9)' : '1px solid rgba(255,255,255,0.16)',
                    background:
                      theme === 'auto'
                        ? 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))'
                        : 'rgba(5,5,15,0.9)',
                  }}
                >
                  Auto
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: theme === 'dark' ? '1px solid rgba(78,240,255,0.9)' : '1px solid rgba(255,255,255,0.16)',
                    background:
                      theme === 'dark'
                        ? 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.35))'
                        : 'rgba(5,5,15,0.9)',
                  }}
                >
                  Dark
                </button>
              </div>
              <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                In this prototype dark is always on, but Nexum will support per-workspace themes later.
              </p>
            </div>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 14, marginBottom: 10 }}>Signals & access</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ToggleRow
              label="Operational telemetry"
              description="Share anonymous performance metrics to help optimize Nexum’s orchestration engine."
              value={telemetry}
              onChange={setTelemetry}
            />
            <ToggleRow
              label="Job notifications"
              description="Receive in-app alerts when jobs complete, fail, or exceed budget thresholds."
              value={notifications}
              onChange={setNotifications}
            />

            <div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>API access</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(5,5,15,0.96)',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: 11,
                }}
              >
                <span>{apiKeyVisible ? 'nexum_live_example_key_1234567890' : apiKey}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setApiKeyVisible(v => !v)}
                    style={{ fontSize: 11, padding: '4px 7px', borderRadius: 999 }}
                  >
                    {apiKeyVisible ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText('nexum_live_example_key_1234567890')}
                    style={{ fontSize: 11, padding: '4px 7px', borderRadius: 999 }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                In a real deployment this key would be per-workspace and scoped. Here it&apos;s just a placeholder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{label}</div>
          <p style={{ fontSize: 11, opacity: 0.7 }}>{description}</p>
        </div>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 44,
            height: 24,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.18)',
            background: value
              ? 'linear-gradient(135deg, rgba(78,240,255,0.5), rgba(142,124,255,0.8))'
              : 'rgba(5,5,15,0.9)',
            position: 'relative',
            padding: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: value ? 22 : 3,
              width: 16,
              height: 16,
              borderRadius: 999,
              background: '#f5f5ff',
              transition: 'left 0.2s ease',
            }}
          />
        </button>
      </div>
    </div>
  )
}
