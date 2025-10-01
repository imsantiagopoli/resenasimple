import { useState, useEffect } from 'react'
import { supabase, type AuthUser, type AuthSession } from '../lib/supabase'
import type { AuthError, Session } from '@supabase/supabase-js'
import { createBusinessAndBranch } from '../lib/businessSetup'

interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
}


export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    restaurantName: string,
    businessType: string
  ) => {
    try {
      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
          }
        }
      })

      if (authError) {
        return { data: null, error: authError }
      }

      // If user was created successfully and is confirmed (or email confirmation is disabled)
      if (authData.user) {
        try {
          await createBusinessAndBranch(
            authData.user.id,
            restaurantName,
            businessType
          )
        } catch (businessError: any) {
          console.error('Error creating business and branch:', businessError)
          return { data: authData, error: businessError }
        }
      }

      return { data: authData, error: null }
    } catch (err: any) {
      console.error('Registration error:', err)
      return { data: null, error: err }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        scopes: 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.email',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    return { data, error }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`
    })
    return { data, error }
  }

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  }
}