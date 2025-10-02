/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key) - Unique customer identifier
      - `business_id` (uuid, foreign key) - Reference to business_profiles
      - `first_name` (text) - Customer first name
      - `last_name` (text) - Customer last name
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `notes` (text, nullable) - Additional notes about the customer
      - `created_at` (timestamptz) - When the customer was created
      - `updated_at` (timestamptz) - When the customer was last updated

  2. Security
    - Enable RLS on `customers` table
    - Add policy for business owners to manage their customers
    - Add policy for authenticated users to read customers from their business

  3. Indexes
    - Index on business_id for faster queries
    - Index on email for search functionality
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Business owners can view their customers
CREATE POLICY "Business owners can view their customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Business owners can insert their customers
CREATE POLICY "Business owners can insert their customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Policy: Business owners can update their customers
CREATE POLICY "Business owners can update their customers"
  ON customers
  FOR UPDATE
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

-- Policy: Business owners can delete their customers
CREATE POLICY "Business owners can delete their customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_updated_at ON customers(updated_at DESC);