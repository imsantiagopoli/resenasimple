import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [checkingBusiness, setCheckingBusiness] = useState(true)
  const [hasBusiness, setHasBusiness] = useState(false)

  useEffect(() => {
    const checkBusinessProfile = async () => {
      if (!user) {
        setCheckingBusiness(false)
        return
      }

      if (location.pathname === '/onboarding') {
        setCheckingBusiness(false)
        setHasBusiness(true)
        return
      }

      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error checking business profile:', error)
          setHasBusiness(false)
        } else {
          setHasBusiness(!!data)
        }
      } catch (error) {
        console.error('Error in checkBusinessProfile:', error)
        setHasBusiness(false)
      } finally {
        setCheckingBusiness(false)
      }
    }

    checkBusinessProfile()
  }, [user, location.pathname])

  if (authLoading || checkingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (!hasBusiness && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute