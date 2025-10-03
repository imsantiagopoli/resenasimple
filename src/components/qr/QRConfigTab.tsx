import React, { useEffect, useState } from 'react';
import { QrCode, FileText, Printer, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { useFonts } from '../../hooks/useFonts';
import { BusinessBranch } from '../../hooks/useBusiness';
import { supabase } from '../../lib/supabase';

interface BackgroundImage {
  id: string;
  name: string;
  image_url: string;
  category: string;
}

interface QRConfigTabProps {
  activeTab: 'design' | 'content' | 'print';
  config: QRConfiguration;
  onConfigUpdate: (updates: Partial<QRConfiguration>) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  hasChanges: boolean;
  onResetToDefaults: () => void;
  selectedBranch: BusinessBranch;
}

const QRConfigTab: React.FC<QRConfigTabProps> = ({
  activeTab,
  config,
  onConfigUpdate,
  onDownload,
  onPrint,
  hasChanges,
  onResetToDefaults,
  selectedBranch
}) => {
  const { fonts, loadMultipleFonts } = useFonts();
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([]);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(false);

  // Load background images from database
  useEffect(() => {
    const loadBackgrounds = async () => {
      setLoadingBackgrounds(true);
      try {
        const { data, error } = await supabase
          .from('qr_backgrounds_resenasimple')
          .select('id, name, image_url, category')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setBackgroundImages(data || []);
      } catch (error) {
        console.error('Error loading backgrounds:', error);
      } finally {
        setLoadingBackgrounds(false);
      }
    };

    if (activeTab === 'design') {
      loadBackgrounds();
    }
  }, [activeTab]);

  useEffect(() => {
    if (config.typography) {
      loadMultipleFonts([config.typography.primaryFont, config.typography.secondaryFont]);
    }
  }, [config.typography?.primaryFont, config.typography?.secondaryFont]);
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

  const updateTypography = (updates: Partial<QRConfiguration['typography']>) => {
    onConfigUpdate({
      typography: {
        ...config.typography,
        ...updates
      }
    });
  };

  const updateBackground = (updates: Partial<QRConfiguration['background']>) => {
    onConfigUpdate({
      background: {
        ...config.background,
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

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Logo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Logo del Negocio
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showLogo"
                checked={config.design.showLogo}
                onChange={(e) => updateDesign({ showLogo: e.target.checked })}
                className="w-4 h-4"
                style={{ accentColor: '#075E54' }}
              />
              <label htmlFor="showLogo" className="text-sm font-medium" style={{ color: '#161616' }}>
                Mostrar logo al principio
              </label>
            </div>

            {config.design.showLogo && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Forma del logo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateDesign({ logoShape: 'circular' })}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        config.design.logoShape === 'circular' ? 'border-[#075E54]' : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor: config.design.logoShape === 'circular' ? '#075E54' + '10' : 'white',
                        color: config.design.logoShape === 'circular' ? '#075E54' : '#161616'
                      }}
                    >
                      Circular
                    </button>
                    <button
                      onClick={() => updateDesign({ logoShape: 'square' })}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        config.design.logoShape === 'square' ? 'border-[#075E54]' : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor: config.design.logoShape === 'square' ? '#075E54' + '10' : 'white',
                        color: config.design.logoShape === 'square' ? '#075E54' : '#161616'
                      }}
                    >
                      Cuadrado
                    </button>
                  </div>
                </div>
              </div>
            )}
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

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Fondo del QR */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Fondo
          </h3>

          <div className="space-y-4">
            {/* Tipo de fondo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Tipo de fondo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateBackground({ type: 'solid' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    config.background.type === 'solid' ? '' : 'border'
                  }`}
                  style={{
                    backgroundColor: config.background.type === 'solid' ? '#075E54' : 'white',
                    color: config.background.type === 'solid' ? 'white' : '#161616',
                    borderColor: config.background.type === 'solid' ? '#075E54' : 'rgb(209, 213, 219)'
                  }}
                >
                  Sólido
                </button>
                <button
                  onClick={() => updateBackground({ type: 'gradient', gradient: { start: '#FFFFFF', end: '#F3F4F6', direction: 'to-b' } })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    config.background.type === 'gradient' ? '' : 'border'
                  }`}
                  style={{
                    backgroundColor: config.background.type === 'gradient' ? '#075E54' : 'white',
                    color: config.background.type === 'gradient' ? 'white' : '#161616',
                    borderColor: config.background.type === 'gradient' ? '#075E54' : 'rgb(209, 213, 219)'
                  }}
                >
                  Gradiente
                </button>
                <button
                  onClick={() => updateBackground({ type: 'image' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    config.background.type === 'image' ? '' : 'border'
                  }`}
                  style={{
                    backgroundColor: config.background.type === 'image' ? '#075E54' : 'white',
                    color: config.background.type === 'image' ? 'white' : '#161616',
                    borderColor: config.background.type === 'image' ? '#075E54' : 'rgb(209, 213, 219)'
                  }}
                >
                  Imagen
                </button>
              </div>
            </div>

            {/* Opciones según el tipo */}
            {config.background.type === 'solid' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Color de fondo
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={config.background.color}
                    onChange={(e) => updateBackground({ color: e.target.value })}
                    className="w-8 h-8 rounded border"
                  />
                  <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                    {config.background.color}
                  </span>
                </div>
              </div>
            )}

            {config.background.type === 'gradient' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Color inicial
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.background.gradient?.start || '#FFFFFF'}
                      onChange={(e) => updateBackground({
                        gradient: {
                          start: e.target.value,
                          end: config.background.gradient?.end || '#F3F4F6',
                          direction: config.background.gradient?.direction || 'to-b'
                        }
                      })}
                      className="w-8 h-8 rounded border"
                    />
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {config.background.gradient?.start || '#FFFFFF'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Color final
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.background.gradient?.end || '#F3F4F6'}
                      onChange={(e) => updateBackground({
                        gradient: {
                          start: config.background.gradient?.start || '#FFFFFF',
                          end: e.target.value,
                          direction: config.background.gradient?.direction || 'to-b'
                        }
                      })}
                      className="w-8 h-8 rounded border"
                    />
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {config.background.gradient?.end || '#F3F4F6'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Dirección
                  </label>
                  <select
                    value={config.background.gradient?.direction || 'to-b'}
                    onChange={(e) => updateBackground({
                      gradient: {
                        start: config.background.gradient?.start || '#FFFFFF',
                        end: config.background.gradient?.end || '#F3F4F6',
                        direction: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  >
                    <option value="to-b">Arriba → Abajo</option>
                    <option value="to-t">Abajo → Arriba</option>
                    <option value="to-r">Izquierda → Derecha</option>
                    <option value="to-l">Derecha → Izquierda</option>
                    <option value="to-br">Diagonal ↘</option>
                    <option value="to-bl">Diagonal ↙</option>
                    <option value="to-tr">Diagonal ↗</option>
                    <option value="to-tl">Diagonal ↖</option>
                  </select>
                </div>
              </div>
            )}

            {config.background.type === 'image' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Fondos disponibles
                </label>

                {loadingBackgrounds ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
                    <p className="mt-2 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Cargando fondos...</p>
                  </div>
                ) : backgroundImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {backgroundImages.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => updateBackground({ imageUrl: bg.image_url })}
                        className="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105"
                        style={{
                          borderColor: config.background.imageUrl === bg.image_url ? '#075E54' : 'rgb(229, 231, 235)',
                          aspectRatio: '16/9'
                        }}
                      >
                        <img
                          src={bg.image_url}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                        {config.background.imageUrl === bg.image_url && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#075E54' + '80' }}>
                            <div className="rounded-full p-2" style={{ backgroundColor: '#075E54' }}>
                              <Check size={24} color="white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs font-medium text-white truncate">{bg.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                    <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>No hay fondos disponibles</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reset to Defaults Button */}
        {!hasChanges && (
          <>
            <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
            <div className="space-y-2">
              <button
                onClick={onResetToDefaults}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border"
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
                <RotateCcw size={16} />
                <span>Restablecer a Valores por Defecto</span>
              </button>
            </div>
          </>
        )}
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

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Información de Contacto */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Información de Contacto
          </h3>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Muestra el teléfono y/o email de la sucursal en la página de QR
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showPhone"
                  checked={config.content.showPhone}
                  onChange={(e) => updateContent({ showPhone: e.target.checked })}
                  className="w-4 h-4"
                  style={{ accentColor: '#075E54' }}
                />
                <label htmlFor="showPhone" className="text-sm font-medium" style={{ color: '#161616' }}>
                  Mostrar teléfono
                </label>
              </div>

              {config.content.showPhone && !selectedBranch.phone && (
                <div className="ml-7 flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgb(254, 249, 195)', borderLeft: '3px solid rgb(234, 179, 8)' }}>
                  <AlertCircle size={16} style={{ color: 'rgb(161, 98, 7)', flexShrink: 0, marginTop: '1px' }} />
                  <p className="text-xs" style={{ color: 'rgb(161, 98, 7)' }}>
                    Esta sucursal no tiene teléfono configurado. Agrégalo en Mi Negocio &gt; Sucursales.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showEmail"
                  checked={config.content.showEmail}
                  onChange={(e) => updateContent({ showEmail: e.target.checked })}
                  className="w-4 h-4"
                  style={{ accentColor: '#075E54' }}
                />
                <label htmlFor="showEmail" className="text-sm font-medium" style={{ color: '#161616' }}>
                  Mostrar email
                </label>
              </div>

              {config.content.showEmail && !selectedBranch.email && (
                <div className="ml-7 flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgb(254, 249, 195)', borderLeft: '3px solid rgb(234, 179, 8)' }}>
                  <AlertCircle size={16} style={{ color: 'rgb(161, 98, 7)', flexShrink: 0, marginTop: '1px' }} />
                  <p className="text-xs" style={{ color: 'rgb(161, 98, 7)' }}>
                    Esta sucursal no tiene email configurado. Agrégalo en Mi Negocio &gt; Sucursales.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />

        {/* Tipografía */}
        <div className="space-y-8">
          {/* Tipografía Principal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Tipografía Principal
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Para títulos y llamadas a la acción
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
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
                  {fonts.map((font) => (
                    <option key={font.id} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Tamaño de Fuente
                  </label>
                  <span className="text-sm font-medium px-2 py-1 rounded" style={{
                    backgroundColor: '#075E54' + '20',
                    color: '#075E54'
                  }}>
                    {config.typography.primaryFontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={config.typography.primaryFontSize}
                  onChange={(e) => updateTypography({ primaryFontSize: parseInt(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: '#075E54' }}
                />
                <div className="flex justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                  <span>12px</span>
                  <span>48px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.typography.primaryColor}
                    onChange={(e) => updateTypography({ primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  />
                  <input
                    type="text"
                    value={config.typography.primaryColor}
                    onChange={(e) => updateTypography({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
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
            <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Tipografía Secundaria
            </h3>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Para subtítulos y texto descriptivo
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
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
                  {fonts.map((font) => (
                    <option key={font.id} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Tamaño de Fuente
                  </label>
                  <span className="text-sm font-medium px-2 py-1 rounded" style={{
                    backgroundColor: '#075E54' + '20',
                    color: '#075E54'
                  }}>
                    {config.typography.secondaryFontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={config.typography.secondaryFontSize}
                  onChange={(e) => updateTypography({ secondaryFontSize: parseInt(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: '#075E54' }}
                />
                <div className="flex justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                  <span>10px</span>
                  <span>32px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.typography.secondaryColor}
                    onChange={(e) => updateTypography({ secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  />
                  <input
                    type="text"
                    value={config.typography.secondaryColor}
                    onChange={(e) => updateTypography({ secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
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
        </div>
      </div>
    );
  }

  if (activeTab === 'print') {
    return (
      <div className="p-6 space-y-8">
        {/* Información de Impresión */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Impresión de QR
          </h3>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)', borderLeft: '4px solid #075E54' }}>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              El QR se imprimirá exactamente como se ve en la vista previa, manteniendo todas las proporciones, colores y diseños configurados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QRConfigTab;