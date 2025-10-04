/*
  # Enable Realtime for voting_sessions table

  1. Changes
    - Enable realtime replication for voting_sessions table
    - This allows clients to subscribe to changes in real-time

  2. Note
    - Realtime respects Row Level Security (RLS) policies
    - Only users with proper permissions will receive updates
*/

-- Enable realtime for voting_sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE voting_sessions;