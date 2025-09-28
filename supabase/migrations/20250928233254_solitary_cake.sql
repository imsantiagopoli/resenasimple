/*
  # Fix RLS policies for voting sessions

  1. Security Updates
    - Drop and recreate INSERT policy for voting_sessions to ensure anonymous users can create sessions
    - Ensure the policy correctly allows anonymous insertions with proper validation
    - Add specific conditions to validate branch_id exists and is accessible

  2. Changes
    - Update the INSERT policy for voting_sessions table
    - Ensure foreign key constraints work with RLS policies
    - Allow anonymous users to insert voting sessions for any valid branch
*/

-- Drop the existing INSERT policy for voting_sessions
DROP POLICY IF EXISTS "Anonymous users can create voting sessions" ON voting_sessions;

-- Create a new INSERT policy that explicitly allows anonymous users to create voting sessions
-- with proper validation that the branch exists and is accessible
CREATE POLICY "Anonymous users can create voting sessions"
  ON voting_sessions
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Ensure the branch_id exists and is accessible to anonymous users
    branch_id IN (
      SELECT id 
      FROM business_branches 
      WHERE id = branch_id
    )
    -- Ensure rating is within valid range (this is also enforced by check constraint)
    AND rating >= 1 
    AND rating <= 5
  );

-- Also ensure authenticated users can create voting sessions (for testing purposes)
CREATE POLICY "Authenticated users can create voting sessions"
  ON voting_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    branch_id IN (
      SELECT id 
      FROM business_branches 
      WHERE id = branch_id
    )
    AND rating >= 1 
    AND rating <= 5
  );