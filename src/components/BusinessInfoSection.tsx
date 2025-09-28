import React, { useState, useEffect } from 'react';
import { Save, X, Building2 } from 'lucide-react';
import { BusinessProfile } from '../hooks/useBusiness';

interface BusinessInfoSectionProps {
  profile: BusinessProfile;
  onBusinessUpdate: (updates: Partial<BusinessProfile>) => Promise<{ error: string | null }>;
  showMessage: (type: 'success' | 'error', text: string) => void;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ 
  profile, 
  onBusinessUpdate, 
  showMessage 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: ''
  });

  // Initialize data when profile loads
  useEffect(() => {
    if (profile) {
      setBusinessData({
        name: profile.name || '',
        description: profile.description || '',
        phone: profile.phone || '',
        email: profile.email || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessData({
      ...businessData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await onBusinessUpdate(businessData);
      if (error) {
        throw new Error(error);
      }

      setIsEditing(false);
      showMessage('success', 'Información del negocio actualizada correctamente');
    } catch (err: any) {
      console.error('Error saving business info:', err);
      showMessage('error', err.message || 'Error al guardar la información del negocio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    setBusinessData({
      name: profile.name || '',
      description: profile.description || '',
      phone: profile.phone || '',
      email: profile.email || '',
      website: profile.website || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Información del Negocio
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
            <Building2 size={14} />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#075E54',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Nombre del negocio
          </label>
          <input
            type="text"
            name="name"
            value={businessData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={businessData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={businessData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Sitio web
          </label>
          <input
            type="url"
            name="website"
            value={businessData.website}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
            }}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={businessData.description}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSection;