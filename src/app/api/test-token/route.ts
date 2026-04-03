import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const appId = process.env.SOLON_APP_ID
    const rawKey = process.env.SOLON_PRIVATE_KEY

    if (!appId || !rawKey) {
      return NextResponse.json({ error: 'Missing env vars', appId: !!appId, key: !!rawKey })
    }

    const privateKey = rawKey.replace(/\\n/g, '\n')
    const now = Math.floor(Date.now() / 1000)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({ iat: now - 60, exp: now + 600, iss: parseInt(appId, 10) })).toString('base64url')
    const signingInput = `${header}.${payload}`
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signingInput)
    const signature = sign.sign(privateKey, 'base64url')
    const jwt = `${signingInput}.${signature}`

    const res = await fetch('https://api.github.com/app/installations', {
      headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github.v3+json' }
    })
    const data = await res.json()
    return NextResponse.json({ status: res.status, data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) })
  }
}
