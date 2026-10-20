-- The Grand Table 2026 backend: submissions + editable content

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  form TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'accepted', 'declined', 'archived')),
  data TEXT NOT NULL,
  email TEXT,
  name TEXT,
  file_key TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_form ON submissions (form);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at);

CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT
);
