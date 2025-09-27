/*
  # Fix voting_configs table to properly reference branches

  1. Updates
    - Fix the branch_id foreign key to reference business_branches.id instead of slug
    - Add proper constraint and index
*/

-- Drop the existing voting_configs table and recreate with proper foreign key
DROP TABLE IF EXISTS voting_configs;

CREATE TABLE voting_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES business_branches(id) ON DELETE CASCADE,
  threshold integer DEFAULT 4 CHECK (threshold >= 1 AND threshold <= 5),
  config_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(branch_id)
);

-- Enable RLS
ALTER TABLE voting_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anonymous users can read voting configs"
  ON voting_configs
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Business owners can manage their voting configs"
  ON voting_configs
  FOR ALL
  TO authenticated
  USING (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_voting_configs_updated_at
  BEFORE UPDATE ON voting_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_voting_configs_branch_id ON voting_configs(branch_id);