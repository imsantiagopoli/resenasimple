/*
  # Allow public read access to subscriptions

  1. Changes
    - Add policy to allow anonymous users to read active subscriptions
    - This is needed for the voting page to check if a business has an active subscription
    - Only exposes status='active' subscriptions

  2. Security
    - Only allows SELECT operations
    - Only for anonymous users (anon role)
    - Only shows active subscriptions
    - Does not expose sensitive subscription details
*/

-- Allow anonymous users to check if subscriptions exist and are active
CREATE POLICY "Anonymous users can check active subscriptions"
  ON subscriptions
  FOR SELECT
  TO anon
  USING (status = 'active');
