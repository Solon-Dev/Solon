-- Solon AI — Neon Postgres Schema
-- Run this in your Neon dashboard SQL editor

-- Users (GitHub OAuth)
CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  github_id           TEXT UNIQUE NOT NULL,
  email               TEXT,
  name                TEXT,
  avatar_url          TEXT,
  stripe_customer_id  TEXT,
  subscription_status TEXT DEFAULT 'free',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Connected GitHub repos
CREATE TABLE IF NOT EXISTS repos (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  github_repo_id  TEXT NOT NULL,
  name            TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, github_repo_id)
);

-- Per-repo playbook configuration
CREATE TABLE IF NOT EXISTS playbook_configs (
  id           SERIAL PRIMARY KEY,
  repo_id      INTEGER REFERENCES repos(id) ON DELETE CASCADE,
  playbook_id  TEXT NOT NULL, -- 'accessibility' | 'security' | 'best_practices'
  enabled_rules JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(repo_id, playbook_id)
);

-- PR review results
CREATE TABLE IF NOT EXISTS reviews (
  id               SERIAL PRIMARY KEY,
  repo_id          INTEGER REFERENCES repos(id) ON DELETE CASCADE,
  pr_number        INTEGER NOT NULL,
  pr_title         TEXT,
  summary          TEXT,
  playbook_results JSONB,
  edge_cases       JSONB,
  unit_tests       TEXT,
  status           TEXT DEFAULT 'pending', -- 'pass' | 'fail' | 'warning' | 'pending'
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_repos_user_id ON repos(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_repo_id ON reviews(repo_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playbook_configs_repo_id ON playbook_configs(repo_id);
