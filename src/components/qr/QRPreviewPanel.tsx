import React, { useState } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { QRConfig } from '../../pages/PaginaQRPage';

interface QRPreviewPanelProps {
  config: QRConfig;
}

const QRPreviewPanel: React.FC<QRPreviewPanelProps> = ({ config }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewBranchId, setPreviewBranchId] = useState(config.branch.selectedBranchId);

  // Mock branches data
  const branches = [
    {
      id: '1',
      name: 'Pizzería Napolitana - Centro',
      slug: 'pizzeria-napolitana-centro',
      address: 'Av. Corrientes 1234, CABA',
      isMain: true
    },
    {
      id: '2',
      name: 'Pizzería Napolitana - Palermo',
      slug: 'pizzeria-napolitana-palermo', 
      address: 'Av. Santa Fe 2345, CABA',
      isMain: false
    },
    {
      id: '3',
      name: 'Pizzería Napolitana - Belgrano',
      slug: 'pizzeria-napolitana-belgrano',
      address: 'Av. Cabildo 3456, CABA', 
      isMain: false
    }
  ];

  // Find the currently selected branch for preview
  const selectedBranch = branches.find(branch => branch.id === previewBranchId) || branches[0];

  const generateQRURL = () => {
    const votingURL = `https://reseñasimple.com/v/${selectedBranch.slug}`;
    const qrAPI = `https://api.qrserver.com/v1/create-qr-code/`;
    
    const params = new URLSearchParams({
      size: `${config.qr.size}x${config.qr.size}`,
      data: votingURL,
      format: 'png',
      bgcolor: config.qr.backgroundColor.replace('#', ''),
      color: config.qr.foregroundColor.replace('#', ''),
      ecc: config.qr.errorCorrectionLevel,
      margin: config.qr.margin.toString()
    });

    return `${qrAPI}?${params.toString()}`;
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
                    setPreviewBranchId(branch.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left transition-colors duration-200 flex items-center justify-between"
                  style={{ 
                    color: '#161616',
                    backgroundColor: previewBranchId === branch.id ? '#075E54' + '10' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (previewBranchId !== branch.id) {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (previewBranchId !== branch.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{branch.name}</span>
                    {branch.isMain && (
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
                    src={generateQRURL()}
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