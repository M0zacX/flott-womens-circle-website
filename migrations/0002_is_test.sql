-- Flags fictitious/seeded rows so they can be told apart from real submissions and cleared safely.

ALTER TABLE submissions ADD COLUMN is_test INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_submissions_is_test ON submissions (is_test);
