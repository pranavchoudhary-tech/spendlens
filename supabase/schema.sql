CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  tools JSONB NOT NULL,
  team_size INTEGER NOT NULL DEFAULT 1,
  use_case TEXT NOT NULL DEFAULT 'mixed',
  recommendations JSONB NOT NULL DEFAULT '[]',
  total_monthly_savings NUMERIC NOT NULL DEFAULT 0,
  total_annual_savings NUMERIC NOT NULL DEFAULT 0,
  ai_summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id TEXT REFERENCES audits(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  high_savings BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audits_public_read" ON audits FOR SELECT USING (true);
CREATE POLICY "audits_service_insert" ON audits FOR INSERT WITH CHECK (true);

CREATE POLICY "leads_service_insert" ON leads FOR INSERT WITH CHECK (true);
