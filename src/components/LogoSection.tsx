import React, { useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BusinessProfile } from '../hooks/useBusiness';

interface LogoSectionProps {
  profile: BusinessProfile;
  onLogoUpdate: (logoUrl: string) => Promise<{ error: string | null }>;
  showMessage: (type: 'success' | 'error', text: string) => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ profile, onLogoUpdate, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Función para manejar la selección del archivo de logo
  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showMessage('error', 'El archivo debe ser menor a 2MB');
        return;
      }
      
      setLogoFile(file);
      
      // Crear preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir logo a Supabase Storage
  const uploadLogo = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${profile.id}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('business-logos')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading logo:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSaveLogo = async () => {
    if (!logoFile) {
      showMessage('error', 'No hay logo seleccionado para guardar');
      return;
    }

    setIsSaving(true);
    
    try {
      const uploadedLogoUrl = await uploadLogo(logoFile);
      if (!uploadedLogoUrl) {
        throw new Error('Error al subir el logo');
      }
      
      const { error } = await onLogoUpdate(uploadedLogoUrl);
      if (error) {
        throw new Error(error);
      }

      // Reset estados
      setIsEditing(false);
      setLogoFile(null);
      setLogoPreview(null);
      
      showMessage('success', 'Logo actualizado correctamente');
    } catch (err: any) {
      console.error('Error saving logo:', err);
      showMessage('error', err.message || 'Error al guardar el logo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Logo del Negocio
        </h2>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: 'white',
              color: '#161616',
              border: '1px solid rgb(209, 213, 219)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Camera size={14} />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveLogo}
              disabled={!logoFile || isSaving}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#075E54',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                if (!isSaving && logoFile) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving && logoFile) {
                  e.currentTarget.style.backgroundColor = '#075E54';
                }
              }}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50"
              style={{
                backgroundColor: 'white',
                color: '#161616',
                border: '1px solid rgb(209, 213, 219)'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <X size={14} />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          {/* Logo Preview */}
          {logoPreview || profile?.logo_url ? (
            <div 
              className="w-24 h-24 rounded-lg border-2 overflow-hidden"
              style={{ borderColor: 'rgb(209, 213, 219)' }}
            >
              <img
                src={logoPreview || profile.logo_url || ''}
                alt="Logo del negocio"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: 'rgb(209, 213, 219)', backgroundColor: 'rgb(249, 250, 251)' }}
            >
              <ImageIcon size={32} style={{ color: 'rgb(107, 114, 128)' }} />
            </div>
          )}
          
          {/* Camera Button - Solo en modo edición */}
          {isEditing && (
            <label 
              htmlFor="logo-upload"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ backgroundColor: '#075E54', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064e45'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#075E54'}
            >
              <Camera size={16} />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
            </label>
          )}
          
          {/* Indicador de archivo nuevo */}
          {logoFile && (
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: '#10b981' }}
              title="Nuevo logo seleccionado"
            />
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium mb-2" style={{ color: '#161616' }}>
            Logo actual
          </p>
          <p className="text-xs mb-3" style={{ color: 'rgb(107, 114, 128)' }}>
            Recomendado: 400x400px, formato PNG o JPG, máximo 2MB
          </p>
          {isEditing && (
            <label
              htmlFor="logo-upload"
              className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
              style={{ color: '#075E54' }}
            >
              <Upload size={16} />
              <span>{logoFile ? 'Cambiar logo' : 'Subir nuevo logo'}</span>
            </label>
          )}
          
          {logoFile && (
            <p className="text-xs mt-2 text-green-600 font-medium">
              ✓ Nuevo logo seleccionado: {logoFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoSection;