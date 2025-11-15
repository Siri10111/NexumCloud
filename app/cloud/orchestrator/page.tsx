'use client'

import { useState, type CSSProperties } from 'react'

interface Message {
  id: string
  role: 'user' | 'system'
  content: string
}

const card: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.96))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
}

export default function OrchestratorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      role: 'system',
      content: 'Nexum Orchestrator is ready. Describe a workload and I will propose a job configuration.',
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const send = () => {
    if (!input.trim()) return
    const prompt = input.trim()
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: prompt }])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const config = generateFakeConfig(prompt)
      setMessages(prev => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          role: 'system',
          content:
            `Here is a proposed job configuration based on your description:\n\n${config}\n\n` +
            `You can adapt this into a preset in the Jobs composer or send it to a real control plane later.`,
        },
      ])
      setIsThinking(false)
    }, 900)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Orchestrator</h1>
          <p style={{ fontSize: 12, opacity: 0.75 }}>
            Use natural language to describe workloads. Nexum will respond with structured job blueprints.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,1.3fr)', gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>Conversation</div>
          <div
            style={{
              maxHeight: 420,
              overflowY: 'auto',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '8px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.4))'
                      : 'rgba(5,5,15,0.9)',
                  border:
                    msg.role === 'user'
                      ? '1px solid rgba(78,240,255,0.9)'
                      : '1px solid rgba(255,255,255,0.14)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            ))}
            {isThinking && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 11,
                  opacity: 0.8,
                  padding: '4px 8px',
                }}
              >
                Orchestrator is compiling…
              </div>
            )}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Example: Train a model on my main dataset with a 2 hour limit and save outputs to the models bucket."
              style={{
                flex: 1,
                minHeight: 70,
                maxHeight: 120,
                resize: 'vertical',
              }}
            />
            <button
              onClick={send}
              disabled={isThinking}
              style={{
                alignSelf: 'flex-end',
                padding: '8px 12px',
                borderRadius: 14,
                border: '1px solid rgba(78,240,255,0.9)',
                background: 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.35))',
                fontSize: 13,
              }}
            >
              {isThinking ? 'Compiling…' : 'Send'}
            </button>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Blueprints</div>
          <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            The Orchestrator converts free-form descriptions into YAML-like blueprints you can wire into Nexum&apos;s
            job system. In this prototype, responses are generated locally without calling any external model.
          </p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>
            Ask for GPU, CPU, datasets, time limits, or output paths and watch the configuration change.
          </p>
        </div>
      </div>
    </div>
  )
}

function generateFakeConfig(prompt: string): string {
  const lower = prompt.toLowerCase()
  const wantsGpu = lower.includes('gpu') || lower.includes('train') || lower.includes('model')
  const gpus = wantsGpu ? (lower.includes('8') ? 8 : lower.includes('2') ? 2 : 4) : 0
  const jobName = wantsGpu ? 'gpu-training-job' : 'cpu-batch-job'
  const dataset =
    lower.includes('alpha') ? 'alpha' : lower.includes('beta') ? 'beta' : 'main'

  return [
    `job:`,
    `  name: ${jobName}`,
    `  resources:`,
    `    gpus: ${gpus}`,
    `    gpu_type: ${wantsGpu ? 'a100' : 'none'}`,
    `    cpus: ${wantsGpu ? 16 : 8}`,
    `    memory: ${wantsGpu ? '64Gi' : '16Gi'}`,
    `  data:`,
    `    input_bucket: ${dataset}-datasets`,
    `    output_bucket: models-${dataset}`,
    `  limits:`,
    `    max_duration: 2h`,
    `    retry: 1`,
  ].join('\n')
}
