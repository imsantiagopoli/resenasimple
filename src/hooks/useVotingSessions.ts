import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useBusiness } from './useBusiness'

export interface VotingSession {
  id: string
  branch_id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  rating: number
  comment: string | null
  is_public: boolean
  google_redirect_clicked: boolean | null
  google_redirect_attempted_at: string | null
  created_at: string
  // Joined data
  branch_name?: string
  branch_slug?: string
}

interface VotingSessionsState {
  sessions: VotingSession[]
  loading: boolean
  error: string | null
  loaded: boolean
}

export const useVotingSessions = () => {
  const { user } = useAuth()
  const { profile, branches } = useBusiness()
  const [sessionsState, setSessionsState] = useState<VotingSessionsState>({
    sessions: [],
    loading: true,
    error: null,
    loaded: false
  })

  // Fetch voting sessions for all user's branches
  const fetchVotingSessions = async () => {
    if (!user || !profile || branches.length === 0) {
      setSessionsState(prev => ({ ...prev, loading: false, loaded: true }))
      return
    }

    try {
      setSessionsState(prev => ({ ...prev, loading: true, error: null }))

      // Get all branch IDs for this business
      const branchIds = branches.map(branch => branch.id)

      // Fetch voting sessions for all branches
      const { data: sessions, error } = await supabase
        .from('voting_sessions')
        .select(`
          *,
          business_branches!inner(
            name,
            slug
          )
        `)
        .in('branch_id', branchIds)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Map sessions with branch data
      const mappedSessions: VotingSession[] = (sessions || []).map(session => ({
        id: session.id,
        branch_id: session.branch_id,
        customer_name: session.customer_name,
        customer_email: session.customer_email,
        customer_phone: session.customer_phone,
        rating: session.rating,
        comment: session.comment,
        is_public: session.is_public,
        created_at: session.created_at,
        branch_name: session.business_branches?.name,
        branch_slug: session.business_branches?.slug
      }))

      setSessionsState({
        sessions: mappedSessions,
        loading: false,
        error: null,
        loaded: true
      })

    } catch (err: any) {
      console.error('Error fetching voting sessions:', err)
      setSessionsState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Error al cargar las reseñas',
        loaded: true
      }))
    }
  }

  // Get statistics from sessions
  const getStatistics = () => {
    const totalSessions = sessionsState.sessions.length
    const publicSessions = sessionsState.sessions.filter(s => s.is_public).length
    const privateSessions = sessionsState.sessions.filter(s => !s.is_public).length
    
    const averageRating = totalSessions > 0 
      ? (sessionsState.sessions.reduce((sum, s) => sum + s.rating, 0) / totalSessions).toFixed(1)
      : '0.0'
    
    // Calcular tasa de reseñas positivas (4 o 5 estrellas)
    const positiveReviews = sessionsState.sessions.filter(s => s.rating >= 4).length
    const positiveReviewsRate = totalSessions > 0 
      ? ((positiveReviews / totalSessions) * 100).toFixed(1)
      : '0.0'

    return {
      totalSessions,
      publicSessions,
      privateSessions,
      averageRating,
      positiveReviews,
      positiveReviewsRate
    }
  }

  // Get today's statistics
  const getTodayStatistics = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessionsState.sessions.filter(session => 
      session.created_at.startsWith(today)
    )
    
    const totalToday = todaySessions.length
    const publicToday = todaySessions.filter(s => s.is_public).length
    const privateToday = todaySessions.filter(s => !s.is_public).length

    return {
      totalToday,
      publicToday,
      privateToday
    }
  }

  useEffect(() => {
    if (profile && branches.length > 0 && !sessionsState.loaded) {
      fetchVotingSessions()
    }
  }, [profile, branches, sessionsState.loaded])

  return {
    ...sessionsState,
    getStatistics,
    getTodayStatistics,
    refetch: fetchVotingSessions
  }
}