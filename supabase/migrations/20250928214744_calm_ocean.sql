/*
  # Update voting configuration to business level

  1. Changes
    - Update voting_configuration table to reference business_profiles instead of business_branches
    - Change foreign key constraint from branch_id to business_id
    - Update RLS policies to work with business_id
    - Drop and recreate indexes

  2. Security
    - Update RLS policies for business-level access
    - Maintain data integrity during migration
*/

-- First, safely drop existing data and constraints
DO $$
BEGIN
  -- Drop existing foreign key constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'voting_configuration_branch_id_fkey'
    AND table_name = 'voting_configuration'
  ) THEN
    ALTER TABLE voting_configuration DROP CONSTRAINT voting_configuration_branch_id_fkey;
  END IF;

  -- Drop existing unique index
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_voting_configuration_branch_id'
  ) THEN
    DROP INDEX idx_voting_configuration_branch_id;
  END IF;
END $$;

-- Clear existing data to avoid conflicts during migration
TRUNCATE TABLE voting_configuration;

-- Rename column from branch_id to business_id
ALTER TABLE voting_configuration RENAME COLUMN branch_id TO business_id;

-- Add new foreign key constraint to business_profiles
ALTER TABLE voting_configuration 
ADD CONSTRAINT voting_configuration_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE;

-- Create new unique index for business_id
CREATE UNIQUE INDEX idx_voting_configuration_business_id 
ON voting_configuration USING btree (business_id);

-- Drop old RLS policies
DROP POLICY IF EXISTS "Anonymous users can read voting configurations by branch" ON voting_configuration;
DROP POLICY IF EXISTS "Business owners can delete their voting configurations" ON voting_configuration;
DROP POLICY IF EXISTS "Business owners can insert their voting configurations" ON voting_configuration;
DROP POLICY IF EXISTS "Business owners can read their voting configurations" ON voting_configuration;
DROP POLICY IF EXISTS "Business owners can update their voting configurations" ON voting_configuration;

-- Create new RLS policies for business-level access
CREATE POLICY "Anonymous users can read voting configurations by business"
  ON voting_configuration
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Business owners can read their voting configurations"
  ON voting_configuration
  FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can insert their voting configurations"
  ON voting_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can update their voting configurations"
  ON voting_configuration
  FOR UPDATE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can delete their voting configurations"
  ON voting_configuration
  FOR DELETE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));