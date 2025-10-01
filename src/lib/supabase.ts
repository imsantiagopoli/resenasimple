import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth types
export type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export type AuthSession = {
  access_token: string
  refresh_token: string
  user: AuthUser
}

// Branch slug validation
export const checkSlugAvailability = async (slug: string, excludeBranchId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('business_branches')
      .select('id')
      .eq('slug', slug);

    if (excludeBranchId) {
      query = query.neq('id', excludeBranchId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }

    return !data;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
}