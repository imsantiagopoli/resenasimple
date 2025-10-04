/*
  # Allow Anonymous Users to Read Voting Sessions

  ## Problem
  Anonymous users can INSERT and UPDATE voting_sessions, but they cannot SELECT.
  When using `.update().select()`, Supabase:
  1. Performs the UPDATE successfully
  2. Tries to SELECT the updated rows
  3. Fails because there's no SELECT policy for anon role
  4. Returns empty array even though update succeeded

  ## Solution
  Add a SELECT policy for anonymous users to read voting sessions.
  This allows the `.select()` call after `.update()` to work properly.

  ## Security
  This is safe because:
  - Voting sessions are public feedback from customers
  - No sensitive business information is exposed
  - Business owners already have a separate policy to read their own sessions
*/

-- Allow anonymous users to read voting sessions
-- This is needed for .update().select() to return data
CREATE POLICY "Anonymous users can read voting sessions"
  ON voting_sessions
  FOR SELECT
  TO anon
  USING (true);
