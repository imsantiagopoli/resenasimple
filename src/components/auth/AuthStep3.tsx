import React from 'react';
import { Instagram, Music, Globe, ChevronLeft } from 'lucide-react';

interface AuthStep3Props {
  formData: {
    socialMedia: {
      facebook: string;
      instagram: string;
      website: string;
      tiktok: string;
    };
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
  onBack: () => void;
}

const AuthStep3: React.FC<AuthStep3Props> = ({
  formData,
  setFormData,
  errors,
  loading,
  onSubmit,
  onSkip,
  onBack
}) => {
  const updateSocialMedia = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value
      }
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200 mb-6"
        style={{ color: '#075E54' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#064e45'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#075E54'}
      >
        <ChevronLeft size={16} />
        <span>Volver</span>
      </button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#1877f2' + '20' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
          >
            <Instagram size={20} color="white" />
          </div>
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#6b7280' + '20' }}
          >
            <Globe size={20} style={{ color: '#6b7280' }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#161616' }}>
          Redes Sociales
        </h1>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Conecta tus redes sociales para que los clientes puedan encontrarte (opcional)
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Facebook */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#161616' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </label>
          <input
            type="url"
            value={formData.socialMedia.facebook}
            onChange={(e) => updateSocialMedia('facebook', e.target.value)}
            className={`w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
              errors['socialMedia.facebook'] ? 'border-red-300 bg-red-50' : ''
            }`}
            style={{
              borderColor: errors['socialMedia.facebook'] ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: errors['socialMedia.facebook'] ? 'rgb(254, 242, 242)' : 'white'
            }}
            placeholder="https://facebook.com/tu-restaurante"
          />
          {errors['socialMedia.facebook'] && (
            <p className="text-xs text-red-600 mt-1">{errors['socialMedia.facebook']}</p>
          )}
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#161616' }}>
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
              <Instagram size={12} color="white" />
            </div>
            <span>Instagram</span>
          </label>
          <input
            type="url"
            value={formData.socialMedia.instagram}
            onChange={(e) => updateSocialMedia('instagram', e.target.value)}
            className={`w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
              errors['socialMedia.instagram'] ? 'border-red-300 bg-red-50' : ''
            }`}
            style={{
              borderColor: errors['socialMedia.instagram'] ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: errors['socialMedia.instagram'] ? 'rgb(254, 242, 242)' : 'white'
            }}
            placeholder="https://instagram.com/tu-restaurante"
          />
          {errors['socialMedia.instagram'] && (
            <p className="text-xs text-red-600 mt-1">{errors['socialMedia.instagram']}</p>
          )}
        </div>

        {/* Website */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#161616' }}>
            <Globe size={16} style={{ color: '#6b7280' }} />
            <span>Sitio Web</span>
          </label>
          <input
            type="url"
            value={formData.socialMedia.website}
            onChange={(e) => updateSocialMedia('website', e.target.value)}
            className={`w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
              errors['socialMedia.website'] ? 'border-red-300 bg-red-50' : ''
            }`}
            style={{
              borderColor: errors['socialMedia.website'] ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: errors['socialMedia.website'] ? 'rgb(254, 242, 242)' : 'white'
            }}
            placeholder="https://tu-restaurante.com"
          />
          {errors['socialMedia.website'] && (
            <p className="text-xs text-red-600 mt-1">{errors['socialMedia.website']}</p>
          )}
        </div>

        {/* TikTok */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#161616' }}>
            <div 
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: '#000000' }}
            >
              <Music size={12} color="white" />
            </div>
            <span>TikTok</span>
          </label>
          <input
            type="url"
            value={formData.socialMedia.tiktok}
            onChange={(e) => updateSocialMedia('tiktok', e.target.value)}
            className={`w-full px-3 py-3 rounded-lg border text-sm transition-all duration-200 ${
              errors['socialMedia.tiktok'] ? 'border-red-300 bg-red-50' : ''
            }`}
            style={{
              borderColor: errors['socialMedia.tiktok'] ? 'rgb(252, 165, 165)' : 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: errors['socialMedia.tiktok'] ? 'rgb(254, 242, 242)' : 'white'
            }}
            placeholder="https://tiktok.com/@tu-restaurante"
          />
          {errors['socialMedia.tiktok'] && (
            <p className="text-xs text-red-600 mt-1">{errors['socialMedia.tiktok']}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{
              backgroundColor: '#075E54',
              color: 'white',
              border: '1px solid #075E54'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#064e45';
                e.currentTarget.style.borderColor = '#064e45';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#075E54';
                e.currentTarget.style.borderColor = '#075E54';
              }
            }}
          >
            {loading && (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            <span>Crear Cuenta</span>
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-base border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'white',
              color: '#161616',
              borderColor: 'rgb(209, 213, 219)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
                e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
              }
            }}
          >
            Completar más tarde
          </button>
        </div>
      </form>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#075E54' }}
        />
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#075E54' }}
        />
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#075E54' }}
        />
      </div>
    </div>
  );
};

export default AuthStep3;