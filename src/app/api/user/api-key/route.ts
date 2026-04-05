import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const apiKey = 'solon_' + crypto.randomBytes(32).toString('hex')
  await db('UPDATE users SET api_key = $1 WHERE github_id = $2', [apiKey, session.user.githubId])
  return NextResponse.json({ apiKey })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await db('SELECT api_key FROM users WHERE github_id = $1', [session.user.githubId]) as Array<{ api_key: string | null }>
  return NextResponse.json({ apiKey: result[0]?.api_key ?? null })
}
