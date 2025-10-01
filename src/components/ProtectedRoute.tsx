import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)

  useEffect(() => {
    const checkBusiness = async () => {
      if (!user) {
        setBusinessLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking business:', error)
        }

        setHasBusiness(!!data)
      } catch (err) {
        console.error('Error checking business:', err)
        setHasBusiness(false)
      } finally {
        setBusinessLoading(false)
      }
    }

    checkBusiness()
  }, [user])

  if (authLoading || businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (hasBusiness === false) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute