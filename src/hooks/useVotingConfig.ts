import { useData } from '../contexts/DataContext'

// Re-export types from DataContext
export type { VotingConfiguration, VotingConfigurationRecord } from '../contexts/DataContext'

export const useVotingConfig = () => {
  const {
    votingConfiguration: config,
    originalVotingConfiguration: originalConfig,
    configLoading: loading,
    configError: error,
    configLoaded: loaded,
    configHasChanges: hasChanges,
    configIsSaving: isSaving,
    updateVotingConfig: updateConfig,
    saveVotingConfig: saveConfig,
    createDefaultVotingConfig: createDefaultConfig,
    getOrCreateVotingConfig: getOrCreateConfig,
    resetVotingConfigChanges: resetChanges,
    resetVotingConfigToDefaults: resetToDefaults,
    refetchVotingConfig: refetch
  } = useData()

  return {
    config,
    originalConfig,
    loading,
    error,
    loaded,
    hasChanges,
    isSaving,
    updateConfig,
    saveConfig,
    createDefaultConfig,
    getOrCreateConfig,
    resetChanges,
    resetToDefaults,
    refetch
  }
}