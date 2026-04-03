import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const event = req.headers.get('x-github-event')
    const signature = req.headers.get('x-hub-signature-256')

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      if (!verifySignature(body, signature, webhookSecret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    if (event !== 'pull_request') {
      return NextResponse.json({ received: true, skipped: true })
    }

    const payload = JSON.parse(body)
    const action = payload.action

    if (action !== 'opened' && action !== 'synchronize' && action !== 'reopened') {
      return NextResponse.json({ received: true, skipped: true })
    }

    const repoFullName = payload.repository?.full_name
    const prNumber = payload.pull_request?.number
    const prTitle = payload.pull_request?.title
    const baseSha = payload.pull_request?.base?.sha
    const headSha = payload.pull_request?.head?.sha
    let installationId = payload.installation?.id

    if (!repoFullName || !prNumber || !baseSha || !headSha) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fall back to DB-stored installation_id if not in payload
    if (!installationId) {
      const repoRow = await db(
        'SELECT installation_id FROM repos WHERE full_name = $1 AND is_active = true LIMIT 1',
        [repoFullName]
      ) as Array<{ installation_id: number | null }>
      installationId = repoRow[0]?.installation_id ?? undefined
    }

    if (!installationId) {
      console.error('No installation_id found for repo:', repoFullName)
      return NextResponse.json({ error: 'Missing installation id' }, { status: 400 })
    }

    const repoResult = await db(
      `SELECT r.id, r.full_name, u.github_id 
       FROM repos r 
       JOIN users u ON u.id = r.user_id 
       WHERE r.full_name = $1 AND r.is_active = true`,
      [repoFullName]
    ) as Array<{ id: number; full_name: string; github_id: string }>

    if (repoResult.length === 0) {
      return NextResponse.json({ received: true, skipped: true })
    }

    const token = await getInstallationToken(installationId)
    if (!token) {
      console.error('Failed to get installation token')
      return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
    }

    const diff = await fetchDiff(repoFullName, baseSha, headSha, token)
    if (!diff) {
      console.error('Failed to fetch diff')
      return NextResponse.json({ error: 'Failed to fetch diff' }, { status: 500 })
    }

    const analyzeRes = await fetch(`${process.env.NEXTAUTH_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diff,
        repoFullName,
        prNumber,
        prTitle,
      }),
    })

    if (!analyzeRes.ok) {
      console.error('Analyze failed:', await analyzeRes.text())
      return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
    }

    const review = await analyzeRes.json()

    await postPRComment(repoFullName, prNumber, review.formatted, token)

    return NextResponse.json({ received: true, reviewed: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function getInstallationToken(installationId: number): Promise<string | null> {
  try {
    const appId = process.env.SOLON_APP_ID
    const privateKey = process.env.SOLON_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!appId || !privateKey) {
      console.error('Missing SOLON_APP_ID or SOLON_PRIVATE_KEY')
      return null
    }

    console.log('[debug] appId:', appId)
    console.log('[debug] installationId:', installationId)
    console.log('[debug] key length:', privateKey.length)
    console.log('[debug] key starts:', privateKey.slice(0, 27))
    console.log('[debug] key ends:', privateKey.slice(-25))

    const jwt = await createAppJWT(appId, privateKey)
    console.log('[debug] jwt created ok, length:', jwt.length)

    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Failed to get installation token — status:', res.status, 'body:', errBody)
      return null
    }

    const data = await res.json()
    return data.token
  } catch (err) {
    console.error('getInstallationToken error:', err)
    return null
  }
}

async function createAppJWT(appId: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: appId,
  }

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signingInput = `${header}.${body}`

  const { createSign } = await import('crypto')
  const sign = createSign('RSA-SHA256')
  sign.update(signingInput)
  const signature = sign.sign(privateKey, 'base64url')

  return `${signingInput}.${signature}`
}

async function fetchDiff(
  repoFullName: string,
  baseSha: string,
  headSha: string,
  token: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/compare/${baseSha}...${headSha}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      }
    )

    if (!res.ok) {
      console.error('Failed to fetch diff:', await res.text())
      return null
    }

    return await res.text()
  } catch (err) {
    console.error('fetchDiff error:', err)
    return null
  }
}

async function postPRComment(
  repoFullName: string,
  prNumber: number,
  body: string,
  token: string
): Promise<void> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      }
    )

    if (!res.ok) {
      console.error('Failed to post PR comment:', await res.text())
    }
  } catch (err) {
    console.error('postPRComment error:', err)
  }
}
