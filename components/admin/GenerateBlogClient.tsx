'use client'

import React, { useState } from 'react'

const TOPIC_CATEGORIES = [
  'Comprehensive Eye Exams',
  'Contact Lenses',
  'Pediatrics',
  'Hot Topics',
  'Dry Eyes',
  'Eyeglasses & Vision Correction',
  'Myopia Management',
  'Disease',
  'Vision Therapy',
]

export const GenerateBlogClient: React.FC = () => {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    adminUrl?: string
  } | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic || undefined }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: `"${data.draft.title}" saved as draft.`,
          adminUrl: data.draft.adminUrl,
        })
      } else {
        setResult({ success: false, message: data.error || 'Generation failed' })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
        Generate Blog Post
      </h1>

      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="topic-select"
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}
        >
          Topic
        </label>
        <select
          id="topic-select"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-150, #ddd)',
            backgroundColor: 'var(--theme-input-bg, #fff)',
            color: 'inherit',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          <option value="">Random</option>
          {TOPIC_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? 'var(--theme-elevation-200, #999)' : 'var(--theme-text, #000)',
          color: 'var(--theme-bg, #fff)',
          border: 'none',
          borderRadius: '4px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {loading ? 'Generating...' : 'Generate Blog Post'}
      </button>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '4px',
            backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${result.success ? '#4caf50' : '#f44336'}`,
          }}
        >
          <p style={{ marginBottom: result.adminUrl ? '10px' : '0', fontSize: '14px' }}>
            {result.message}
          </p>
          {result.adminUrl && (
            <a href={result.adminUrl} style={{ color: '#1976d2', fontWeight: 500, fontSize: '14px' }}>
              View &amp; Edit Draft
            </a>
          )}
        </div>
      )}
    </div>
  )
}
