import React, { useState } from 'react';
import QRConfigPanel from '../components/qr/QRConfigPanel';
import QRPreviewPanel from '../components/qr/QRPreviewPanel';
import { useQRConfig } from '../hooks/useQRConfig';
import { useBusiness } from '../hooks/useBusiness';

const PaginaQRPage: React.FC = () => {
  const { 
    config, 
    loading: configLoading, 
    updateConfig, 
    saveConfig,
    resetChanges,
    getOrCreateConfig, 
    hasChanges,
    isSaving,
    generateQRURL
  } = useQRConfig();
  
  const { branches } = useBusiness();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Initialize config if it doesn't exist
  React.useEffect(() => {
    if (!config && !configLoading) {
      getOrCreateConfig();
    }
  }, [config, configLoading]);

  // Set initial branch selection
  React.useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      const mainBranch = branches.find(b => b.is_main) || branches[0];
      setSelectedBranchId(mainBranch.id);
    }
  }, [branches, selectedBranchId]);

  const handleConfigUpdate = (updates: Partial<typeof config>) => {
    if (!config) return;
    
    updateConfig(updates);
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  if (configLoading || !selectedBranch) {
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
            No se pudo cargar la configuración QR
          </p>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  const qrData = {
    config,
    selectedBranch,
    branches,
    onBranchChange: setSelectedBranchId,
    generateQRURL
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex h-screen">
        {/* Columna izquierda - Configuración QR (más estrecha) */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <QRConfigPanel 
            config={config} 
            onConfigUpdate={handleConfigUpdate}
            hasChanges={hasChanges}
            onSave={saveConfig}
            onReset={resetChanges}
            isSaving={isSaving}
          />
        </div>
        
        {/* Columna derecha - Vista previa QR (más ancha) */}
        <div className="w-3/5 h-screen overflow-hidden">
          <QRPreviewPanel qrData={qrData} />
        </div>
      </div>
    </div>
  );
};

export default PaginaQRPage;