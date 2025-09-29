import { useData } from '../contexts/DataContext'

// Re-export types from DataContext
export type { QRConfiguration, QRConfigurationRecord } from '../contexts/DataContext'

export const useQRConfig = () => {
  const {
    qrConfiguration: config,
    originalQRConfiguration: originalConfig,
    qrConfigLoading: loading,
    qrConfigError: error,
    qrConfigLoaded: loaded,
    qrConfigHasChanges: hasChanges,
    qrConfigIsSaving: isSaving,
    updateQRConfig: updateConfig,
    saveQRConfig: saveConfig,
    createDefaultQRConfig: createDefaultConfig,
    getOrCreateQRConfig: getOrCreateConfig,
    resetQRConfigChanges: resetChanges,
    refetchQRConfig: refetch,
    generateQRURL
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
    refetch,
    generateQRURL
  }
}