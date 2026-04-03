import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

// GET /api/repos — return connected repos for the current user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const listGithub = url.searchParams.get('list') === 'github';

  try {
    // Get the internal user record
    const userResult = await db(
      'SELECT id FROM users WHERE github_id = $1',
      [session.user.githubId]
    ) as Array<Record<string, unknown>>;


    if (userResult.length === 0) {
      return NextResponse.json({ repos: [], githubRepos: [] });
    }

    const userId = (userResult[0] as { id: number }).id;

    // Return connected repos from our DB
    const repos = await db(
      'SELECT id, github_repo_id, name, full_name, is_active FROM repos WHERE user_id = $1 AND is_active = true ORDER BY name',
      [userId]
    );

    if (listGithub) {
      // The session type is augmented by next-auth.d.ts
      const accessToken = session.user.accessToken;
      if (!accessToken) {
        return NextResponse.json({ repos, githubRepos: [] })
      }

      // Fetch all repos from GitHub (up to 100)
      const githubRes = await fetch(
        'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )

      if (!githubRes.ok) {
        return NextResponse.json({ repos, githubRepos: [] })
      }

      const githubRepos = await githubRes.json()
      
      // Removed the 'any' type here and replaced it with an inline interface
      const simplified = githubRepos.map((r: { id: number | string; name: string; full_name: string; private: boolean }) => ({
        github_repo_id: String(r.id),
        name: r.name,
        full_name: r.full_name,
        private: r.private,
      }))

      return NextResponse.json({ repos, githubRepos: simplified })
    }

    return NextResponse.json({ repos });
  } catch (err) {
    console.error('GET /api/repos error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST /api/repos — connect or disconnect a repo
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { github_repo_id, name, full_name, connect } = body;

  if (!github_repo_id || !name || !full_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userResult = await db(
      'SELECT id FROM users WHERE github_id = $1',
      [session.user.githubId]
    ) as Array<Record<string, unknown>>;


    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (userResult[0] as { id: number }).id;

    const accessToken = (session as { user?: { accessToken?: string } })?.user?.accessToken

    if (connect) {
      // Get the GitHub App installation ID for this repo
      const installationId = await getInstallationId(full_name, accessToken || '')

      await db(
        `INSERT INTO repos (user_id, github_repo_id, name, full_name, is_active, installation_id)
         VALUES ($1, $2, $3, $4, true, $5)
         ON CONFLICT (user_id, github_repo_id)
         DO UPDATE SET is_active = true, name = EXCLUDED.name, full_name = EXCLUDED.full_name, installation_id = EXCLUDED.installation_id`,
        [userId, github_repo_id, name, full_name, installationId]
      );
    } else {
      await db(
        'UPDATE repos SET is_active = false WHERE user_id = $1 AND github_repo_id = $2',
        [userId, github_repo_id]
      );
      // No webhook to remove — we use the GitHub App webhook
    }

    const repos = await db(
      'SELECT id, github_repo_id, name, full_name, is_active FROM repos WHERE user_id = $1 AND is_active = true ORDER BY name',
      [userId]
    );

    return NextResponse.json({ repos });
  } catch (err) {
    console.error('POST /api/repos error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Get the GitHub App installation ID for a repo using App JWT
async function getInstallationId(
  repoFullName: string,
  _accessToken: string
): Promise<number | null> {
  try {
    const appId = process.env.SOLON_APP_ID
    const rawKey = process.env.SOLON_PRIVATE_KEY
    if (!appId || !rawKey) return null

    const privateKey = rawKey.replace(/\\n/g, '\n')
    const { createSign } = await import('crypto')
    const now = Math.floor(Date.now() / 1000)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId })).toString('base64url')
    const signingInput = `${header}.${payload}`
    const sign = createSign('RSA-SHA256')
    sign.update(signingInput)
    const signature = sign.sign(privateKey, 'base64url')
    const jwt = `${signingInput}.${signature}`

    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/installation`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    if (!res.ok) {
      console.error('Failed to get installation ID:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    return data.id ?? null
  } catch (err) {
    console.error('getInstallationId error:', err)
    return null
  }
}

// Remove a webhook from a GitHub repo when user disconnects it
async function removeWebhook(
  repoFullName: string,
  accessToken: string
): Promise<void> {
  try {
    // Find existing Solon webhook
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhook`

    const listRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/hooks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!listRes.ok) return

    const hooks = await listRes.json()
    const solonHook = hooks.find((h: { config?: { url?: string }; id?: number }) => h.config?.url === webhookUrl)

    if (!solonHook) return

    await fetch(
      `https://api.github.com/repos/${repoFullName}/hooks/${solonHook.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
  } catch (err) {
    console.error('removeWebhook error:', err)
  }
}
