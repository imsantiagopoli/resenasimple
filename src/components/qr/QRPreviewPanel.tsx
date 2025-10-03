import React, { useState } from 'react';
import { Building2, ChevronDown, Download, Printer, RefreshCw, Phone, Mail } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { BusinessBranch } from '../../hooks/useBusiness';
import { BusinessProfile } from '../../contexts/DataContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface QRPreviewPanelProps {
  qrData: {
    config: QRConfiguration;
    selectedBranch: BusinessBranch;
    branches: BusinessBranch[];
    businessProfile: BusinessProfile | null;
    onBranchChange: (branchId: string) => void;
    generateQRURL: (branchSlug: string, qrConfig?: QRConfiguration) => string;
  };
}

const QRPreviewPanel: React.FC<QRPreviewPanelProps> = ({ qrData }) => {
  const { config, selectedBranch, branches, businessProfile, onBranchChange, generateQRURL } = qrData;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isLoadingQR, setIsLoadingQR] = useState(false);

  // Generate QR URL whenever config or selected branch changes
  React.useEffect(() => {
    if (selectedBranch && config) {
      setIsLoadingQR(true);
      const newQRUrl = generateQRURL(selectedBranch.slug, config);
      setQrImageUrl(newQRUrl);
      
      // Add a small delay to show loading state
      setTimeout(() => setIsLoadingQR(false), 300);
    }
  }, [selectedBranch, config, generateQRURL]);

  const handleDownload = () => {
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
    const qrURL = generateQRURL(selectedBranch.slug, config);

    // Convert images to base64 if they exist
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

    // Build the HTML content with base64 images
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
        ${(config.content.showPhone && selectedBranch.phone) || (config.content.showEmail && selectedBranch.email) ? `
          <div style="margin-top: 1rem; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 1.5rem; font-family: ${config.typography.secondaryFont}, sans-serif; font-size: ${config.typography.secondaryFontSize}px; color: ${config.typography.secondaryColor};">
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
            <ol style="margin-top: 0.5rem; padding-left: 1rem; list-style-type: decimal;">
              <li style="margin-top: 0.25rem;">Abre la cámara de tu teléfono</li>
              <li style="margin-top: 0.25rem;">Apunta hacia el código QR</li>
              <li style="margin-top: 0.25rem;">Toca la notificación que aparece</li>
              <li style="margin-top: 0.25rem;">Comparte tu experiencia</li>
            </ol>
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
              resolve(); // Continue even if image fails
            };
            // Timeout fallback
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Vista Previa QR
          </h3>
          <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#075E54' + '20', color: '#075E54' }}>
            En vivo
          </div>
        </div>
        
        {/* Selector de Sucursal */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
            }}
          >
            <span>{selectedBranch.name}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: 'rgb(107, 114, 128)' }}
            />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg bg-white z-10 overflow-hidden"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onBranchChange(branch.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left transition-colors duration-200 flex items-center justify-between"
                  style={{ 
                    color: '#161616',
                    backgroundColor: selectedBranch.id === branch.id ? '#075E54' + '10' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBranch.id !== branch.id) {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBranch.id !== branch.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{branch.name}</span>
                    {branch.is_main && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: '#075E54' + '20',
                          color: '#075E54'
                        }}
                      >
                        Principal
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-12 px-8">
          <div className="text-center max-w-md">
            {/* Logo */}
            {config.design.showLogo && businessProfile?.logo_url && (
              <div className="mb-6 flex justify-center">
                <img
                  src={businessProfile.logo_url}
                  alt="Logo"
                  className="object-cover"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: config.design.logoShape === 'circular' ? '50%' : '8px'
                  }}
                />
              </div>
            )}

            {/* Título */}
            {config.content.showTitle && (
              <h1
                className="font-bold mb-4"
                style={{
                  color: config.typography.primaryColor,
                  fontFamily: config.typography.primaryFont,
                  fontSize: `${config.typography.primaryFontSize}px`
                }}
              >
                {config.content.title}
              </h1>
            )}
            
            {/* Subtítulo */}
            {config.content.showSubtitle && (
              <p
                className="mb-8"
                style={{
                  color: config.typography.secondaryColor,
                  fontFamily: config.typography.secondaryFont,
                  fontSize: `${config.typography.secondaryFontSize}px`
                }}
              >
                {config.content.subtitle}
              </p>
            )}
            
            {/* QR Code Container */}
            <div className="relative mb-6 inline-block">
              {isLoadingQR && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <RefreshCw size={24} className="animate-spin" style={{ color: '#075E54' }} />
                </div>
              )}
              <div 
                className="p-4 rounded-lg"
                style={{
                  border: config.design.showFrame ? `${config.design.frameThickness}px solid ${config.design.frameColor}` : 'none',
                  backgroundColor: config.qr.backgroundColor
                }}
              >
                <div className="relative">
                  <img 
                    src={qrImageUrl}
                    alt="Código QR"
                    className="block"
                    style={{ 
                      width: config.qr.size,
                      height: config.qr.size
                    }}
                    onLoad={() => setIsLoadingQR(false)}
                    onError={() => setIsLoadingQR(false)}
                  />
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            {config.content.showCallToAction && (
              <p
                className="font-semibold"
                style={{
                  color: config.typography.primaryColor,
                  fontFamily: config.typography.primaryFont,
                  fontSize: `${config.typography.primaryFontSize}px`
                }}
              >
                {config.content.callToAction}
              </p>
            )}

            {/* Contact Info */}
            {((config.content.showPhone && selectedBranch.phone) || (config.content.showEmail && selectedBranch.email)) && (
              <div
                className="mt-4 flex flex-row items-center justify-center gap-6"
                style={{
                  fontFamily: config.typography.secondaryFont,
                  fontSize: `${config.typography.secondaryFontSize}px`,
                  color: config.typography.secondaryColor
                }}
              >
                {config.content.showPhone && selectedBranch.phone && (
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={config.typography.secondaryColor}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>{selectedBranch.phone}</span>
                  </div>
                )}
                {config.content.showEmail && selectedBranch.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} style={{ color: config.typography.secondaryColor }} />
                    <span>{selectedBranch.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Instructions for print mode */}
            {config.print.includeInstructions && (
              <div className="mt-6 p-4 rounded-lg border text-xs text-left" style={{
                backgroundColor: 'rgb(249, 250, 251)',
                borderColor: 'rgb(229, 231, 235)',
                color: 'rgb(107, 114, 128)'
              }}>
                <strong style={{ color: '#161616' }}>Instrucciones:</strong>
                <div className="mt-2 space-y-1">
                  <div>1. Abre la cámara de tu teléfono</div>
                  <div>2. Apunta hacia el código QR</div>
                  <div>3. Toca la notificación que aparece</div>
                  <div>4. Comparte tu experiencia</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreviewPanel;