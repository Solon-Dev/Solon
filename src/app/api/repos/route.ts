import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
      // Proxy GitHub API to get user repos using their stored token
      // (requires access token stored in session — advanced; return empty for now)
      return NextResponse.json({ repos, githubRepos: [] });
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
    // Get the internal user record
    const userResult = await db(
      'SELECT id FROM users WHERE github_id = $1',
      [session.user.githubId]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (userResult[0] as { id: number }).id;

    if (connect) {
      // Insert or re-activate repo
      await db(
        `INSERT INTO repos (user_id, github_repo_id, name, full_name, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (user_id, github_repo_id)
         DO UPDATE SET is_active = true, name = EXCLUDED.name, full_name = EXCLUDED.full_name`,
        [userId, github_repo_id, name, full_name]
      );
    } else {
      // Deactivate repo (soft delete)
      await db(
        'UPDATE repos SET is_active = false WHERE user_id = $1 AND github_repo_id = $2',
        [userId, github_repo_id]
      );
    }

    // Return updated repos list
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
