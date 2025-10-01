import React, { useState } from 'react';
import QRConfigPanel from '../components/qr/QRConfigPanel';
import QRPreviewPanel from '../components/qr/QRPreviewPanel';
import { useQRConfig } from '../hooks/useQRConfig';
import { useBusiness } from '../hooks/useBusiness';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaginaQRPage: React.FC = () => {
  const {
    config,
    loading: configLoading,
    updateConfig,
    saveConfig,
    resetChanges,
    resetToDefaults,
    getOrCreateConfig,
    hasChanges,
    isSaving,
    generateQRURL
  } = useQRConfig();
  
  const { branches, businessProfile } = useBusiness();
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

  // Force regenerate QR when config is saved
  const handleSaveConfig = async () => {
    const result = await saveConfig();
    
    // If save was successful, force a re-render of the QR preview
    if (!result.error && selectedBranch) {
      // The QR will automatically regenerate due to the useEffect in QRPreviewPanel
    }
    
    return result;
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

  // Helper function to convert image URL to base64
  const getImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  const handlePrint = async () => {
    if (!selectedBranch || !config) return;

    const qrURL = generateQRURL(selectedBranch.slug, config);

    // Convert logo to base64 if needed
    let logoBase64 = '';
    if (config.design.showLogo && businessProfile?.logo_url) {
      logoBase64 = await getImageAsBase64(businessProfile.logo_url);
    }

    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '448px';
    tempContainer.style.background = 'white';

    // Build the HTML content with logo
    tempContainer.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 3rem 2rem;">
        ${logoBase64 ? `<div style="margin-bottom: 1.5rem; display: flex; justify-content: center;"><img src="${logoBase64}" alt="Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${config.design.logoShape === 'circular' ? '50%' : '8px'};" /></div>` : ''}
        ${config.content.showTitle ? `<h1 style="font-size: ${config.typography.primaryFontSize}px; font-weight: bold; margin-bottom: 1rem; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor};">${config.content.title}</h1>` : ''}
        ${config.content.showSubtitle ? `<p style="font-size: ${config.typography.secondaryFontSize}px; margin-bottom: 2rem; font-family: ${config.typography.secondaryFont}, sans-serif; color: ${config.typography.secondaryColor};">${config.content.subtitle}</p>` : ''}
        <div style="display: inline-block; margin-bottom: 1.5rem;">
          <div style="padding: 1rem; border-radius: 0.5rem; background-color: ${config.qr.backgroundColor}; ${config.design.showFrame ? `border: ${config.design.frameThickness}px solid ${config.design.frameColor};` : ''}">
            <img src="${qrURL}" alt="Código QR" style="display: block; width: ${config.qr.size}px; height: ${config.qr.size}px;" />
          </div>
        </div>
        ${config.content.showCallToAction ? `<p style="font-size: ${config.typography.primaryFontSize}px; font-weight: 600; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor};">${config.content.callToAction}</p>` : ''}
        ${config.print.includeInstructions ? `
          <div style="margin-top: 1.5rem; padding: 1rem; background: rgb(249, 250, 251); border: 1px solid rgb(229, 231, 235); border-radius: 0.5rem; font-size: 0.75rem; text-align: left; color: rgb(107, 114, 128); max-width: 400px; margin-left: auto; margin-right: auto;">
            <strong style="color: #161616;">Instrucciones:</strong>
            <div style="margin-top: 0.5rem;">
              <div style="margin-top: 0.25rem;">1. Abre la cámara de tu teléfono</div>
              <div style="margin-top: 0.25rem;">2. Apunta hacia el código QR</div>
              <div style="margin-top: 0.25rem;">3. Toca la notificación que aparece</div>
              <div style="margin-top: 0.25rem;">4. Comparte tu experiencia</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(tempContainer);

    try {
      // Wait for images to load
      const images = tempContainer.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = () => {
              console.warn('Image failed to load:', img.src);
              resolve();
            };
            setTimeout(resolve, 3000);
          });
        })
      );

      // Small delay to ensure images are fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate canvas from HTML (base64 images don't need CORS)
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: false,
        allowTaint: true
      });

      // Calculate PDF dimensions
      const imgWidth = 448;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`qr-${selectedBranch.slug}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Remove temporary container
      document.body.removeChild(tempContainer);
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
    businessProfile,
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
            onSave={handleSaveConfig}
            onReset={resetChanges}
            onResetToDefaults={resetToDefaults}
            isSaving={isSaving}
            onDownload={handleDownload}
            onPrint={handlePrint}
            currentBranchSlug={selectedBranch.slug}
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