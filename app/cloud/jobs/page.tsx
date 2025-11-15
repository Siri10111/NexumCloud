'use client'

import { useState, type CSSProperties } from 'react'

type JobStatus = 'running' | 'queued' | 'completed' | 'failed'

interface Job {
  id: string
  name: string
  type: string
  status: JobStatus
  progress: number
  eta: string
  createdAt: string
}

const card: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.96))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
}

const pill: CSSProperties = {
  fontSize: 11,
  padding: '4px 8px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(10,10,24,0.9)',
}

function statusColor(status: JobStatus): string {
  if (status === 'running') return '#4EF0FF'
  if (status === 'queued') return '#F2C94C'
  if (status === 'completed') return '#6FCF97'
  return '#FF4F6E'
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('GPU · 2x A100')

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  const createJob = () => {
    if (!newName.trim()) return
    const id = `job-${Date.now()}`
    const job: Job = {
      id,
      name: newName.trim(),
      type: newType,
      status: 'queued',
      progress: 0,
      eta: '—',
      createdAt: 'just now',
    }
    setJobs(prev => [job, ...prev])
    setCreating(false)
    setNewName('')
  }

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === id
          ? {
              ...j,
              status,
              progress: status === 'completed' ? 100 : j.progress,
              eta: status === 'completed' ? 'done' : j.eta,
            }
          : j
      )
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Jobs</h1>
          <p style={{ fontSize: 12, opacity: 0.75 }}>
            Launch and manage compute workloads. This list starts empty until you create your first job.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(78,240,255,0.9)',
            background: 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.3))',
          }}
        >
          + New job
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ ...card, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, opacity: 0.85 }}>All jobs</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'running', 'queued', 'completed', 'failed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    ...pill,
                    borderColor: filter === s ? '#4EF0FF' : 'rgba(255,255,255,0.18)',
                    background:
                      filter === s ? 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.3))' : pill.background,
                    fontSize: 11,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.7 }}>
                <th style={{ padding: '6px 4px' }}>Job</th>
                <th style={{ padding: '6px 4px' }}>Type</th>
                <th style={{ padding: '6px 4px' }}>Status</th>
                <th style={{ padding: '6px 4px' }}>Progress</th>
                <th style={{ padding: '6px 4px' }}>ETA</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr
                  key={job.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedJob(job)}
                >
                  <td style={{ padding: '6px 4px' }}>{job.name}</td>
                  <td style={{ padding: '6px 4px', opacity: 0.8 }}>{job.type}</td>
                  <td style={{ padding: '6px 4px' }}>
                    <span
                      style={{
                        ...pill,
                        borderColor: statusColor(job.status),
                        color: statusColor(job.status),
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '6px 4px', width: 120 }}>
                    <div
                      style={{
                        width: '100%',
                        height: 6,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${job.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg,#4EF0FF,#8E7CFF)',
                          transition: 'width 0.3s ease-out',
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '6px 4px', opacity: 0.8 }}>{job.eta}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {job.status === 'queued' && (
                        <button
                          style={{ fontSize: 11, padding: '4px 8px' }}
                          onClick={e => {
                            e.stopPropagation()
                            updateJobStatus(job.id, 'running')
                          }}
                        >
                          Start
                        </button>
                      )}
                      {job.status === 'running' && (
                        <>
                          <button
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={e => {
                              e.stopPropagation()
                              updateJobStatus(job.id, 'completed')
                            }}
                          >
                            Complete
                          </button>
                          <button
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={e => {
                              e.stopPropagation()
                              updateJobStatus(job.id, 'failed')
                            }}
                          >
                            Fail
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '12px 4px', opacity: 0.7 }}>
                    You don&apos;t have any jobs yet. Click &quot;New job&quot; to create your first workload.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Side panel */}
        <div style={{ ...card, width: 280 }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Details</div>
          {selectedJob ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{selectedJob.name}</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>{selectedJob.type}</div>
              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                Created <b>{selectedJob.createdAt}</b>
              </p>
              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
                Current status:{' '}
                <span style={{ color: statusColor(selectedJob.status), fontWeight: 500 }}>
                  {selectedJob.status.toUpperCase()}
                </span>
              </p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>
                This panel will show live logs and metrics once your Nexum deployment is wired to a real control plane.
                For now it just reflects the job state you set here.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 12, opacity: 0.75 }}>
              Select a job to view details. Once you connect to a backend, this will be your window into real-time
              telemetry.
            </p>
          )}
        </div>
      </div>

      {/* Create job modal */}
      {creating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 40,
          }}
          onClick={() => setCreating(false)}
        >
          <div
            style={{
              ...card,
              width: 380,
              maxWidth: '100%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>New compute job</h2>
            <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
              Define a name and select a preset. In this prototype, jobs are stored locally in your session.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
              <label style={{ fontSize: 12, opacity: 0.8 }}>Job name</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. First GPU training job"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <label style={{ fontSize: 12, opacity: 0.8 }}>Preset</label>
              <select value={newType} onChange={e => setNewType(e.target.value)}>
                <option>GPU · 2x A100</option>
                <option>GPU · 4x A100</option>
                <option>GPU · 8x L40</option>
                <option>CPU · 8 vCPU</option>
                <option>CPU · 16 vCPU · high-mem</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setCreating(false)}
                style={{ background: 'rgba(5,5,15,0.9)', borderColor: 'rgba(255,255,255,0.18)', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={createJob}
                style={{
                  borderColor: 'rgba(78,240,255,0.9)',
                  background: 'linear-gradient(135deg, rgba(78,240,255,0.25), rgba(142,124,255,0.3))',
                  fontSize: 13,
                }}
              >
                Create job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
