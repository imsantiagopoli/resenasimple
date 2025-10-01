import React, { useState } from 'react';
import { useVotingConfig } from '../hooks/useVotingConfig';
import VotingConfigPanel from '../components/voting/VotingConfigPanel';
import VotingPreviewPanel from '../components/voting/VotingPreviewPanel';

const PaginaVotacionPage: React.FC = () => {
  const {
    config,
    loading: configLoading,
    updateConfig,
    saveConfig,
    resetChanges,
    resetToDefaults,
    getOrCreateConfig,
    hasChanges,
    isSaving
  } = useVotingConfig();

  // Initialize config if it doesn't exist
  React.useEffect(() => {
    if (!config && !configLoading) {
      getOrCreateConfig();
    }
  }, [config, configLoading]);

  const handleConfigUpdate = (updates: Partial<typeof config>) => {
    if (!config) return;
    
    updateConfig(updates);
  };

  if (configLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
            No se pudo cargar la configuración
          </p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <div className="flex h-screen">
        {/* Columna izquierda - Configuración (más estrecha) */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <VotingConfigPanel
            config={config}
            onConfigUpdate={handleConfigUpdate}
            hasChanges={hasChanges}
            onSave={saveConfig}
            onReset={resetChanges}
            onResetToDefaults={resetToDefaults}
            isSaving={isSaving}
          />
        </div>
        
        {/* Columna derecha - Vista previa (más ancha) */}
        <div className="w-3/5 h-screen overflow-hidden">
          <VotingPreviewPanel config={config} />
        </div>
      </div>
    </div>
  );
};

export default PaginaVotacionPage;