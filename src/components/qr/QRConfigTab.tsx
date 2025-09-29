import React from 'react';
import { QrCode, FileText, Printer, Type } from 'lucide-react';
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

  const updateTypography = (updates: Partial<QRConfiguration['typography']>) => {
    onConfigUpdate({
      typography: {
        ...config.typography,
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Tamaño del QR
              </label>
              <span className="text-sm font-medium px-2 py-1 rounded" style={{ 
                backgroundColor: '#075E54' + '20', 
                color: '#075E54' 
              }}>
                {config.qr.size}px
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              value={config.qr.size}
              onChange={(e) => updateQR({ size: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#075E54' }}
            />
            <div className="flex justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              <span>100px</span>
              <span>600px</span>
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Color del código
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.qr.foregroundColor}
                  onChange={(e) => updateQR({ foregroundColor: e.target.value })}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: 'rgb(209, 213, 219)' }}
                />
                <input
                  type="text"
                  value={config.qr.foregroundColor}
                  onChange={(e) => updateQR({ foregroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Color de fondo
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.qr.backgroundColor}
                  onChange={(e) => updateQR({ backgroundColor: e.target.value })}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: 'rgb(209, 213, 219)' }}
                />
                <input
                  type="text"
                  value={config.qr.backgroundColor}
                  onChange={(e) => updateQR({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
          
          {/* Quick color presets */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Combinaciones rápidas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Clásico', fg: '#000000', bg: '#FFFFFF' },
                { name: 'Verde', fg: '#075E54', bg: '#FFFFFF' },
                { name: 'Invertido', fg: '#FFFFFF', bg: '#000000' }
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateQR({ 
                    foregroundColor: preset.fg, 
                    backgroundColor: preset.bg 
                  })}
                  className="p-2 text-xs font-medium rounded-lg border transition-all duration-200"
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
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Margen y Calidad */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Configuración Avanzada
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Margen
                </label>
                <span className="text-sm font-medium px-2 py-1 rounded" style={{ 
                  backgroundColor: '#075E54' + '20', 
                  color: '#075E54' 
                }}>
                  {config.qr.margin}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={config.qr.margin}
                onChange={(e) => updateQR({ margin: parseInt(e.target.value) })}
                className="w-full"
                style={{ accentColor: '#075E54' }}
              />
              <div className="flex justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                <span>0px</span>
                <span>20px</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Nivel de corrección de errores
              </label>
              <select
                value={config.qr.errorCorrectionLevel}
                onChange={(e) => updateQR({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              >
                <option value="L">Bajo (L) - Hasta 7% de daño</option>
                <option value="M">Medio (M) - Hasta 15% de daño</option>
                <option value="Q">Alto (Q) - Hasta 25% de daño</option>
                <option value="H">Muy Alto (H) - Hasta 30% de daño</option>
              </select>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Niveles más altos permiten que el QR funcione aún si está dañado, pero será más denso
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Tipografía */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Tipografía
          </h3>
          
          <div className="space-y-6">
            {/* Tipografía Principal */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium" style={{ color: '#161616' }}>
                Tipografía Principal (Títulos)
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Fuente
                  </label>
                  <select
                    value={config.typography.primaryFont}
                    onChange={(e) => updateTypography({ primaryFont: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="Cabinet Grotesk">Cabinet Grotesk</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.typography.primaryColor}
                      onChange={(e) => updateTypography({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ borderColor: 'rgb(209, 213, 219)' }}
                    />
                    <input
                      type="text"
                      value={config.typography.primaryColor}
                      onChange={(e) => updateTypography({ primaryColor: e.target.value })}
                      className="flex-1 px-2 py-2 rounded border text-xs"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: 'white'
                      }}
                      placeholder="#161616"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tipografía Secundaria */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium" style={{ color: '#161616' }}>
                Tipografía Secundaria (Subtítulos)
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Fuente
                  </label>
                  <select
                    value={config.typography.secondaryFont}
                    onChange={(e) => updateTypography({ secondaryFont: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="Cabinet Grotesk">Cabinet Grotesk</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Tahoma">Tahoma</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.typography.secondaryColor}
                      onChange={(e) => updateTypography({ secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ borderColor: 'rgb(209, 213, 219)' }}
                    />
                    <input
                      type="text"
                      value={config.typography.secondaryColor}
                      onChange={(e) => updateTypography({ secondaryColor: e.target.value })}
                      className="flex-1 px-2 py-2 rounded border text-xs"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: 'white'
                      }}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vista Previa de Tipografía */}
            <div 
              className="p-4 rounded-lg border text-center"
              style={{ 
                backgroundColor: 'rgb(249, 250, 251)',
                borderColor: 'rgb(229, 231, 235)'
              }}
            >
              <h4 
                className="text-lg font-bold mb-2"
                style={{ 
                  fontFamily: config.typography.primaryFont,
                  color: config.typography.primaryColor
                }}
              >
                Vista Previa - Título Principal
              </h4>
              <p 
                className="text-sm"
                style={{ 
                  fontFamily: config.typography.secondaryFont,
                  color: config.typography.secondaryColor
                }}
              >
                Vista previa del subtítulo y texto secundario
              </p>
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