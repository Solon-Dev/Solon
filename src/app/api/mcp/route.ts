import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function validateApiKey(apiKey: string) {
  const result = await db(
    'SELECT u.id, u.github_id, u.subscription_status FROM users u WHERE u.api_key = $1',
    [apiKey]
  ) as Array<{ id: number; github_id: string; subscription_status: string }>
  return result[0] ?? null
}

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const user = await validateApiKey(apiKey)
  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const body = await req.json()
  const { tool, params } = body

  if (tool === 'solon_get_playbook') {
    const { repoFullName } = params
    const repos = await db(
      `SELECT r.id FROM repos r JOIN users u ON u.id = r.user_id WHERE r.full_name = $1 AND u.id = $2 AND r.is_active = true`,
      [repoFullName, user.id]
    ) as Array<{ id: number }>
    if (repos.length === 0) return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
    const configs = await db(
      'SELECT playbook_id, enabled_rules FROM playbook_configs WHERE repo_id = $1',
      [repos[0].id]
    )
    return NextResponse.json({ playbook: configs })
  }

  if (tool === 'solon_check_standards') {
    const { repoFullName, code, language } = params
    const repos = await db(
      `SELECT r.id FROM repos r JOIN users u ON u.id = r.user_id WHERE r.full_name = $1 AND u.id = $2 AND r.is_active = true`,
      [repoFullName, user.id]
    ) as Array<{ id: number }>
    if (repos.length === 0) return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
    const analyzeRes = await fetch(`${process.env.NEXTAUTH_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff: code, repoFullName, prNumber: 0, prTitle: 'MCP Standards Check', language: language ?? 'typescript' }),
    })
    if (!analyzeRes.ok) return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    const review = await analyzeRes.json()
    return NextResponse.json({ review })
  }

  if (tool === 'solon_record_review') {
    const { repoFullName, prNumber, prTitle, summary, status } = params
    const repos = await db(
      `SELECT r.id FROM repos r JOIN users u ON u.id = r.user_id WHERE r.full_name = $1 AND u.id = $2 AND r.is_active = true`,
      [repoFullName, user.id]
    ) as Array<{ id: number }>
    if (repos.length === 0) return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
    await db(
      `INSERT INTO reviews (repo_id, pr_number, pr_title, summary, status) VALUES ($1, $2, $3, $4, $5)`,
      [repos[0].id, prNumber, prTitle, summary, status ?? 'pass']
    )
    return NextResponse.json({ recorded: true })
  }

  return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
}
