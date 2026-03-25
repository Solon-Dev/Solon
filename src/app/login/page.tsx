'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '3rem 2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
          Solon AI
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Team Standards Enforcement Dashboard
        </p>

        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            background: '#1e293b',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.85rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#1e293b')}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Sign in with GitHub
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
