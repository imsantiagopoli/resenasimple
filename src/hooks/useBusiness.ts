import { useData } from '../contexts/DataContext';

// Re-export types from DataContext
export type { BusinessProfile, BusinessBranch } from '../contexts/DataContext';

export const useBusiness = () => {
  const {
    businessProfile: profile,
    businessBranches: branches,
    businessLoading: loading,
    businessError: error,
    businessLoaded: loaded,
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    refetchBusinessData: refetch,
    generateSlug
  } = useData();

  return {
    profile,
    branches,
    loading,
    error,
    loaded,
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    refetch,
    generateSlug,
    generateSlugSync
  };
};