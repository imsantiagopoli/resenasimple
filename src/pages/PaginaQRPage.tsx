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

  const handleDownload = () => {
    if (!selectedBranch) return;
    const qrURL = generateQRURL(selectedBranch.slug, config);
    
    // Create a temporary link to download the QR image
    const link = document.createElement('a');
    
    // Fetch the image and create a blob URL
    fetch(qrURL)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `qr-${selectedBranch.slug}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading QR:', error);
        // Fallback: open QR in new tab
        window.open(qrURL, '_blank');
      });
  };

  const handlePrint = () => {
    if (!selectedBranch || !config) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const qrURL = generateQRURL(selectedBranch.slug, config);
      const content = `
        <html>
          <head>
            <title>Código QR - ${selectedBranch.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                text-align: center;
              }
              .qr-container {
                border: ${config.design.showFrame ? `${config.design.frameThickness}px solid ${config.design.frameColor}` : 'none'};
                padding: 20px;
                border-radius: 8px;
                background: ${config.qr.backgroundColor};
              }
              h1 { color: #161616; margin-bottom: 10px; }
              h2 { color: rgb(107, 114, 128); margin-bottom: 20px; font-weight: normal; }
              .cta { color: #075E54; margin-top: 20px; font-weight: bold; }
              .instructions {
                margin-top: 30px;
                padding: 15px;
                background: #f9fafb;
                border-radius: 8px;
                color: rgb(107, 114, 128);
                font-size: 14px;
                max-width: 400px;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              ${config.content.showTitle ? `<h1>${config.content.title}</h1>` : ''}
              ${config.content.showSubtitle ? `<h2>${config.content.subtitle}</h2>` : ''}
              <img src="${qrURL}" alt="Código QR" style="width: ${config.qr.size}px; height: ${config.qr.size}px;" />
              ${config.content.showCallToAction ? `<div class="cta">${config.content.callToAction}</div>` : ''}
            </div>
            ${config.print.includeInstructions ? `
              <div class="instructions">
                <strong>Instrucciones:</strong><br/>
                1. Abre la cámara de tu teléfono<br/>
                2. Apunta al código QR<br/>
                3. Toca el enlace que aparece<br/>
                4. Comparte tu experiencia
              </div>
            ` : ''}
          </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
      };
    }
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
            onDownload={handleDownload}
            onPrint={handlePrint}
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