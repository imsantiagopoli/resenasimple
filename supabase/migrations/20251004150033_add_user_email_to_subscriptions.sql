/*
  # Add user_email column to subscriptions table

  1. Changes
    - Add `user_email` column to `subscriptions` table
      - Stores the email address of the user for fallback subscription lookups
      - Used when business_id lookup fails, we can search by email
    
  2. Migration Details
    - Column is nullable to maintain compatibility with existing records
    - Add index on user_email for fast lookups by email
*/

-- Add user_email column to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN user_email text;
  END IF;
END $$;

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email
ON subscriptions(user_email);
