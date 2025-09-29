import React from 'react';
import { QrCode, FileText, Printer } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';

interface QRConfigTabProps {
  activeTab: 'design' | 'content' | 'print';
  config: QRConfiguration;
  onConfigUpdate: (updates: Partial<QRConfiguration>) => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

const QRConfigTab: React.FC<QRConfigTabProps> = ({ 
  activeTab, 
  config, 
  onConfigUpdate,
  onDownload,
  onPrint
}) => {
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
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showFrame" className="text-sm font-medium" style={{ color: '#161616' }}>
                Agregar marco alrededor del QR
              </label>
            </div>
            
            {config.design.showFrame && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Grosor: {config.design.frameThickness}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={config.design.frameThickness}
                    onChange={(e) => updateDesign({ frameThickness: parseInt(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: '#075E54' }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Color del marco
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.design.frameColor}
                      onChange={(e) => updateDesign({ frameColor: e.target.value })}
                      className="w-8 h-8 rounded border"
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
                id="showCallToAction"
                checked={config.content.showCallToAction}
                onChange={(e) => updateContent({ showCallToAction: e.target.checked })}
                className="w-4 h-4"
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showCallToAction" className="text-sm font-medium" style={{ color: '#161616' }}>
                Mostrar llamada a la acción
              </label>
            </div>
            
            {config.content.showCallToAction && (
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
      <div className="p-6 space-y-8">
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
                {['A4', 'Letter', 'Custom'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePrint({ format: size as 'A4' | 'Letter' | 'Custom' })}
                    className={`p-3 text-sm font-medium rounded-md border-2 transition-colors ${
                      config.print.format === size
                        ? 'border-transparent text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: config.print.format === size ? '#075E54' : 'transparent',
                      color: config.print.format === size ? 'white' : '#161616'
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
                    onClick={() => updatePrint({ orientation: orientation.value as 'portrait' | 'landscape' })}
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
    );
  }

  return null;
};

export default QRConfigTab;