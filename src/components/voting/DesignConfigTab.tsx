import React, { useEffect } from 'react';
import { Instagram, Linkedin, Twitter, Youtube, Globe, RotateCcw, Facebook, AlertCircle } from 'lucide-react';
import { VotingConfiguration } from '../../hooks/useVotingConfig';
import { useFonts } from '../../hooks/useFonts';

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
}

interface DesignConfigTabProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
  hasChanges: boolean;
  onResetToDefaults: () => void;
  businessProfile: BusinessProfile | null;
}

const DesignConfigTab: React.FC<DesignConfigTabProps> = ({ config, onConfigUpdate, hasChanges, onResetToDefaults, businessProfile }) => {
  const { fonts, loadMultipleFonts } = useFonts();

  useEffect(() => {
    if (config.typography) {
      loadMultipleFonts([config.typography.primaryFont, config.typography.secondaryFont]);
    }
  }, [config.typography?.primaryFont, config.typography?.secondaryFont]);
  // Helper function to update design properties
  const updateDesign = (updates: Partial<VotingConfiguration['design']>) => {
    onConfigUpdate({
      design: {
        ...config.design,
        ...updates
      }
    });
  };

  // Helper function to update typography properties
  const updateTypography = (updates: Partial<VotingConfiguration['typography']>) => {
    onConfigUpdate({
      typography: {
        ...config.typography,
        ...updates
      }
    });
  };

  // Helper function to update colors properties
  const updateColors = (updates: Partial<VotingConfiguration['colors']>) => {
    onConfigUpdate({
      colors: {
        ...config.colors,
        ...updates
      }
    });
  };

  const TikTokIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
        stroke="rgb(107, 114, 128)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    tiktok: TikTokIcon,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    website: Globe
  };

  const socialLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    twitter: 'Twitter/X',
    youtube: 'YouTube',
    website: 'Sitio web'
  };

  const getSocialUrlStatus = (platform: string): boolean => {
    if (!businessProfile) return false;
    switch (platform) {
      case 'facebook': return !!businessProfile.facebook_url;
      case 'instagram': return !!businessProfile.instagram_url;
      case 'tiktok': return !!businessProfile.tiktok_url;
      case 'linkedin': return !!businessProfile.linkedin_url;
      case 'twitter': return !!businessProfile.twitter_url;
      case 'youtube': return !!businessProfile.youtube_url;
      case 'website': return !!businessProfile.website_url;
      default: return false;
    }
  };

  const hasAnySocialUrl = Object.keys(socialIcons).some(platform => getSocialUrlStatus(platform));
  const missingUrls = Object.keys(socialIcons).filter(platform => !getSocialUrlStatus(platform));

  return (
    <div className="p-6 space-y-8">
      {/* Mensaje Principal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Mensaje Principal
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Encabezado
            </label>
            <textarea
              value={config.design.message.headline}
              onChange={(e) => updateDesign({
                message: { ...config.design.message, headline: e.target.value }
              })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Cuerpo
            </label>
            <textarea
              value={config.design.message.body}
              onChange={(e) => updateDesign({
                message: { ...config.design.message, body: e.target.value }
              })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      {/* Logo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Logo
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.design.showLogo}
              onChange={(e) => updateDesign({ showLogo: e.target.checked })}
              className="rounded border-gray-300 focus:ring-2"
              style={{ accentColor: '#075E54' }}
            />
            <span className="text-sm font-medium" style={{ color: '#161616' }}>
              Mostrar logo del restaurante
            </span>
          </label>
          
          {config.design.showLogo && (
            <div className="ml-6 space-y-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                  Mostrar logo en
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="logoDisplayPages"
                      value="all"
                      checked={config.design.logoDisplayPages === 'all'}
                      onChange={(e) => updateDesign({ logoDisplayPages: e.target.value as 'all' | 'voting-only' })}
                      className="focus:ring-2"
                      style={{ accentColor: '#075E54' }}
                    />
                    <span className="text-sm" style={{ color: '#161616' }}>Todas las páginas</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="logoDisplayPages"
                      value="voting-only"
                      checked={config.design.logoDisplayPages === 'voting-only'}
                      onChange={(e) => updateDesign({ logoDisplayPages: e.target.value as 'all' | 'voting-only' })}
                      className="focus:ring-2"
                      style={{ accentColor: '#075E54' }}
                    />
                    <span className="text-sm" style={{ color: '#161616' }}>Solo en página de votación</span>
                  </label>
                </div>
              </div>
              
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Forma del logo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoShape"
                    value="circular"
                    checked={config.design.logoShape === 'circular'}
                    onChange={(e) => updateDesign({ logoShape: e.target.value as 'circular' | 'square' })}
                    className="focus:ring-2"
                    style={{ accentColor: '#075E54' }}
                  />
                  <span className="text-sm" style={{ color: '#161616' }}>Circular</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoShape"
                    value="square"
                    checked={config.design.logoShape === 'square'}
                    onChange={(e) => updateDesign({ logoShape: e.target.value as 'circular' | 'square' })}
                    className="focus:ring-2"
                    style={{ accentColor: '#075E54' }}
                  />
                  <span className="text-sm" style={{ color: '#161616' }}>Cuadrado</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      {/* Tipografía */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Tipografía
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Fuente Principal (Headline)
            </label>
            <select
              value={config.typography.primaryFont}
              onChange={(e) => updateTypography({ primaryFont: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
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
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Fuente Secundaria (Cuerpo)
            </label>
            <select
              value={config.typography.secondaryFont}
              onChange={(e) => updateTypography({ secondaryFont: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
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
        </div>
        
        <div 
          className="p-3 rounded-lg text-xs"
          style={{ 
            backgroundColor: 'rgb(249, 250, 251)',
            color: 'rgb(107, 114, 128)'
          }}
        >
          <strong>Vista previa:</strong> Los cambios se reflejan inmediatamente en el panel derecho
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      
      {/* Colores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Colores
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Color de Botones
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.colors.buttonColor}
                onChange={(e) => updateColors({ buttonColor: e.target.value })}
                className="w-12 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: 'rgb(209, 213, 219)' }}
              />
              <input
                type="text"
                value={config.colors.buttonColor}
                onChange={(e) => updateColors({ buttonColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
                placeholder="#075E54"
              />
            </div>
          </div>
        </div>
        
        <div 
          className="p-3 rounded-lg text-xs"
          style={{ 
            backgroundColor: 'rgb(249, 250, 251)',
            color: 'rgb(107, 114, 128)'
          }}
        >
          <strong>Vista previa:</strong> Los cambios se reflejan inmediatamente en el panel derecho
        </div>
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      
      {/* Etiquetas de Estrellas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Etiquetas de Estrellas
        </h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.design.starLabels.enabled}
            onChange={(e) => updateDesign({
              starLabels: { ...config.design.starLabels, enabled: e.target.checked }
            })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Mostrar etiquetas debajo de las estrellas
          </span>
        </label>

        {config.design.starLabels.enabled && (
          <div className="space-y-3 ml-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="w-16 text-sm" style={{ color: '#161616' }}>
                  {star} estrella{star > 1 ? 's' : ''}
                </span>
                <input
                  type="text"
                  value={
                    config.design.starLabels.labels[star as keyof typeof config.design.starLabels.labels]
                  }
                  onChange={(e) => {
                    updateDesign({
                      starLabels: {
                        ...config.design.starLabels,
                        labels: {
                          ...config.design.starLabels.labels,
                          [star]: e.target.value
                        }
                      }
                    });
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                  style={{
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      {/* Oferta Especial */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Oferta Especial
        </h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.design.specialOffer.enabled}
            onChange={(e) => updateDesign({
              specialOffer: { ...config.design.specialOffer, enabled: e.target.checked }
            })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Activar oferta en la página
          </span>
        </label>

        {config.design.specialOffer.enabled && (
          <div className="space-y-4 ml-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Headline
              </label>
              <input
                type="text"
                value={config.design.specialOffer.headline}
                onChange={(e) => updateDesign({
                  specialOffer: { ...config.design.specialOffer, headline: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Body
              </label>
              <textarea
                value={config.design.specialOffer.body}
                onChange={(e) => updateDesign({
                  specialOffer: { ...config.design.specialOffer, body: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 resize-none"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.design.specialOffer.color}
                  onChange={(e) => updateDesign({
                    specialOffer: { ...config.design.specialOffer, color: e.target.value }
                  })}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: 'rgb(209, 213, 219)' }}
                />
                <input
                  type="text"
                  value={config.design.specialOffer.color}
                  onChange={(e) => updateDesign({
                    specialOffer: { ...config.design.specialOffer, color: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200"
                  style={{
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                  placeholder="#075E54"
                />
              </div>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Se aplica al texto, borde y fondo con transparencia
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Separador */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }} />
      {/* Redes Sociales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Redes Sociales
        </h3>

        <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
          Selecciona qué redes sociales mostrar al pie de la página. Los enlaces se configuran en "Mi Negocio".
        </p>

        {!hasAnySocialUrl && (
          <div
            className="p-4 rounded-lg border flex items-start space-x-3"
            style={{
              backgroundColor: '#fef3c7',
              borderColor: '#fde047'
            }}
          >
            <AlertCircle size={20} style={{ color: '#ca8a04', flexShrink: 0, marginTop: '2px' }} />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: '#854d0e' }}>
                No hay enlaces configurados
              </p>
              <p className="text-xs" style={{ color: '#a16207' }}>
                Para mostrar iconos de redes sociales, primero debes agregar los enlaces en la sección "Mi Negocio".
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(socialIcons).map(([key, Icon]) => {
            const hasUrl = getSocialUrlStatus(key);
            const isChecked = config.design.socials[key as keyof typeof config.design.socials];

            return (
              <label
                key={key}
                className={`flex items-center space-x-3 ${hasUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked && hasUrl}
                  disabled={!hasUrl}
                  onChange={(e) => {
                    if (hasUrl) {
                      updateDesign({
                        socials: {
                          ...config.design.socials,
                          [key]: e.target.checked
                        }
                      });
                    }
                  }}
                  className="rounded border-gray-300 focus:ring-2"
                  style={{ accentColor: '#075E54' }}
                />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgb(243, 244, 246)' }}
                >
                  <Icon size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#161616' }}>
                  {socialLabels[key as keyof typeof socialLabels]}
                </span>
              </label>
            );
          })}
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
};

export default DesignConfigTab;