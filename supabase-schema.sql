-- ============================================================
-- DailfOrAI - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Agent Runs Table (tracks every agent execution)
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL CHECK (agent_type IN ('recruitment', 'sales', 'prospect')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  input_data JSONB DEFAULT '{}',
  output_data JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prospects Table (all found/extracted profiles)
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  company TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  summary TEXT,
  source_type TEXT DEFAULT 'other',
  profile_url TEXT UNIQUE,
  work_history JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  agent_run_id UUID REFERENCES agent_runs(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','interested','not_interested','converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Outreach Table (generated emails)
CREATE TABLE IF NOT EXISTS sales_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospects(id),
  prospect_name TEXT,
  prospect_company TEXT,
  subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  purpose TEXT,
  agent_run_id UUID REFERENCES agent_runs(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','opened','replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_runs_type ON agent_runs(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_created ON prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales_outreach(status);

-- Enable Row Level Security (open for now - add auth later)
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_outreach ENABLE ROW LEVEL SECURITY;

-- Allow all operations (open access - add auth when needed)
CREATE POLICY "Allow all" ON agent_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON prospects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sales_outreach FOR ALL USING (true) WITH CHECK (true);
