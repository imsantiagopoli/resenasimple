import React, { useState } from 'react';
import { Building2, ChevronDown, Download, Printer, RefreshCw, Phone, Mail } from 'lucide-react';
// Asegúrate de que las interfaces y tipos de datos se importen correctamente
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Convert Tailwind direction to CSS gradient direction
  const convertGradientDirection = (tailwindDir: string): string => {
    const directionMap: Record<string, string> = {
      'to-t': 'to top',
      'to-b': 'to bottom',
      'to-l': 'to left',
      'to-r': 'to right',
      'to-tl': 'to top left',
      'to-tr': 'to top right',
      'to-bl': 'to bottom left',
      'to-br': 'to bottom right'
    };
    return directionMap[tailwindDir] || 'to bottom';
  };

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

  const getBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownload = async () => {
    const qrURL = generateQRURL(selectedBranch.slug, config);
    
    try {
      const qrBase64 = await getBase64(qrURL);
      const link = document.createElement('a');
      link.href = qrBase64;
      link.download = `qr-${selectedBranch.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR:', error);
      // Fallback: open QR in new tab
      window.open(qrURL, '_blank');
    }
  };

  const handlePrint = async () => {
    setIsGeneratingPDF(true);
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.width = '448px';
    tempContainer.style.height = 'auto';
    tempContainer.style.zIndex = '9999';
    tempContainer.style.visibility = 'hidden';

    try {
      console.log('=== Starting PDF generation ===');
      console.log('Config:', config);

      const backgroundSrc = config.background.type === 'image' && config.background.imageUrl
        ? config.background.imageUrl
        : '';

      const logoSrc = config.design.showLogo && businessProfile?.logo_url
        ? businessProfile.logo_url
        : '';

      const qrSrc = qrImageUrl;

      console.log('Image sources:', { backgroundSrc, logoSrc, qrSrc });

      // --- Construcción del fondo ---
      let backgroundStyle = '';
      let backgroundImageHTML = '';

      if (config.background.type === 'solid') {
        backgroundStyle = `background-color: ${config.background.color};`;
      } else if (config.background.type === 'gradient' && config.background.gradient) {
        const gradientDirection = convertGradientDirection(config.background.gradient.direction);
        backgroundStyle = `background: linear-gradient(${gradientDirection}, ${config.background.gradient.start}, ${config.background.gradient.end});`;
      } else if (config.background.type === 'image' && backgroundSrc) {
        backgroundImageHTML = `<img crossorigin="anonymous" src="${backgroundSrc}" alt="Background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />`;
      }

      // --- Construcción del contenido HTML ---
      const contentHTML = `
        ${config.design.showLogo && logoSrc ? `<div style="margin-bottom: 1.5rem; display: flex; justify-content: center;"><img crossorigin="anonymous" src="${logoSrc}" alt="Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: ${config.design.logoShape === 'circular' ? '50%' : '8px'};" /></div>` : ''}
        ${config.content.showTitle ? `<h1 style="font-size: ${config.typography.primaryFontSize}px; font-weight: bold; margin-bottom: 1rem; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor};">${config.content.title}</h1>` : ''}
        ${config.content.showSubtitle ? `<p style="font-size: ${config.typography.secondaryFontSize}px; margin-bottom: 2rem; font-family: ${config.typography.secondaryFont}, sans-serif; color: ${config.typography.secondaryColor};">${config.content.subtitle}</p>` : ''}
        <div style="display: inline-block; margin-bottom: 1.5rem;">
          <div style="padding: 1rem; border-radius: 0.5rem; background-color: ${config.qr.backgroundColor}; ${config.design.showFrame ? `border: ${config.design.frameThickness}px solid ${config.design.frameColor};` : ''}">
            <img crossorigin="anonymous" src="${qrSrc}" alt="Código QR" style="display: block; width: ${config.qr.size}px; height: ${config.qr.size}px;" />
          </div>
        </div>
        ${config.content.showCallToAction ? `<p style="font-size: ${config.typography.primaryFontSize}px; font-weight: 600; font-family: ${config.typography.primaryFont}, sans-serif; color: ${config.typography.primaryColor}; margin-bottom: 0;">${config.content.callToAction}</p>` : ''}
        ${(config.content.showPhone && selectedBranch.phone) || (config.content.showEmail && selectedBranch.email) ? `
          <div style="margin-top: 1.5rem; text-align: center; font-family: ${config.typography.secondaryFont}, sans-serif; font-size: ${config.typography.secondaryFontSize}px; color: ${config.typography.secondaryColor}; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
            ${config.content.showPhone && selectedBranch.phone ? `<div style="display: inline-flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 500;">Teléfono:</span> <span>${selectedBranch.phone}</span></div>` : ''}
            ${config.content.showEmail && selectedBranch.email ? `<div style="display: inline-flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 500;">Correo:</span> <span>${selectedBranch.email}</span></div>` : ''}
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
      `;

      tempContainer.innerHTML = `
        <div id="pdf-content" style="position: relative; overflow: hidden; width: 100%; min-height: 600px; ${backgroundStyle}">
          ${backgroundImageHTML}
          <div style="position: relative; z-index: 1; padding: 3rem 2rem; box-sizing: border-box; text-align: center;">
            ${contentHTML}
          </div>
        </div>
      `;

      document.body.appendChild(tempContainer);

      // Wait for images to load
      await new Promise(resolve => {
        const images = tempContainer.getElementsByTagName('img');
        const totalImages = images.length;

        console.log(`Total images to load: ${totalImages}`);

        if (totalImages === 0) {
          console.log('No images to load, proceeding...');
          resolve(true);
          return;
        }

        let loadedCount = 0;
        const timeout = setTimeout(() => {
          console.log(`Timeout reached. Loaded ${loadedCount}/${totalImages} images`);
          resolve(true);
        }, 5000);

        for (let i = 0; i < totalImages; i++) {
          if (images[i].complete) {
            loadedCount++;
            console.log(`Image ${i + 1} already loaded (${loadedCount}/${totalImages})`);
            if (loadedCount === totalImages) {
              clearTimeout(timeout);
              resolve(true);
            }
          } else {
            images[i].onload = () => {
              loadedCount++;
              console.log(`Image ${i + 1} loaded successfully (${loadedCount}/${totalImages})`);
              if (loadedCount === totalImages) {
                clearTimeout(timeout);
                resolve(true);
              }
            };
            images[i].onerror = (error) => {
              loadedCount++;
              console.error(`Image ${i + 1} failed to load:`, error);
              if (loadedCount === totalImages) {
                clearTimeout(timeout);
                resolve(true);
              }
            };
          }
        }
      });

      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting canvas generation...');

      // --- Generar Canvas y PDF ---
      const contentDiv = tempContainer.querySelector('#pdf-content') as HTMLElement;
      console.log('Content div dimensions:', contentDiv.scrollWidth, 'x', contentDiv.scrollHeight);

      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: true,
        width: 448,
        height: contentDiv.scrollHeight,
        proxy: undefined,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('pdf-content');
          if (clonedElement) {
            clonedElement.style.width = '448px';
            const images = clonedElement.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
              images[i].crossOrigin = 'anonymous';
            }
          }
        }
      });

      console.log('Canvas generated:', canvas.width, 'x', canvas.height);

      const imgWidth = 448;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('Creating PDF with dimensions:', imgWidth, 'x', imgHeight);

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, imgWidth, imgHeight);
      console.log('Saving PDF...');
      pdf.save(`qr-${selectedBranch.slug}.pdf`);
      console.log('PDF saved successfully!');

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    } finally {
      setIsGeneratingPDF(false);
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
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
      <div
        className="flex-1 overflow-y-auto"
        style={
          config.background.type === 'solid'
            ? { backgroundColor: config.background.color }
            : config.background.type === 'gradient' && config.background.gradient
            ? {
                background: `linear-gradient(${convertGradientDirection(config.background.gradient.direction)}, ${config.background.gradient.start}, ${config.background.gradient.end})`
              }
            : config.background.type === 'image' && config.background.imageUrl
            ? {
                backgroundImage: `url(${config.background.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }
            : { backgroundColor: '#FFFFFF' }
        }
      >
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
                    <span className="font-medium">Teléfono:</span>
                    <span>{selectedBranch.phone}</span>
                  </div>
                )}
                {config.content.showEmail && selectedBranch.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Correo:</span>
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