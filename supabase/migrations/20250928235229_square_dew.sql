/*
  # Add Google redirect tracking to voting sessions

  1. New Columns
    - `google_redirect_clicked` (boolean) - tracks if user clicked the Google button
    - `google_redirect_attempted_at` (timestamp) - when user reached the Google redirect page

  2. Changes
    - Update existing sessions to have proper default values
    - Add index for better query performance

  3. Notes
    - This helps distinguish between users who reached the thank you page vs those who actually went to Google
    - Enables better analytics and follow-up strategies
*/

-- Add new columns to track Google redirect behavior
DO $$
BEGIN
  -- Add google_redirect_clicked column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'google_redirect_clicked'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN google_redirect_clicked boolean DEFAULT false;
  END IF;

  -- Add google_redirect_attempted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'google_redirect_attempted_at'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN google_redirect_attempted_at timestamptz;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_voting_sessions_google_redirect 
ON voting_sessions (google_redirect_clicked, google_redirect_attempted_at);

-- Update existing public sessions to have attempted_at timestamp
UPDATE voting_sessions 
SET google_redirect_attempted_at = created_at
WHERE is_public = true AND google_redirect_attempted_at IS NULL;