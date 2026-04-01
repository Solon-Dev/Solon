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
    );

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
    );

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (userResult[0] as { id: number }).id;

    if (connect) {
      await db(
        `INSERT INTO repos (user_id, github_repo_id, name, full_name, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (user_id, github_repo_id)
         DO UPDATE SET is_active = true, name = EXCLUDED.name, full_name = EXCLUDED.full_name`,
        [userId, github_repo_id, name, full_name]
      );
    } else {
      await db(
        'UPDATE repos SET is_active = false WHERE user_id = $1 AND github_repo_id = $2',
        [userId, github_repo_id]
      );
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
