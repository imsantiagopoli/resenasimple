import React from 'react';
import { ArrowLeft, Facebook, Instagram, Globe, Music } from 'lucide-react';

interface AuthStep3Props {
  socialMedia: {
    facebook: string;
    instagram: string;
    website: string;
    tiktok: string;
  };
  setSocialMedia: React.Dispatch<React.SetStateAction<{
    facebook: string;
    instagram: string;
    website: string;
    tiktok: string;
  }>>;
  errors: any;
  isLoading: boolean;
  onSubmitWithSocials: (e: React.FormEvent) => void;
  onSubmitSkipSocials: () => void;
  onBack: () => void;
}

const AuthStep3: React.FC<AuthStep3Props> = ({
  socialMedia,
  setSocialMedia,
  errors,
  isLoading,
  onSubmitWithSocials,
  onSubmitSkipSocials,
  onBack
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'rgb(107, 114, 128)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgb(209, 213, 219)' }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgb(209, 213, 219)' }}
          />
          <div 
            className="w-6 h-2 rounded-full"
            style={{ backgroundColor: '#075E54' }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#161616' }}>
          Completa tus redes sociales
        </h2>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Opcional: Agrega tus redes sociales para mostrar en las páginas de votación
        </p>
      </div>

      <form onSubmit={onSubmitWithSocials} className="space-y-4">
        <div className="space-y-1">
          <label className="flex items-center space-x-3 text-sm font-medium" style={{ color: '#161616' }}>
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#1877f2' }}
            >
              <Facebook size={14} style={{ color: 'white' }} />
            </div>
            <span>Facebook</span>
          </label>
          <input
            type="url"
            value={socialMedia.facebook}
            onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.facebook ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="https://facebook.com/tu-restaurante"
          />
          {errors.facebook && (
            <p className="text-xs text-red-600">{errors.facebook}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-center space-x-3 text-sm font-medium" style={{ color: '#161616' }}>
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
              }}
            >
              <Instagram size={14} style={{ color: 'white' }} />
            </div>
            <span>Instagram</span>
          </label>
          <input
            type="url"
            value={socialMedia.instagram}
            onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.instagram ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="https://instagram.com/tu-restaurante"
          />
          {errors.instagram && (
            <p className="text-xs text-red-600">{errors.instagram}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-center space-x-3 text-sm font-medium" style={{ color: '#161616' }}>
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgb(107, 114, 128)' }}
            >
              <Globe size={14} style={{ color: 'white' }} />
            </div>
            <span>Sitio web</span>
          </label>
          <input
            type="url"
            value={socialMedia.website}
            onChange={(e) => setSocialMedia({ ...socialMedia, website: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.website ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="https://tu-restaurante.com"
          />
          {errors.website && (
            <p className="text-xs text-red-600">{errors.website}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-center space-x-3 text-sm font-medium" style={{ color: '#161616' }}>
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#000000' }}
            >
              <Music size={14} style={{ color: 'white' }} />
            </div>
            <span>TikTok</span>
          </label>
          <input
            type="url"
            value={socialMedia.tiktok}
            onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: errors.tiktok ? 'rgb(239, 68, 68)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            placeholder="https://tiktok.com/@tu-restaurante"
          />
          {errors.tiktok && (
            <p className="text-xs text-red-600">{errors.tiktok}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#075E54',
            color: 'white',
            border: '1px solid #075E54'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#064e45';
              e.currentTarget.style.borderColor = '#064e45';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#075E54';
              e.currentTarget.style.borderColor = '#075E54';
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Creando cuenta...</span>
            </div>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={onSubmitSkipSocials}
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'white',
          color: '#161616',
          borderColor: 'rgb(209, 213, 219)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'white';
          }
        }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
            <span>Creando cuenta...</span>
          </div>
        ) : (
          'Completar más tarde'
        )}
      </button>
    </>
  );
};

export default AuthStep3;