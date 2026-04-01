import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

interface RouteContext {
  params: Promise<{ repoId: string }>;
}

// GET /api/repos/[repoId]/playbooks — return current playbook config
export async function GET(_req: Request, context: RouteContext) {
  const { repoId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const owned = await db(
    `SELECT r.id FROM repos r JOIN users u ON u.id = r.user_id
     WHERE r.id = $1 AND u.github_id = $2`,
    [repoId, session.user.githubId]
  ) as Array<Record<string, unknown>>;


  if (owned.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const configs = await db(
    'SELECT playbook_id, enabled_rules FROM playbook_configs WHERE repo_id = $1',
    [repoId]
  ) as { playbook_id: string; enabled_rules: string[] }[];

  const enabledRules: Record<string, string[]> = {
    accessibility: [],
    security: [],
    best_practices: [],
  };

  for (const config of configs) {
    enabledRules[config.playbook_id] = Array.isArray(config.enabled_rules)
      ? config.enabled_rules
      : [];
  }

  return NextResponse.json({ enabledRules });
}

// POST /api/repos/[repoId]/playbooks — save playbook config
export async function POST(req: Request, context: RouteContext) {
  const { repoId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const owned = await db(
    `SELECT r.id FROM repos r JOIN users u ON u.id = r.user_id
     WHERE r.id = $1 AND u.github_id = $2`,
    [repoId, session.user.githubId]
  ) as Array<Record<string, unknown>>;


  if (owned.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const { enabledRules } = body as { enabledRules: Record<string, string[]> };

  for (const [playbookId, rules] of Object.entries(enabledRules)) {
    await db(
      `INSERT INTO playbook_configs (repo_id, playbook_id, enabled_rules, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (repo_id, playbook_id)
       DO UPDATE SET enabled_rules = EXCLUDED.enabled_rules, updated_at = NOW()`,
      [repoId, playbookId, JSON.stringify(rules)]
    );
  }

  return NextResponse.json({ success: true });
}
