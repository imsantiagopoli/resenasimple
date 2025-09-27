/*
  # Create voting and reviews tables

  1. New Tables
    - `voting_sessions`
      - `id` (uuid, primary key)
      - `branch_id` (uuid, references business_branches)
      - `customer_name` (text, optional)
      - `customer_email` (text, optional)
      - `customer_phone` (text, optional)
      - `rating` (integer, 1-5)
      - `comment` (text, optional)
      - `is_public` (boolean, whether it was sent to Google)
      - `ip_address` (inet, for tracking)
      - `user_agent` (text, for analytics)
      - `created_at` (timestamp)

    - `voting_configs`
      - `id` (uuid, primary key)
      - `branch_id` (uuid, references business_branches)
      - `threshold` (integer, minimum stars for public reviews)
      - `config_json` (jsonb, stores all configuration)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for business owners to see their data
    - Allow anonymous users to create voting sessions
*/

-- Create voting_sessions table
CREATE TABLE IF NOT EXISTS public.voting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES public.business_branches(id) ON DELETE CASCADE NOT NULL,
  customer_name text,
  customer_email text,
  customer_phone text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_public boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create voting_configs table
CREATE TABLE IF NOT EXISTS public.voting_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES public.business_branches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  threshold integer DEFAULT 4 CHECK (threshold >= 1 AND threshold <= 5),
  config_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE voting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_configs ENABLE ROW LEVEL SECURITY;

-- Voting Sessions Policies
CREATE POLICY "Business owners can read their voting sessions"
  ON voting_sessions
  FOR SELECT
  TO authenticated
  USING (
    branch_id IN (
      SELECT b.id 
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- Allow anonymous users to create voting sessions
CREATE POLICY "Anonymous users can create voting sessions"
  ON voting_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Voting Configs Policies
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

-- Allow anonymous users to read voting configs for voting pages
CREATE POLICY "Anonymous users can read voting configs"
  ON voting_configs
  FOR SELECT
  TO anon
  USING (true);

-- Create updated_at trigger for voting_configs
CREATE TRIGGER update_voting_configs_updated_at
  BEFORE UPDATE ON voting_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voting_sessions_branch_id ON voting_sessions(branch_id);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_created_at ON voting_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_rating ON voting_sessions(rating);
CREATE INDEX IF NOT EXISTS idx_business_branches_slug ON business_branches(slug);
CREATE INDEX IF NOT EXISTS idx_business_branches_business_id ON business_branches(business_id);