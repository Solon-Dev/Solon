'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/user/api-key').then(r => r.json()).then(d => setApiKey(d.apiKey))
  }, [])

  async function generateKey() {
    setLoading(true)
    const res = await fetch('/api/user/api-key', { method: 'POST' })
    const data = await res.json()
    setApiKey(data.apiKey)
    setLoading(false)
  }

  function copyKey() {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>🛡️ Solon AI</Link>
        <Link href="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</Link>
      </nav>
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Settings</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Manage your API keys and MCP server setup.</p>

        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>MCP API Key</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Use this key to connect Solon AI to Claude Code or Cursor.</p>
          {apiKey ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <code style={{ flex: 1, background: '#f1f5f9', padding: '0.6rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#334155', wordBreak: 'break-all' }}>{apiKey}</code>
              <button onClick={copyKey} style={{ background: copied ? '#22c55e' : '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>No API key generated yet.</p>
          )}
          <button onClick={generateKey} disabled={loading} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            {loading ? 'Generating...' : apiKey ? 'Regenerate Key' : 'Generate API Key'}
          </button>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.75rem' }}>⚠️ Regenerating will invalidate your existing key.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>MCP Server Setup</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Add this to your Claude Code or Cursor MCP config:</p>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{`{
  "mcpServers": {
    "solon-ai": {
      "command": "npx",
      "args": ["-y", "solon-mcp"],
      "env": {
        "SOLON_API_KEY": "${apiKey ?? 'your-api-key-here'}"
      }
    }
  }
}`}</pre>
        </div>
      </main>
    </div>
  )
}
