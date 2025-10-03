import React, { useEffect, useState } from 'react';
import { QrCode, FileText, Printer, RotateCcw, AlertCircle, Check, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, ArrowDownRight, ArrowDownLeft, ArrowUpRight, ArrowUpLeft, Upload, Trash2 } from 'lucide-react';
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
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [userBackgrounds, setUserBackgrounds] = useState<BackgroundImage[]>([]);
  const [uploadingBackground, setUploadingBackground] = useState(false);

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

  // Load user's custom backgrounds
  useEffect(() => {
    const loadUserBackgrounds = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_qr_backgrounds')
          .select('id, name, image_url, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUserBackgrounds((data || []).map(bg => ({ ...bg, category: 'custom' })));
      } catch (error) {
        console.error('Error loading user backgrounds:', error);
      }
    };

    if (activeTab === 'design') {
      loadUserBackgrounds();
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

  const handleUploadBackground = async (file: File) => {
    setUploadingBackground(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo no debe exceder 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${selectedBranch.business_id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('qr-backgrounds')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('qr-backgrounds')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('user_qr_backgrounds')
        .insert({
          user_id: user.id,
          business_id: selectedBranch.business_id,
          name: file.name,
          image_url: publicUrl,
          file_size: file.size
        });

      if (dbError) throw dbError;

      // Reload user backgrounds
      const { data } = await supabase
        .from('user_qr_backgrounds')
        .select('id, name, image_url, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setUserBackgrounds((data || []).map(bg => ({ ...bg, category: 'custom' })));

      // Automatically select the new background
      updateBackground({ imageUrl: publicUrl });

    } catch (error: any) {
      console.error('Error uploading background:', error);
      alert(error.message || 'Error al cargar la imagen');
    } finally {
      setUploadingBackground(false);
    }
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
    let newBackground = { ...config.background, ...updates };

    // Clean up incompatible properties when changing background type
    if (updates.type) {
      if (updates.type === 'solid') {
        // Remove gradient and image properties
        delete newBackground.gradient;
        delete newBackground.imageUrl;
      } else if (updates.type === 'gradient') {
        // Remove image property
        delete newBackground.imageUrl;
        // Ensure gradient exists
        if (!newBackground.gradient) {
          newBackground.gradient = {
            start: '#FFFFFF',
            end: '#F3F4F6',
            direction: 'to-b'
          };
        }
      } else if (updates.type === 'image') {
        // Remove gradient property
        delete newBackground.gradient;
      }
    }

    onConfigUpdate({
      background: newBackground
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
                    Colores del Gradiente
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Color inicial */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                        Inicial
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
                          className="w-10 h-10 rounded-lg border cursor-pointer"
                          style={{ borderColor: 'rgb(209, 213, 219)' }}
                        />
                        <input
                          type="text"
                          value={config.background.gradient?.start || '#FFFFFF'}
                          onChange={(e) => updateBackground({
                            gradient: {
                              start: e.target.value,
                              end: config.background.gradient?.end || '#F3F4F6',
                              direction: config.background.gradient?.direction || 'to-b'
                            }
                          })}
                          className="flex-1 px-2 py-1.5 rounded-lg border text-xs font-mono"
                          style={{
                            borderColor: 'rgb(209, 213, 219)',
                            color: '#161616',
                            backgroundColor: 'white'
                          }}
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>

                    {/* Color final */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                        Final
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
                          className="w-10 h-10 rounded-lg border cursor-pointer"
                          style={{ borderColor: 'rgb(209, 213, 219)' }}
                        />
                        <input
                          type="text"
                          value={config.background.gradient?.end || '#F3F4F6'}
                          onChange={(e) => updateBackground({
                            gradient: {
                              start: config.background.gradient?.start || '#FFFFFF',
                              end: e.target.value,
                              direction: config.background.gradient?.direction || 'to-b'
                            }
                          })}
                          className="flex-1 px-2 py-1.5 rounded-lg border text-xs font-mono"
                          style={{
                            borderColor: 'rgb(209, 213, 219)',
                            color: '#161616',
                            backgroundColor: 'white'
                          }}
                          placeholder="#F3F4F6"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                    Dirección del Gradiente
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'to-t', icon: ArrowUp, label: 'Arriba' },
                      { value: 'to-b', icon: ArrowDown, label: 'Abajo' },
                      { value: 'to-l', icon: ArrowLeft, label: 'Izquierda' },
                      { value: 'to-r', icon: ArrowRight, label: 'Derecha' },
                      { value: 'to-tl', icon: ArrowUpLeft, label: '↖' },
                      { value: 'to-tr', icon: ArrowUpRight, label: '↗' },
                      { value: 'to-bl', icon: ArrowDownLeft, label: '↙' },
                      { value: 'to-br', icon: ArrowDownRight, label: '↘' }
                    ].map((dir) => {
                      const Icon = dir.icon;
                      const isSelected = (config.background.gradient?.direction || 'to-b') === dir.value;
                      return (
                        <button
                          key={dir.value}
                          onClick={() => updateBackground({
                            gradient: {
                              start: config.background.gradient?.start || '#FFFFFF',
                              end: config.background.gradient?.end || '#F3F4F6',
                              direction: dir.value
                            }
                          })}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                          style={{
                            borderColor: isSelected ? '#075E54' : 'rgb(209, 213, 219)',
                            backgroundColor: isSelected ? '#075E54' + '10' : 'white'
                          }}
                          title={dir.label}
                        >
                          <Icon size={20} style={{ color: isSelected ? '#075E54' : 'rgb(107, 114, 128)' }} />
                        </button>
                      );
                    })}
                  </div>
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
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {backgroundImages.slice(0, 6).map((bg) => (
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
                    {backgroundImages.length > 6 && (
                      <button
                        onClick={() => setShowGalleryModal(true)}
                        className="w-full mt-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border"
                        style={{
                          backgroundColor: 'white',
                          borderColor: '#075E54',
                          color: '#075E54'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#075E54';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = '#075E54';
                        }}
                      >
                        Ver más fondos ({backgroundImages.length - 6} más)
                      </button>
                    )}
                  </>
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

  return (
    <>
      {showGalleryModal && <BackgroundGalleryModal />}
      {null}
    </>
  );

  function BackgroundGalleryModal() {
    const [selectedCategory, setSelectedCategory] = useState<string>('custom');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const categories = [
      { id: 'custom', name: 'Mis Fondos' },
      { id: 'all', name: 'Librería' },
      { id: 'abstract', name: 'Abstracto' },
      { id: 'nature', name: 'Naturaleza' },
      { id: 'business', name: 'Negocios' },
      { id: 'minimalist', name: 'Minimalista' },
      { id: 'colorful', name: 'Colorido' },
      { id: 'patterns', name: 'Patrones' },
      { id: 'texture', name: 'Texturas' }
    ];

    const filteredBackgrounds = selectedCategory === 'custom'
      ? userBackgrounds
      : selectedCategory === 'all'
      ? backgroundImages
      : backgroundImages.filter(bg => bg.category === selectedCategory);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUploadBackground(file);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => setShowGalleryModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <h2 className="text-2xl font-bold" style={{ color: '#161616' }}>Galería de Fondos</h2>
            <button
              onClick={() => setShowGalleryModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-6 pt-4 border-b overflow-x-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div className="flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap"
                  style={{
                    color: selectedCategory === category.id ? '#075E54' : 'rgb(107, 114, 128)',
                    backgroundColor: selectedCategory === category.id ? 'white' : 'transparent',
                    borderBottom: selectedCategory === category.id ? '2px solid #075E54' : '2px solid transparent'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedCategory === 'custom' && (
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingBackground}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 border-dashed"
                  style={{
                    backgroundColor: uploadingBackground ? 'rgb(243, 244, 246)' : 'white',
                    borderColor: '#075E54',
                    color: uploadingBackground ? 'rgb(107, 114, 128)' : '#075E54'
                  }}
                >
                  {uploadingBackground ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#075E54' }}></div>
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Cargar fondo personalizado</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-center mt-2" style={{ color: 'rgb(107, 114, 128)' }}>
                  Formatos: JPG, PNG, WEBP | Máximo: 5MB
                </p>
              </div>
            )}

            {filteredBackgrounds.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {filteredBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      updateBackground({ imageUrl: bg.image_url });
                      setShowGalleryModal(false);
                    }}
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
            ) : selectedCategory === 'custom' ? (
              <div className="text-center py-12 px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                <Upload size={48} className="mx-auto mb-4" style={{ color: 'rgb(209, 213, 219)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: '#161616' }}>
                  No tienes fondos personalizados
                </p>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  Haz clic en "Cargar fondo personalizado" para agregar tus propias imágenes
                </p>
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  No hay fondos disponibles en esta categoría
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default QRConfigTab;