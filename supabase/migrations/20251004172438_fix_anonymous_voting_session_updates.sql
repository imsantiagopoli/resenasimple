/*
  # Fix Anonymous Voting Session Updates

  ## Problem
  The current RLS policy for anonymous users updating voting_sessions is too restrictive.
  Even though USING and WITH CHECK are set to true, anonymous users cannot update rows
  because they need explicit permission to identify which rows they can update.

  ## Solution
  Drop and recreate the UPDATE policy with proper permissions that allow:
  1. Anonymous users to update ANY voting session (needed for public voting pages)
  2. Allow updates to all status fields and customer information
  
  ## Changes
  - Drop existing anonymous update policy
  - Create new policy that explicitly allows anonymous updates without restrictions
  - This is safe because:
    * Voting sessions are public-facing user feedback
    * No sensitive business data in voting_sessions
    * Business owners can only READ their own sessions via separate policy
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anonymous users can update voting sessions" ON voting_sessions;

-- Create new permissive policy for anonymous updates
-- This allows the voting page to update sessions as users progress through the flow
CREATE POLICY "Allow anonymous users to update any voting session"
  ON voting_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
