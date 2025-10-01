import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { useData } from '../contexts/DataContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const { businessProfile, businessLoading } = useData()
  const location = useLocation()

  // If we're checking auth or business data, show loading
  if (authLoading || businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // If on onboarding page, allow access
  if (location.pathname === '/onboarding') {
    return <>{children}</>
  }

  // If no business profile exists, redirect to onboarding
  if (!businessProfile) {
    return <Navigate to="/onboarding" replace />
  }

  // User is authenticated and has business profile
  return <>{children}</>
}

export default ProtectedRoute