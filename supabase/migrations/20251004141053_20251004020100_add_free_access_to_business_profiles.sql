/*
  # Add free_access column to business_profiles

  1. Changes
    - Add `free_access` boolean column to business_profiles table
    - Default value is FALSE
    - This allows admins to grant free access to specific businesses

  2. Notes
    - Users with free_access = TRUE can use the app without a subscription
    - This is useful for beta users, partners, or promotional purposes
*/

-- Add free_access column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_profiles' AND column_name = 'free_access'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN free_access boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_business_profiles_free_access
ON business_profiles(free_access) WHERE free_access = true;
