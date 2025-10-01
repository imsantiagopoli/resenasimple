import React, { useState } from 'react';
import { Building2, ChevronDown, Download, Printer, RefreshCw } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { BusinessBranch } from '../../hooks/useBusiness';

interface QRPreviewPanelProps {
  qrData: {
    config: QRConfiguration;
    selectedBranch: BusinessBranch;
    branches: BusinessBranch[];
    onBranchChange: (branchId: string) => void;
    generateQRURL: (branchSlug: string, qrConfig?: QRConfiguration) => string;
  };
}

const QRPreviewPanel: React.FC<QRPreviewPanelProps> = ({ qrData }) => {
  const { config, selectedBranch, branches, onBranchChange, generateQRURL } = qrData;
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const qrURL = generateQRURL(selectedBranch.slug, config);

      // Calculate dynamic height based on content
      let contentHeight = 0;
      contentHeight += config.content.showTitle ? 100 : 0; // Title height + margin
      contentHeight += config.content.showSubtitle ? 80 : 0; // Subtitle height + margin
      contentHeight += config.qr.size + 32; // QR size + padding
      contentHeight += config.content.showCallToAction ? 60 : 0; // CTA height
      contentHeight += config.print.includeInstructions ? 140 : 0; // Instructions height
      contentHeight += 96; // Total vertical padding (3rem top + 3rem bottom)

      const content = `
        <html>
          <head>
            <title>Código QR - ${selectedBranch.name}</title>
            <style>
              @page {
                size: 448px ${contentHeight}px;
                margin: 0;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 448px;
                height: ${contentHeight}px;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              body {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .print-container {
                text-align: center;
                width: 100%;
                padding: 3rem 2rem;
              }
              .title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
                font-family: ${config.typography.primaryFont}, sans-serif;
                color: ${config.typography.primaryColor};
              }
              .subtitle {
                font-size: 1.125rem;
                margin-bottom: 2rem;
                font-family: ${config.typography.secondaryFont}, sans-serif;
                color: ${config.typography.secondaryColor};
              }
              .qr-wrapper {
                display: inline-block;
                margin-bottom: 1.5rem;
              }
              .qr-container {
                padding: 1rem;
                border-radius: 0.5rem;
                background-color: ${config.qr.backgroundColor};
                ${config.design.showFrame ? `border: ${config.design.frameThickness}px solid ${config.design.frameColor};` : ''}
              }
              .qr-container img {
                display: block;
                width: ${config.qr.size}px;
                height: ${config.qr.size}px;
              }
              .cta {
                font-size: 1.125rem;
                font-weight: 600;
                font-family: ${config.typography.primaryFont}, sans-serif;
                color: ${config.typography.primaryColor};
              }
              .instructions {
                margin-top: 1.5rem;
                padding: 1rem;
                background: rgb(249, 250, 251);
                border: 1px solid rgb(229, 231, 235);
                border-radius: 0.5rem;
                font-size: 0.75rem;
                text-align: left;
                color: rgb(107, 114, 128);
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
              .instructions strong {
                color: #161616;
              }
              .instructions ol {
                margin-top: 0.5rem;
                padding-left: 1rem;
                list-style-type: decimal;
              }
              .instructions li {
                margin-top: 0.25rem;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${config.content.showTitle ? `<h1 class="title">${config.content.title}</h1>` : ''}
              ${config.content.showSubtitle ? `<p class="subtitle">${config.content.subtitle}</p>` : ''}
              <div class="qr-wrapper">
                <div class="qr-container">
                  <img src="${qrURL}" alt="Código QR" />
                </div>
              </div>
              ${config.content.showCallToAction ? `<p class="cta">${config.content.callToAction}</p>` : ''}
              ${config.print.includeInstructions ? `
                <div class="instructions">
                  <strong>Instrucciones:</strong>
                  <ol>
                    <li>Abre la cámara de tu teléfono</li>
                    <li>Apunta hacia el código QR</li>
                    <li>Toca la notificación que aparece</li>
                    <li>Comparte tu experiencia</li>
                  </ol>
                </div>
              ` : ''}
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 100);
      };
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
            {/* Título */}
            {config.content.showTitle && (
              <h1 
                className="text-2xl font-bold mb-4" 
                style={{ 
                  color: config.typography.primaryColor,
                  fontFamily: config.typography.primaryFont
                }}
              >
                {config.content.title}
              </h1>
            )}
            
            {/* Subtítulo */}
            {config.content.showSubtitle && (
              <p 
                className="text-lg mb-8" 
                style={{ 
                  color: config.typography.secondaryColor,
                  fontFamily: config.typography.secondaryFont
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
                className="text-lg font-semibold" 
                style={{ 
                  color: config.typography.primaryColor,
                  fontFamily: config.typography.primaryFont
                }}
              >
                {config.content.callToAction}
              </p>
            )}
            
            {/* Instructions for print mode */}
            {config.print.includeInstructions && (
              <div className="mt-6 p-4 rounded-lg border text-xs text-left" style={{
                backgroundColor: 'rgb(249, 250, 251)',
                borderColor: 'rgb(229, 231, 235)',
                color: 'rgb(107, 114, 128)'
              }}>
                <strong style={{ color: '#161616' }}>Instrucciones:</strong>
                <ol className="mt-2 space-y-1" style={{ paddingLeft: '1rem' }}>
                  <li>1. Abre la cámara de tu teléfono</li>
                  <li>2. Apunta hacia el código QR</li>
                  <li>3. Toca la notificación que aparece</li>
                  <li>4. Comparte tu experiencia</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreviewPanel;