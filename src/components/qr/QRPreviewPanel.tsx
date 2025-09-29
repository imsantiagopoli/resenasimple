import React, { useState } from 'react';
import { Building2, ChevronDown, Download, Printer } from 'lucide-react';
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

  const handleDownload = () => {
    const qrURL = generateQRURL(selectedBranch.slug, config);
    const link = document.createElement('a');
    link.href = qrURL;
    link.download = `qr-${selectedBranch.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
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
                background: white;
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
              <img src="${qrURL}" alt="Código QR" />
              ${config.content.showCallToAction ? `<div class="cta">${config.content.callToAction}</div>` : ''}
            </div>
            ${config.print.includeInstructions ? `
              <div class="instructions">
                <strong>Instrucciones:</strong><br/>
                1. Abre la cámara de tu teléfono<br/>
                2. Apunta hacia el código QR<br/>
                3. Toca la notificación que aparece<br/>
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
              <h1 className="text-2xl font-bold mb-4" style={{ color: '#161616' }}>
                {config.content.title}
              </h1>
            )}
            
            {/* Subtítulo */}
            {config.content.showSubtitle && (
              <p className="text-lg mb-8" style={{ color: 'rgb(107, 114, 128)' }}>
                {config.content.subtitle}
              </p>
            )}
            
            {/* QR Code Container */}
            <div className="relative mb-6 inline-block">
              <div 
                className="p-4 rounded-lg"
                style={{
                  border: config.design.showFrame ? `${config.design.frameThickness}px solid ${config.design.frameColor}` : 'none',
                  backgroundColor: config.qr.backgroundColor
                }}
              >
                <div className="relative">
                  <img 
                    src={generateQRURL(selectedBranch.slug, config)}
                    alt="Código QR"
                    className="block"
                    style={{ 
                      width: config.qr.size,
                      height: config.qr.size
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            {config.content.showCallToAction && (
              <p className="text-lg font-semibold" style={{ color: '#075E54' }}>
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