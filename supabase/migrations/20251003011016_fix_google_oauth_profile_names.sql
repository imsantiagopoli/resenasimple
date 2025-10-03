/*
  # Fix Google OAuth profile name handling

  1. Changes
    - Update handle_new_user() function to extract first_name and last_name from Google OAuth data
    - Google provides full_name, so we split it into first and last names
    - Falls back to existing metadata if already provided

  2. Security
    - Maintains existing RLS policies
*/

-- Update function to handle Google OAuth user data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_full_name text;
BEGIN
  -- Try to get first_name and last_name from metadata (email/password signup)
  v_first_name := new.raw_user_meta_data->>'first_name';
  v_last_name := new.raw_user_meta_data->>'last_name';
  
  -- If not provided, try to extract from full_name (Google OAuth)
  IF v_first_name IS NULL OR v_last_name IS NULL THEN
    v_full_name := new.raw_user_meta_data->>'full_name';
    
    IF v_full_name IS NOT NULL THEN
      -- Split full_name into first and last name
      -- Assumes format: "FirstName LastName" or "FirstName MiddleName LastName"
      v_first_name := split_part(v_full_name, ' ', 1);
      
      -- Get everything after the first space as last name
      v_last_name := trim(substring(v_full_name from position(' ' in v_full_name)));
      
      -- If no space found, use full_name as first_name
      IF v_last_name = '' THEN
        v_last_name := NULL;
      END IF;
    END IF;
  END IF;
  
  -- Insert profile with extracted names
  INSERT INTO public.profiles (id, first_name, last_name, email, avatar_url)
  VALUES (
    new.id,
    v_first_name,
    v_last_name,
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;