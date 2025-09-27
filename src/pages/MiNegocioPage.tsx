import React, { useState } from 'react';
import { Building2, Upload, Camera, Facebook, Instagram, Globe, Phone, Mail, MapPin, CreditCard as Edit, Save, X, Plus, Trash2, ExternalLink, Music } from 'lucide-react';

const MiNegocioPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: 'Pizzería Napolitana',
    description: 'Auténtica pizza napolitana con ingredientes frescos importados de Italia.',
    phone: '+54 11 4567-8901',
    email: 'info@pizzerianapolitana.com',
    website: 'www.pizzerianapolitana.com'
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/pizzerianapolitana',
    instagram: 'https://instagram.com/pizzerianapolitana',
    website: 'https://pizzerianapolitana.com',
    tiktok: 'https://tiktok.com/@pizzerianapolitana'
  });

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Sucursal Centro',
      address: 'Av. Corrientes 1234, Buenos Aires',
      phone: '+54 11 4567-8901',
      isMain: true,
      googleMapsLink: 'https://maps.google.com/place/Av.+Corrientes+1234+Buenos+Aires'
    },
    {
      id: 2,
      name: 'Sucursal Palermo',
      address: 'Thames 456, Palermo, Buenos Aires',
      phone: '+54 11 4567-8902',
      isMain: false,
      googleMapsLink: 'https://maps.google.com/place/Thames+456+Palermo+Buenos+Aires'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Datos guardados:', { businessData, socialMedia, branches });
  };

  const handleAddBranch = () => {
    const newBranch = {
      id: branches.length + 1,
      name: 'Nueva Sucursal',
      address: '',
      phone: '',
      isMain: false,
      googleMapsLink: ''
    };
    setBranches([...branches, newBranch]);
  };

  const handleRemoveBranch = (id: number) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const updateBranch = (id: number, field: string, value: string | boolean) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
  };

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
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none"
          style={{
            backgroundColor: isEditing ? '#075E54' : 'white',
            color: isEditing ? 'white' : '#161616',
            border: isEditing ? '1px solid #075E54' : '1px solid rgb(209, 213, 219)'
          }}
          onMouseEnter={(e) => {
            if (!isEditing) {
              e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditing) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          {isEditing ? <Save size={16} /> : <Edit size={16} />}
          <span>{isEditing ? 'Guardar Cambios' : 'Editar'}</span>
        </button>
      </div>

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
                value={socialMedia.facebook}
                onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
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
            {!isEditing && socialMedia.facebook && (
              <a 
                href={socialMedia.facebook} 
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
                value={socialMedia.instagram}
                onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
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
            {!isEditing && socialMedia.instagram && (
              <a 
                href={socialMedia.instagram} 
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
                value={socialMedia.website}
                onChange={(e) => setSocialMedia({...socialMedia, website: e.target.value})}
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
            {!isEditing && socialMedia.website && (
              <a 
                href={socialMedia.website} 
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
                value={socialMedia.tiktok}
                onChange={(e) => setSocialMedia({...socialMedia, tiktok: e.target.value})}
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
            {!isEditing && socialMedia.tiktok && (
              <a 
                href={socialMedia.tiktok} 
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
          {branches.map((branch) => (
            <div 
              key={branch.id}
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
                    onClick={() => handleRemoveBranch(branch.id)}
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
                    onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
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
                    onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
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
                    onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
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
                      onChange={(e) => updateBranch(branch.id, 'googleMapsLink', e.target.value)}
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