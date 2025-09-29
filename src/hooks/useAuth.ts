import { useState, useEffect } from 'react'
import { supabase, type AuthUser, type AuthSession } from '../lib/supabase'
import type { AuthError, Session } from '@supabase/supabase-js'

interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
}

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Helper function for backwards compatibility
const generateSlugSync = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

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
        // Step 2: Create business profile
        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles')
          .insert([
            {
              user_id: authData.user.id,
              name: restaurantName,
              description: `Auténtico ${businessType.toLowerCase()} con los mejores sabores.`,
            }
          ])
          .select()
          .single()

        if (businessError) {
          console.error('Error creating business profile:', businessError)
          return { data: authData, error: businessError }
        }

        // Step 3: Create main branch
        const branchName = `${restaurantName}`
        const branchSlug = generateSlugSync(restaurantName) + '-' + Date.now().toString().slice(-6)

        const { error: branchError } = await supabase
          .from('business_branches')
          .insert([
            {
              business_id: businessData.id,
              name: branchName,
              slug: branchSlug,
              is_main: true,
              address: '', // Empty for now, user can fill later
              phone: '',   // Empty for now, user can fill later
              google_maps_link: ''
            }
          ])

        if (branchError) {
          console.error('Error creating main branch:', branchError)
          return { data: authData, error: branchError }
        }

        // Step 4: Create default voting config for the branch
        // Get the created branch ID to create voting config
        const { data: branchData, error: branchSelectError } = await supabase
          .from('business_branches')
          .select('id')
          .eq('business_id', businessData.id)
          .eq('is_main', true)
          .single()

        if (!branchSelectError && branchData) {
          // Step 4: Create default voting config for the branch
          const { error: configError } = await supabase
            .from('voting_configs')
            .insert([
              {
                branch_id: branchData.id,
                threshold: 4,
                config_json: {
                  design: {
                    message: {
                      headline: 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
                      body: 'Tómate un momento para compartir tu experiencia con nosotros.'
                    },
                    showLogo: true,
                    starLabels: {
                      enabled: true,
                      labels: {
                        1: 'Muy malo',
                        2: 'Regular',
                        3: 'Aceptable', 
                        4: 'Bueno',
                        5: 'Excelente'
                      }
                    }
                  },
                  logic: {
                    threshold: 4,
                    publicWorkflow: {
                      thankYouMessage: 'Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.',
                      buttonText: 'Califícanos en Google'
                    },
                    privateWorkflow: {
                      feedbackMessage: 'Tu opinión es muy valiosa. Por favor, contanos cómo podemos mejorar.',
                      thankYouMessage: 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
                      collectEmail: true,
                      emailRequired: false,
                      collectName: false,
                      nameRequired: false,
                      collectPhone: false,
                      phoneRequired: false
                    }
                  }
                }
              }
            ])

          if (configError) {
            console.error('Error creating voting config:', configError)
            // Don't return error here as it's not critical for account creation
          }
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
        redirectTo: `${window.location.origin}/app/inicio`
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