'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PlaybookRule {
  id: string;
  name: string;
  description: string;
  severity: 'blocking' | 'warning' | 'info';
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  rules: PlaybookRule[];
}

// Built-in playbook definitions (subset — mirrors presets.ts)
const PLAYBOOKS: Playbook[] = [
  {
    id: 'accessibility',
    name: 'Accessibility',
    description: 'WCAG-based rules for inclusive UI development.',
    rules: [
      { id: 'alt-text', name: 'Alt Text Required', description: 'All <img> elements must have descriptive alt attributes.', severity: 'blocking' },
      { id: 'aria-labels', name: 'ARIA Labels', description: 'Interactive elements must have accessible labels.', severity: 'warning' },
      { id: 'color-contrast', name: 'Color Contrast', description: 'Text must meet WCAG AA contrast ratio (4.5:1).', severity: 'warning' },
      { id: 'keyboard-nav', name: 'Keyboard Navigation', description: 'All interactive elements must be keyboard-accessible.', severity: 'blocking' },
      { id: 'semantic-html', name: 'Semantic HTML', description: 'Use appropriate semantic elements (nav, main, article).', severity: 'info' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Common security vulnerability checks.',
    rules: [
      { id: 'no-eval', name: 'No eval()', description: 'Avoid eval() — it introduces code injection risks.', severity: 'blocking' },
      { id: 'no-hardcoded-secrets', name: 'No Hardcoded Secrets', description: 'API keys, passwords must not be hardcoded.', severity: 'blocking' },
      { id: 'input-validation', name: 'Input Validation', description: 'Validate and sanitize all user inputs.', severity: 'blocking' },
      { id: 'sql-injection', name: 'SQL Injection Prevention', description: 'Use parameterized queries — no string concatenation in SQL.', severity: 'blocking' },
      { id: 'xss-prevention', name: 'XSS Prevention', description: 'Sanitize data before inserting into the DOM.', severity: 'blocking' },
    ],
  },
  {
    id: 'best_practices',
    name: 'Best Practices',
    description: 'Code quality and maintainability standards.',
    rules: [
      { id: 'error-handling', name: 'Error Handling', description: 'Async operations must have try/catch or .catch() handlers.', severity: 'warning' },
      { id: 'no-console-logs', name: 'No Console Logs', description: 'Remove debug console.log statements before merging.', severity: 'info' },
      { id: 'type-safety', name: 'Type Safety', description: 'Avoid using `any` type in TypeScript.', severity: 'warning' },
      { id: 'function-length', name: 'Function Length', description: 'Functions should be under 50 lines for maintainability.', severity: 'info' },
      { id: 'dry-principle', name: 'DRY Principle', description: 'Avoid duplicated logic — extract repeated code into functions.', severity: 'info' },
    ],
  },
];

export default function PlaybooksPage() {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const repoId = params?.repoId as string;

  const [enabledRules, setEnabledRules] = useState<Record<string, string[]>>({
    accessibility: [],
    security: [],
    best_practices: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function loadConfig() {
      try {
        const res = await fetch(`/api/repos/${repoId}/playbooks`);
        if (res.ok) {
          const data = await res.json();
          setEnabledRules(data.enabledRules ?? { accessibility: [], security: [], best_practices: [] });
        }
      } catch (err) {
        console.error('Failed to load playbook config:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [status, repoId]);

  function toggleRule(playbookId: string, ruleId: string) {
    setEnabledRules((prev) => {
      const current = prev[playbookId] ?? [];
      const updated = current.includes(ruleId)
        ? current.filter((r) => r !== ruleId)
        : [...current, ruleId];
      return { ...prev, [playbookId]: updated };
    });
    setSaved(false);
  }

  async function saveConfig() {
    setSaving(true);
    try {
      await fetch(`/api/repos/${repoId}/playbooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledRules }),
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to save playbook config:', err);
    } finally {
      setSaving(false);
    }
  }

  const severityColor: Record<string, string> = {
    blocking: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ color: '#64748b' }}>Loading playbooks...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>🛡️ Solon AI</Link>
        <Link href={`/dashboard/repos/${repoId}`} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Repo</Link>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Playbook Configuration</h1>
            <p style={{ color: '#64748b' }}>Enable rules to enforce on every PR for this repo.</p>
          </div>
          <button
            onClick={saveConfig}
            disabled={saving}
            style={{
              background: saved ? '#16a34a' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.6rem 1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'background 0.2s',
            }}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {PLAYBOOKS.map((playbook) => (
          <div
            key={playbook.id}
            style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem', overflow: 'hidden' }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{playbook.name}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{playbook.description}</p>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {playbook.rules.map((rule) => {
                const isEnabled = (enabledRules[playbook.id] ?? []).includes(rule.id);
                return (
                  <li
                    key={rule.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      padding: '1rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isEnabled ? '#f0f9ff' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                    onClick={() => toggleRule(playbook.id, rule.id)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{rule.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: severityColor[rule.severity],
                            background: `${severityColor[rule.severity]}18`,
                            padding: '0.15rem 0.4rem',
                            borderRadius: '0.25rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          {rule.severity}
                        </span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{rule.description}</div>
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        background: isEnabled ? '#2563eb' : '#cbd5e1',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                        marginLeft: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '3px',
                          left: isEnabled ? '23px' : '3px',
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}
