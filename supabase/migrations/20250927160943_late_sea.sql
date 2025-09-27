/*
  # Create business profiles and related tables

  1. New Tables
    - `business_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text, restaurant name)
      - `description` (text, optional)
      - `phone` (text, optional)
      - `email` (text, optional)
      - `website` (text, optional)
      - `logo_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `business_branches`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references business_profiles)
      - `name` (text)
      - `address` (text)
      - `phone` (text, optional)
      - `google_maps_link` (text, optional)
      - `slug` (text, unique for voting URLs)
      - `is_main` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `business_social_media`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references business_profiles)
      - `platform` (text, e.g. 'facebook', 'instagram')
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for business owners to manage their data
    - Add policies for reading public business data
*/

-- Create business_profiles table
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  phone text,
  email text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_branches table
CREATE TABLE IF NOT EXISTS public.business_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text,
  phone text,
  google_maps_link text,
  slug text UNIQUE NOT NULL,
  is_main boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_social_media table
CREATE TABLE IF NOT EXISTS public.business_social_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, platform)
);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_social_media ENABLE ROW LEVEL SECURITY;

-- Business Profiles Policies
CREATE POLICY "Users can read own business profiles"
  ON business_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own business profiles"
  ON business_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own business profiles"
  ON business_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own business profiles"
  ON business_profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Business Branches Policies
CREATE POLICY "Users can read own business branches"
  ON business_branches
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create branches for own businesses"
  ON business_branches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own business branches"
  ON business_branches
  FOR UPDATE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own business branches"
  ON business_branches
  FOR DELETE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Allow anonymous users to read branches for voting (by slug)
CREATE POLICY "Anonymous users can read branches by slug"
  ON business_branches
  FOR SELECT
  TO anon
  USING (true);

-- Business Social Media Policies
CREATE POLICY "Users can manage own business social media"
  ON business_social_media
  FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Allow anonymous users to read social media for voting pages
CREATE POLICY "Anonymous users can read business social media"
  ON business_social_media
  FOR SELECT
  TO anon
  USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_branches_updated_at
  BEFORE UPDATE ON business_branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_branch_slug(business_name text, branch_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Create base slug from business and branch name
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        unaccent(business_name || '-' || branch_name),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
  
  final_slug := base_slug;
  
  -- Check if slug exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM business_branches WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;