import React from 'react';
import { QrCode, FileText, Printer, Download } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';

interface QRConfigTabProps {
  activeTab: 'design' | 'content' | 'print';
  config: QRConfiguration;
  onConfigUpdate: (updates: Partial<QRConfiguration>) => void;
}

const QRConfigTab: React.FC<QRConfigTabProps> = ({ activeTab, config, onConfigUpdate }) => {
  const updateQR = (updates: Partial<QRConfiguration['qr']>) => {
    onConfigUpdate({
      qr: {
        ...config.qr,
        ...updates
      }
    });
  };

  const updateDesign = (updates: Partial<QRConfiguration['design']>) => {
    onConfigUpdate({
      design: {
        ...config.design,
        ...updates
      }
    });
  };

  const updateContent = (updates: Partial<QRConfiguration['content']>) => {
    onConfigUpdate({
      content: {
        ...config.content,
        ...updates
      }
    });
  };

  const updatePrint = (updates: Partial<QRConfiguration['print']>) => {
    onConfigUpdate({
      print: {
        ...config.print,
        ...updates
      }
    });
  };

  // Funciones para manejo de descarga e impresión
  const handleDownload = () => {
    // Use a default branch slug for download - this should be passed from parent
    const qrURL = generateQRURL('default-branch');
    const link = document.createElement('a');
    link.href = qrURL;
    link.download = `qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateQRURL = (branchSlug: string) => {
    const baseURL = window.location.origin;
    const votingURL = `${baseURL}/v/${branchSlug}`;
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const qrURL = generateQRURL('default-branch');
      const content = `
        <html>
          <head>
            <title>Código QR</title>
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

  if (activeTab === 'design') {
    return (
      <div className="p-6 space-y-8">
        {/* Tamaño del QR */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Tamaño del Código QR
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Tamaño: {config.qr.size}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={config.qr.size}
              onChange={(e) => updateQR({ size: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#075E54' }}
            />
            <div className="flex justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              <span>100px</span>
              <span>400px</span>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Colores del QR */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Colores del QR
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Color del código
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={config.qr.foregroundColor}
                  onChange={(e) => updateQR({ foregroundColor: e.target.value })}
                  className="w-8 h-8 rounded border"
                />
                <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {config.qr.foregroundColor}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Color de fondo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={config.qr.backgroundColor}
                  onChange={(e) => updateQR({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border"
                />
                <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  {config.qr.backgroundColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Marco/Borde */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Marco/Borde
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showFrame"
                checked={config.design.showFrame}
                onChange={(e) => updateDesign({ showFrame: e.target.checked })}
                className="w-4 h-4"
                  id="showCallToAction"
                  checked={config.content.showCallToAction}
                  onChange={(e) => updateContent({ showCallToAction: e.target.checked })}
                Agregar marco alrededor del QR
              </label>
            </div>
                <label htmlFor="showCallToAction" className="text-sm font-medium" style={{ color: '#161616' }}>
            {config.design.showFrame && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              {config.content.showCallToAction && (
                  </label>
                  <input
                    type="range"
                    min="1"
                    value={config.content.callToAction}
                    onChange={(e) => updateContent({ callToAction: e.target.value })}
                    onChange={(e) => updateDesign({ frameThickness: parseInt(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: '#075E54' }}
                  />
                </div>
                
                        onClick={() => updatePrint({ orientation: orientation.value as 'portrait' | 'landscape' })}
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                          config.print.format === size
                        config.print.format === size
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                          backgroundColor: config.print.format === size ? '#075E54' : 'transparent',
                          color: config.print.format === size ? 'white' : '#161616'
                        color: config.print.format === size ? 'white' : '#161616'
                    />
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {config.design.frameColor}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'content') {
    return (
      <div className="p-6 space-y-8">
        {/* Título Principal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Título Principal
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showTitle"
                checked={config.content.showTitle}
                onChange={(e) => updateContent({ showTitle: e.target.checked })}
                className="w-4 h-4"
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showTitle" className="text-sm font-medium" style={{ color: '#161616' }}>
                Mostrar título
              </label>
            </div>
            
            {config.content.showTitle && (
              <div className="ml-7">
                <input
                  type="text"
                  value={config.content.title}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  placeholder="Ej: ¡Déjanos tu opinión!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{ focusRingColor: '#075E54' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Subtítulo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Subtítulo
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showSubtitle"
                checked={config.content.showSubtitle}
                onChange={(e) => updateContent({ showSubtitle: e.target.checked })}
                className="w-4 h-4"
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showSubtitle" className="text-sm font-medium" style={{ color: '#161616' }}>
                Mostrar subtítulo
              </label>
            </div>
            
            {config.content.showSubtitle && (
              <div className="ml-7">
                <input
                  type="text"
                  value={config.content.subtitle}
                  onChange={(e) => updateContent({ subtitle: e.target.value })}
                  placeholder="Ej: Escanea el código QR para acceder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{ focusRingColor: '#075E54' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Llamada a la Acción */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Llamada a la Acción
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showCTA"
                checked={config.content.showCTA}
                onChange={(e) => updateContent({ showCTA: e.target.checked })}
                className="w-4 h-4"
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showCTA" className="text-sm font-medium" style={{ color: '#161616' }}>
                Mostrar llamada a la acción
              </label>
            </div>
            
            {config.content.showCTA && (
              <div className="ml-7">
                <input
                  type="text"
                  value={config.content.callToAction}
                  onChange={(e) => updateContent({ callToAction: e.target.value })}
                  placeholder="Ej: ¡Ayúdanos a mejorar!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{ focusRingColor: '#075E54' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'print') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Formato de Impresión */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Formato de Impresión
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Tamaño de papel
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {['A4', 'Letter', 'A5', 'Custom'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePrint({ paperSize: size.toLowerCase() })}
                    className={`p-3 text-sm font-medium rounded-md border-2 transition-colors ${
                      config.print.paperSize === size.toLowerCase()
                        ? 'border-transparent text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: config.print.paperSize === size.toLowerCase() ? '#075E54' : 'transparent',
                      color: config.print.paperSize === size.toLowerCase() ? 'white' : '#161616'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Orientación
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'portrait', label: 'Vertical' },
                  { value: 'landscape', label: 'Horizontal' }
                ].map((orientation) => (
                  <button
                    key={orientation.value}
                    onClick={() => updatePrint({ orientation: orientation.value })}
                    className={`p-3 text-sm font-medium rounded-md border-2 transition-colors ${
                      config.print.orientation === orientation.value
                        ? 'border-transparent text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: config.print.orientation === orientation.value ? '#075E54' : 'transparent',
                      color: config.print.orientation === orientation.value ? 'white' : '#161616'
                    }}
                  >
                    {orientation.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

          {/* Instrucciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Instrucciones
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="includeInstructions"
                  checked={config.print.includeInstructions}
                  onChange={(e) => updatePrint({ includeInstructions: e.target.checked })}
                  className="w-4 h-4"
                  style={{ accentColor: '#075E54' }}
                />
                <label htmlFor="includeInstructions" className="text-sm font-medium" style={{ color: '#161616' }}>
                  Incluir instrucciones al imprimir
                </label>
              </div>
              
              {config.print.includeInstructions && (
                <div className="ml-7 p-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    Se mostrarán instrucciones básicas como:
                  </p>
                  <ul className="mt-2 text-sm space-y-1" style={{ color: 'rgb(107, 114, 128)' }}>
                    <li>• Abre la cámara de tu teléfono</li>
                    <li>• Apunta al código QR</li>
                    <li>• Toca el enlace que aparece</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        
        {/* Botones fijos en el bottom */}
        <div className="border-t p-4" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border flex-1"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
             <Download size={16} />
              <span>Descargar QR</span>
            </button>
            
            <button
              onClick={handlePrint}
             className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex-1"
              style={{
                background: 'linear-gradient(135deg, #075E54 0%, #064e45 100%)',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #064e45 0%, #053d36 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #075E54 0%, #064e45 100%)';
              }}
            >
             <Printer size={16} />
              <span>Imprimir QR</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QRConfigTab;