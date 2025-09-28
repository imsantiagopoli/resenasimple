import React, { useState, useEffect } from 'react';
import { Building2, Upload, Camera, Facebook, Instagram, Globe, Phone, Mail, MapPin, Save, X, Plus, Trash2, ExternalLink, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { useBusiness } from '../hooks/useBusiness';

const MiNegocioPage: React.FC = () => {
  const { 
    profile, 
    branches, 
    socialMedia, 
    loading, 
    error,
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    updateSocialMedia,
    generateSlug
  } = useBusiness();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: ''
  });

  const [socialMediaData, setSocialMediaData] = useState({
    facebook: '',
    instagram: '',
    website: '',
    tiktok: ''
  });

  const [branchesData, setBranchesData] = useState<any[]>([]);

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

  // Initialize social media data
  useEffect(() => {
    if (socialMedia) {
      const socialObj = socialMedia.reduce((acc, social) => {
        acc[social.platform] = social.url;
        return acc;
      }, {} as Record<string, string>);

      setSocialMediaData({
        facebook: socialObj.facebook || '',
        instagram: socialObj.instagram || '',
        website: socialObj.website || '',
        tiktok: socialObj.tiktok || ''
      });
    }
  }, [socialMedia]);

  // Initialize branches data
  useEffect(() => {
    if (branches) {
      setBranchesData(branches.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        isMain: branch.is_main,
        googleMapsLink: branch.google_maps_link || '',
        slug: branch.slug
      })));
    }
  }, [branches]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 5000);
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    
    try {
      // Update business profile
      const { error: profileError } = await updateBusinessProfile(businessData);
      if (profileError) {
        throw new Error(profileError);
      }

      // Update social media
      const { error: socialError } = await updateSocialMedia(socialMediaData);
      if (socialError) {
        throw new Error(socialError);
      }

      // Update branches
      for (const branch of branchesData) {
        const branchToSave = {
          ...branch,
          slug: branch.slug || generateSlug(branch.name)
        };
        
        const { error: branchError } = await upsertBranch(branchToSave);
        if (branchError) {
          throw new Error(branchError);
        }
      }

      setIsEditing(false);
      showMessage('success', 'Datos guardados correctamente');
    } catch (err: any) {
      console.error('Error saving data:', err);
      showMessage('error', err.message || 'Error al guardar los datos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBranch = () => {
    const newBranch = {
      id: null, // null for new branches
      name: 'Nueva Sucursal',
      address: '',
      phone: '',
      isMain: false,
      googleMapsLink: '',
      slug: ''
    };
    setBranchesData([...branchesData, newBranch]);
  };

  const handleRemoveBranch = async (index: number) => {
    const branch = branchesData[index];
    
    if (branch.id) {
      // Delete from database
      const { error } = await deleteBranch(branch.id);
      if (error) {
        showMessage('error', error);
        return;
      }
    }
    
    // Remove from local state
    setBranchesData(branchesData.filter((_, i) => i !== index));
  };

  const updateBranch = (index: number, field: string, value: string | boolean) => {
    const updatedBranches = [...branchesData];
    updatedBranches[index] = { ...updatedBranches[index], [field]: value };
    
    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      updatedBranches[index].slug = generateSlug(value);
    }
    
    setBranchesData(updatedBranches);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-yellow-600" />
            <p className="text-yellow-800">No se encontró información del negocio. Contacta al soporte.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: '#161616' }}>
            Mi Negocio
          </h1>
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            Gestiona la información, logo y sucursales de tu restaurante
          </p>
        </div>
        
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isEditing ? '#075E54' : 'white',
            color: isEditing ? 'white' : '#161616',
            border: isEditing ? '1px solid #075E54' : '1px solid rgb(209, 213, 219)'
          }}
          onMouseEnter={(e) => {
            if (!isEditing && !isSaving) {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditing && !isSaving) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>{isEditing ? <Save size={16} /> : <MapPin size={16} />}</>
          )}
          <span>{isSaving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Editar'}</span>
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div 
          className={`p-3 rounded-lg border text-sm ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {saveMessage.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Logo del Negocio
        </h2>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: 'rgb(209, 213, 219)', backgroundColor: 'rgb(249, 250, 251)' }}
            >
              <Building2 size={32} style={{ color: 'rgb(107, 114, 128)' }} />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: '#075E54', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#064e45'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#075E54'}
              >
                <Camera size={16} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium mb-2" style={{ color: '#161616' }}>
              Logo actual
            </p>
            <p className="text-xs mb-3" style={{ color: 'rgb(107, 114, 128)' }}>
              Recomendado: 400x400px, formato PNG o JPG
            </p>
            {isEditing && (
              <button className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
                style={{ color: '#075E54' }}
              >
                <Upload size={16} />
                <span>Subir nuevo logo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Información del Negocio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Nombre del negocio
            </label>
            <input
              type="text"
              value={businessData.name}
              onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
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
              value={businessData.phone}
              onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
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
              value={businessData.email}
              onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
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
              value={businessData.website}
              onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
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
              value={businessData.description}
              onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
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

      {/* Social Media */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
          Redes Sociales
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#1877f2' + '20' }}
            >
              <Facebook size={20} style={{ color: '#1877f2' }} />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.facebook}
                onChange={(e) => setSocialMediaData({...socialMediaData, facebook: e.target.value})}
                disabled={!isEditing}
                placeholder="https://facebook.com/tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.facebook && (
              <a 
                href={socialMediaData.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#E4405F' + '20' }}
            >
              <Instagram size={20} style={{ color: '#E4405F' }} />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.instagram}
                onChange={(e) => setSocialMediaData({...socialMediaData, instagram: e.target.value})}
                disabled={!isEditing}
                placeholder="https://instagram.com/tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.instagram && (
              <a 
                href={socialMediaData.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#ffffff' }}
            >
              <Globe size={20} style={{ color: '#6b7280' }} />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.website}
                onChange={(e) => setSocialMediaData({...socialMediaData, website: e.target.value})}
                disabled={!isEditing}
                placeholder="https://tu-restaurante.com"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.website && (
              <a 
                href={socialMediaData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#ffffff' }}
            >
              <Music size={20} style={{ color: '#000000' }} />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.tiktok}
                onChange={(e) => setSocialMediaData({...socialMediaData, tiktok: e.target.value})}
                disabled={!isEditing}
                placeholder="https://tiktok.com/@tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.tiktok && (
              <a 
                href={socialMediaData.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Branches */}
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Sucursales
          </h2>
          {isEditing && (
            <button
              onClick={handleAddBranch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: '#075E54' + '20',
                color: '#075E54',
                border: '1px solid #075E54' + '30'
              }}
            >
              <Plus size={14} />
              <span>Agregar Sucursal</span>
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {branchesData.map((branch, index) => (
            <div 
              key={branch.id || index}
              className="p-4 rounded-lg border transition-all duration-200"
              style={{ 
                borderColor: 'rgb(229, 231, 235)',
                backgroundColor: 'rgb(249, 250, 251)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: branch.isMain ? '#075E54' : 'rgb(107, 114, 128)' }}
                  >
                    <Building2 size={16} style={{ color: 'white' }} />
                  </div>
                  {branch.isMain && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: '#075E54' + '20',
                        color: '#075E54'
                      }}
                    >
                      Principal
                    </span>
                  )}
                </div>
                
                {isEditing && !branch.isMain && (
                  <button
                    onClick={() => handleRemoveBranch(index)}
                    className="p-1 rounded transition-colors duration-200"
                    style={{ color: 'rgb(107, 114, 128)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                      e.currentTarget.style.color = 'rgb(239, 68, 68)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(107, 114, 128)';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => updateBranch(index, 'name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                      backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={branch.phone}
                    onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                      backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                    }}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={branch.address}
                    onChange={(e) => updateBranch(index, 'address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616',
                      backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                    }}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-medium" style={{ color: 'rgb(107, 114, 128)' }}>
                    Link de Google Maps
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={branch.googleMapsLink}
                      onChange={(e) => updateBranch(index, 'googleMapsLink', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://maps.google.com/place/..."
                      className="flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{
                        borderColor: 'rgb(209, 213, 219)',
                        color: '#161616',
                        backgroundColor: isEditing ? 'white' : 'rgb(243, 244, 246)'
                      }}
                    />
                    {!isEditing && branch.googleMapsLink && (
                      <a 
                        href={branch.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                        title="Abrir en Google Maps"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiNegocioPage;