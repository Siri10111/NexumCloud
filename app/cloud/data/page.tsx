'use client'

import { useState, type CSSProperties } from 'react'

interface FileItem {
  id: string
  name: string
  size: string
  type: 'dataset' | 'model' | 'artifact'
  modified: string
}

interface Bucket {
  id: string
  name: string
  region: string
  usage: string
  files: FileItem[]
}

const card: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  background: 'radial-gradient(circle at top, rgba(18,21,40,0.9), rgba(6,6,16,0.96))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
}

export default function DataPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [activeBucketId, setActiveBucketId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [uploadName, setUploadName] = useState('')

  const [newBucketName, setNewBucketName] = useState('')
  const [newBucketRegion, setNewBucketRegion] = useState('us-central-1')

  const activeBucket = buckets.find(b => b.id === activeBucketId) ?? (buckets[0] ?? null)
  const filteredFiles =
    activeBucket?.files.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) ?? []

  const createBucket = () => {
    if (!newBucketName.trim()) return
    const id = `b-${Date.now()}`
    const bucket: Bucket = {
      id,
      name: newBucketName.trim(),
      region: newBucketRegion,
      usage: '0 GB',
      files: [],
    }
    setBuckets(prev => [...prev, bucket])
    setActiveBucketId(id)
    setNewBucketName('')
  }

  const uploadFile = () => {
    if (!uploadName.trim() || !activeBucket) return
    const newFile: FileItem = {
      id: `f-${Date.now()}`,
      name: uploadName.trim(),
      size: `${(Math.random() * 5 + 0.1).toFixed(2)} GB`,
      type: 'artifact',
      modified: 'just now',
    }
    setBuckets(prev =>
      prev.map(b =>
        b.id === activeBucket.id
          ? {
              ...b,
              files: [newFile, ...b.files],
              usage: `${(parseFloat(b.usage) || 0 + parseFloat(newFile.size)).toFixed(2)} GB`,
            }
          : b
      )
    )
    setUploadName('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Data vaults</h1>
          <p style={{ fontSize: 12, opacity: 0.75 }}>
            Create buckets for datasets, models, and artifacts. Everything here starts empty until you define it.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0,1fr)', gap: 16 }}>
        {/* Buckets list + creation */}
        <div style={card}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 10 }}>Buckets</div>
          <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              placeholder="Bucket name (e.g. datasets)"
              value={newBucketName}
              onChange={e => setNewBucketName(e.target.value)}
              style={{ fontSize: 12 }}
            />
            <select
              value={newBucketRegion}
              onChange={e => setNewBucketRegion(e.target.value)}
              style={{ fontSize: 12 }}
            >
              <option value="us-central-1">us-central-1 · Chicago</option>
              <option value="us-east-1">us-east-1 · Virginia</option>
              <option value="eu-west-1">eu-west-1 · Ireland</option>
              <option value="ap-south-1">ap-south-1 · Mumbai</option>
            </select>
            <button
              onClick={createBucket}
              style={{
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 12,
                border: '1px solid rgba(78,240,255,0.9)',
                background: 'linear-gradient(135deg, rgba(78,240,255,0.18), rgba(142,124,255,0.3))',
              }}
            >
              + Create bucket
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {buckets.length === 0 && (
              <p style={{ fontSize: 12, opacity: 0.7 }}>
                You don&apos;t have any buckets yet. Create one to start organizing datasets and models.
              </p>
            )}
            {buckets.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBucketId(b.id)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background:
                    (activeBucket?.id ?? null) === b.id
                      ? 'linear-gradient(135deg, rgba(78,240,255,0.2), rgba(142,124,255,0.3))'
                      : 'rgba(5,5,15,0.9)',
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 500 }}>{b.name}</div>
                <div style={{ opacity: 0.8 }}>
                  {b.region} • {b.usage} used
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Files list */}
        <div style={card}>
          {activeBucket ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>{activeBucket.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>
                    Region {activeBucket.region} · {activeBucket.usage} used
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 260 }}>
                  <input
                    placeholder="Search files…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
                <input
                  placeholder="Simulate upload: artifact.tar"
                  value={uploadName}
                  onChange={e => setUploadName(e.target.value)}
                  style={{ fontSize: 12 }}
                />
                <button
                  onClick={uploadFile}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 12,
                    border: '1px solid rgba(78,240,255,0.9)',
                    background: 'linear-gradient(135deg, rgba(78,240,255,0.18), rgba(142,124,255,0.3))',
                  }}
                >
                  Upload
                </button>
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
                    <th style={{ padding: '6px 4px' }}>File</th>
                    <th style={{ padding: '6px 4px' }}>Type</th>
                    <th style={{ padding: '6px 4px' }}>Size</th>
                    <th style={{ padding: '6px 4px' }}>Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(f => (
                    <tr key={f.id}>
                      <td style={{ padding: '6px 4px' }}>{f.name}</td>
                      <td style={{ padding: '6px 4px', opacity: 0.8 }}>{f.type}</td>
                      <td style={{ padding: '6px 4px', opacity: 0.9 }}>{f.size}</td>
                      <td style={{ padding: '6px 4px', opacity: 0.7 }}>{f.modified}</td>
                    </tr>
                  ))}
                  {filteredFiles.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '10px 4px', opacity: 0.7 }}>
                        This bucket has no files yet. Use the upload field above to simulate storing artifacts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>No bucket selected</div>
              <p style={{ fontSize: 12, opacity: 0.8 }}>
                Create a bucket on the left to begin. Once your real backend is connected, Nexum can point these buckets
                at Supabase Storage or object stores like S3.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
