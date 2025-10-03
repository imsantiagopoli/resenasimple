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

  const handlePrint = async () => {
    if (!selectedBranch || !config) return;

    const qrURL = generateQRURL(selectedBranch.slug, config);

    // Convert images to base64
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

    // Convert QR to base64
    console.log('Converting QR to base64:', qrURL);
    const qrBase64 = await getImageAsBase64(qrURL);
    console.log('QR base64 length:', qrBase64.length);

    // Convert logo to base64 if exists
    let logoBase64 = '';
    if (config.design.showLogo && businessProfile?.logo_url) {
      console.log('Converting logo to base64:', businessProfile.logo_url);
      logoBase64 = await getImageAsBase64(businessProfile.logo_url);
      console.log('Logo base64 length:', logoBase64.length);
    }

    // Log contact info
    console.log('Contact info:', {
      showPhone: config.content.showPhone,
      phone: selectedBranch.phone,
      showEmail: config.content.showEmail,
      email: selectedBranch.email
    });

    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '448px';
    tempContainer.style.background = 'white';

    // Build the HTML content
    tempContainer.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 3rem 2rem;">
        ${logoBase64 && config.design.showLogo ? `<div style="margin-bottom: 1.5rem; display: flex; justify-content: center;"><img src="${logoBase64}" alt="Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${config.design.logoShape === 'circular' ? '50%' : '8px'};" /></div>` : ''}
        ${config.content.showTitle ? `<h1 style="font-size: ${config.typography.primaryFontSize}px; font-weight: bold; margin-bottom: 1rem; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor};">${config.content.title}</h1>` : ''}
        ${config.content.showSubtitle ? `<p style="font-size: ${config.typography.secondaryFontSize}px; margin-bottom: 2rem; font-family: ${config.typography.secondaryFont}, sans-serif; color: ${config.typography.secondaryColor};">${config.content.subtitle}</p>` : ''}
        <div style="display: inline-block; margin-bottom: 1.5rem;">
          <div style="padding: 1rem; border-radius: 0.5rem; background-color: ${config.qr.backgroundColor}; ${config.design.showFrame ? `border: ${config.design.frameThickness}px solid ${config.design.frameColor};` : ''}">
            <img src="${qrBase64}" alt="Código QR" style="display: block; width: ${config.qr.size}px; height: ${config.qr.size}px;" />
          </div>
        </div>
        ${config.content.showCallToAction ? `<p style="font-size: ${config.typography.primaryFontSize}px; font-weight: 600; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor}; margin-bottom: 0;">${config.content.callToAction}</p>` : ''}
        ${(config.content.showPhone && selectedBranch.phone) || (config.content.showEmail && selectedBranch.email) ? `
          <div style="margin-top: 1rem; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 1.5rem; font-family: ${config.typography.secondaryFont}, sans-serif; font-size: ${config.typography.secondaryFontSize}px; color: ${config.typography.secondaryColor}; flex-wrap: wrap;">
            ${config.content.showPhone && selectedBranch.phone ? `
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${config.typography.secondaryColor}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>${selectedBranch.phone}</span>
              </div>
            ` : ''}
            ${config.content.showEmail && selectedBranch.email ? `
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${config.typography.secondaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>${selectedBranch.email}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
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

    console.log('Temp container HTML:', tempContainer.innerHTML);

    try {
      // Wait for images to load
      const images = tempContainer.getElementsByTagName('img');
      console.log('Number of images to load:', images.length);

      await Promise.all(
        Array.from(images).map((img, index) => {
          if (img.complete) {
            console.log(`Image ${index} already loaded`);
            return Promise.resolve();
          }
          return new Promise((resolve) => {
            img.onload = () => {
              console.log(`Image ${index} loaded successfully`);
              resolve();
            };
            img.onerror = (e) => {
              console.warn(`Image ${index} failed to load:`, img.src, e);
              resolve();
            };
            setTimeout(() => {
              console.log(`Image ${index} load timeout`);
              resolve();
            }, 5000);
          });
        })
      );

      // Longer delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas from HTML
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: false,
        allowTaint: true
      });

      console.log('Canvas generated:', canvas.width, 'x', canvas.height);

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
            selectedBranch={selectedBranch}
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