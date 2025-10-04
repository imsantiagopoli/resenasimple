/*
  # Add Status Tracking to Voting Sessions

  1. Changes to voting_sessions table
    - Add `status` column (text) to track the state of each voting session:
      - 'positive_viewed': User gave 4-5 stars and saw Google redirect page
      - 'positive_clicked': User gave 4-5 stars and clicked button to go to Google
      - 'negative_incomplete': User gave 1-3 stars but didn't complete feedback form
      - 'negative_complete': User gave 1-3 stars and submitted feedback form
    - Add `google_redirect_clicked_at` (timestamptz) to track when user clicked Google button
    - Add `form_submitted_at` (timestamptz) to track when feedback form was submitted
    - Add `form_completed` (boolean) to easily filter complete vs incomplete responses

  2. Migration Strategy
    - Add new columns with safe defaults
    - Update existing records based on current data
    - Maintain backward compatibility

  3. Indexing
    - Add index on status column for filtering
    - Add index on form_completed for analytics
*/

-- Add new columns to voting_sessions table
DO $$
BEGIN
  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'status'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN status text DEFAULT 'positive_viewed';
  END IF;

  -- Add google_redirect_clicked_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'google_redirect_clicked_at'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN google_redirect_clicked_at timestamptz;
  END IF;

  -- Add form_submitted_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'form_submitted_at'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN form_submitted_at timestamptz;
  END IF;

  -- Add form_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_sessions' AND column_name = 'form_completed'
  ) THEN
    ALTER TABLE voting_sessions ADD COLUMN form_completed boolean DEFAULT false;
  END IF;
END $$;

-- Update existing records to have appropriate status based on their current data
UPDATE voting_sessions
SET 
  status = CASE
    WHEN rating >= 4 THEN 'positive_viewed'
    WHEN rating <= 3 AND (customer_name IS NOT NULL OR customer_email IS NOT NULL OR comment IS NOT NULL) THEN 'negative_complete'
    ELSE 'negative_incomplete'
  END,
  form_completed = (rating <= 3 AND (customer_name IS NOT NULL OR customer_email IS NOT NULL OR comment IS NOT NULL)),
  form_submitted_at = CASE
    WHEN rating <= 3 AND (customer_name IS NOT NULL OR customer_email IS NOT NULL OR comment IS NOT NULL) THEN created_at
    ELSE NULL
  END
WHERE status IS NULL OR status = 'positive_viewed';

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'voting_sessions_status_check'
  ) THEN
    ALTER TABLE voting_sessions
    ADD CONSTRAINT voting_sessions_status_check
    CHECK (status IN ('positive_viewed', 'positive_clicked', 'negative_incomplete', 'negative_complete'));
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_voting_sessions_status ON voting_sessions(status);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_form_completed ON voting_sessions(form_completed);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_google_clicked ON voting_sessions(google_redirect_clicked_at) WHERE google_redirect_clicked_at IS NOT NULL;