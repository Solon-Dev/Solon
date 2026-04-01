'use client'
import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        background: 'transparent',
        border: '1px solid #475569',
        color: '#cbd5e1',
        padding: '0.35rem 0.75rem',
        borderRadius: '0.4rem',
        fontSize: '0.85rem',
        cursor: 'pointer',
      }}
    >
      Sign out
    </button>
  )
}
