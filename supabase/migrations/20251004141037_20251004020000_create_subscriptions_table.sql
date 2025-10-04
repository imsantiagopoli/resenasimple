/*
  # Create Subscriptions Table for Lemon Squeezy

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `business_id` (uuid, foreign key to business_profiles)
      - `lemon_squeezy_subscription_id` (text, unique) - ID from Lemon Squeezy
      - `lemon_squeezy_customer_id` (text) - Customer ID from Lemon Squeezy
      - `lemon_squeezy_order_id` (text) - Order ID from Lemon Squeezy
      - `lemon_squeezy_product_id` (text) - Product ID from Lemon Squeezy
      - `lemon_squeezy_variant_id` (text) - Variant ID from Lemon Squeezy
      - `plan_name` (text) - Plan name: basico, profesional, empresarial
      - `status` (text) - Subscription status: active, cancelled, expired, past_due
      - `current_period_start` (timestamptz) - Start of current billing period
      - `current_period_end` (timestamptz) - End of current billing period
      - `cancel_at_period_end` (boolean) - Whether subscription cancels at end of period
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `subscriptions` table
    - Users can read their own subscriptions
    - Only service role can insert/update/delete (via Edge Function)

  3. Indexes
    - Index on user_id for fast lookups
    - Index on business_id for filtering by business
    - Unique index on lemon_squeezy_subscription_id
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  lemon_squeezy_subscription_id text UNIQUE NOT NULL,
  lemon_squeezy_customer_id text,
  lemon_squeezy_order_id text,
  lemon_squeezy_product_id text,
  lemon_squeezy_variant_id text,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_plan_name_check
CHECK (plan_name IN ('basico', 'profesional', 'empresarial'));

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_status_check
CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'on_trial'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id
ON subscriptions(business_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
ON subscriptions(status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_lemon_squeezy_id
ON subscriptions(lemon_squeezy_subscription_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role can insert subscriptions"
  ON subscriptions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
  ON subscriptions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete subscriptions"
  ON subscriptions
  FOR DELETE
  TO service_role
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
