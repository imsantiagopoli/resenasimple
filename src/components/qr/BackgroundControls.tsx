import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface BackgroundControlsProps {
  config: QRConfiguration;
  onConfigUpdate: (updates: Partial<QRConfiguration>) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ config, onConfigUpdate }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateBackground = (updates: Partial<QRConfiguration['background']>) => {
    onConfigUpdate({
      background: {
        ...config.background,
        ...updates
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('qr-backgrounds')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('qr-backgrounds')
        .getPublicUrl(data.path);

      updateBackground({
        type: 'image',
        imageUrl: urlData.publicUrl
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const removeBackgroundImage = () => {
    updateBackground({
      type: 'solid',
      imageUrl: null
    });
  };

  const gradientDirections = [
    { value: 'to bottom', label: 'Vertical ↓' },
    { value: 'to top', label: 'Vertical ↑' },
    { value: 'to right', label: 'Horizontal →' },
    { value: 'to left', label: 'Horizontal ←' },
    { value: 'to bottom right', label: 'Diagonal ↘' },
    { value: 'to bottom left', label: 'Diagonal ↙' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
        Fondo
      </h3>

      {/* Background Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: '#161616' }}>
          Tipo de fondo
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'solid', label: 'Sólido' },
            { value: 'gradient', label: 'Degradado' },
            { value: 'image', label: 'Imagen' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => updateBackground({ type: type.value as 'solid' | 'gradient' | 'image' })}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: config.background.type === type.value ? '#075E54' : 'white',
                borderColor: config.background.type === type.value ? '#075E54' : 'rgb(209, 213, 219)',
                color: config.background.type === type.value ? 'white' : '#161616'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {config.background.type === 'solid' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Color de fondo
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={config.background.color}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-12 h-10 rounded-lg border cursor-pointer"
              style={{ borderColor: 'rgb(209, 213, 219)' }}
            />
            <input
              type="text"
              value={config.background.color}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Gradient */}
      {config.background.type === 'gradient' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Color inicial
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.background.gradientStartColor}
                onChange={(e) => updateBackground({ gradientStartColor: e.target.value })}
                className="w-12 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: 'rgb(209, 213, 219)' }}
              />
              <input
                type="text"
                value={config.background.gradientStartColor}
                onChange={(e) => updateBackground({ gradientStartColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Color final
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.background.gradientEndColor}
                onChange={(e) => updateBackground({ gradientEndColor: e.target.value })}
                className="w-12 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: 'rgb(209, 213, 219)' }}
              />
              <input
                type="text"
                value={config.background.gradientEndColor}
                onChange={(e) => updateBackground({ gradientEndColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="#f3f4f6"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Dirección
            </label>
            <select
              value={config.background.gradientDirection}
              onChange={(e) => updateBackground({ gradientDirection: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            >
              {gradientDirections.map((dir) => (
                <option key={dir.value} value={dir.value}>
                  {dir.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Image Upload */}
      {config.background.type === 'image' && (
        <div className="space-y-4">
          {config.background.imageUrl ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Imagen actual
              </label>
              <div className="relative rounded-lg border overflow-hidden" style={{ borderColor: 'rgb(209, 213, 219)' }}>
                <img
                  src={config.background.imageUrl}
                  alt="Background"
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={removeBackgroundImage}
                  className="absolute top-2 right-2 p-1 rounded-full transition-all duration-200"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Subir imagen
              </label>
              <label
                className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  backgroundColor: 'rgb(249, 250, 251)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#075E54';
                  e.currentTarget.style.backgroundColor = '#075E54' + '08';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                  e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                }}
              >
                <div className="flex flex-col items-center">
                  {isUploading ? (
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#075E54' }} />
                  ) : (
                    <>
                      <Upload size={24} style={{ color: 'rgb(107, 114, 128)' }} />
                      <p className="mt-2 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                        Click para subir imagen
                      </p>
                      <p className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>
                        PNG, JPG, WEBP hasta 5MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          )}

          {uploadError && (
            <div className="p-2 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
              {uploadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundControls;
