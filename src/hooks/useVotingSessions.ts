import { useData } from '../contexts/DataContext';

// Re-export types from DataContext
export type { VotingSession } from '../contexts/DataContext';

export const useVotingSessions = () => {
  const {
    votingSessions: sessions,
    sessionsLoading: loading,
    sessionsError: error,
    sessionsLoaded: loaded,
    refetchSessionsData: refetch,
    getStatistics,
    getTodayStatistics
  } = useData();

  return {
    sessions,
    loading,
    error,
    loaded,
    refetch,
    getStatistics,
    getTodayStatistics
  };
};