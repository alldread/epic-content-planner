-- Create test table for MCP connection verification
-- Run this SQL in Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS mcp_connection_test (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE mcp_connection_test ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for service role"
  ON mcp_connection_test
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert test record
INSERT INTO mcp_connection_test (message)
VALUES ('MCP connection successful!');

-- Verify table and data
SELECT * FROM mcp_connection_test;
