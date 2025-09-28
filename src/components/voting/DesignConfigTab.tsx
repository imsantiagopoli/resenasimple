import React from 'react';
import { Eye, EyeOff, Instagram, Music, Linkedin, Twitter, Youtube, Globe, Building2 } from 'lucide-react';
import { VotingConfiguration } from '../../hooks/useVotingConfig';

interface DesignConfigTabProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
}

const DesignConfigTab: React.FC<DesignConfigTabProps> = ({ config, onConfigUpdate }) => {

  const socialIcons = {
    instagram: Instagram,
    tiktok: Music,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    website: Globe
  };

  const socialLabels = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    twitter: 'Twitter/X',
    youtube: 'YouTube',
    website: 'Sitio web'
  };

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
              checked={config.mostrar_logo}
              onChange={(e) => onConfigUpdate({ mostrar_logo: e.target.checked })}
              className="rounded border-gray-300 focus:ring-2"
              style={{ accentColor: '#075E54' }}
            />
            <span className="text-sm font-medium" style={{ color: '#161616' }}>
              Mostrar logo del restaurante
            </span>
          </label>
          
          {config.mostrar_logo && (
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
                      checked={config.mostrar_logo_en === 'all'}
                      onChange={(e) => onConfigUpdate({ mostrar_logo_en: e.target.value as 'all' | 'voting-only' })}
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
                      checked={config.mostrar_logo_en === 'voting-only'}
                      onChange={(e) => onConfigUpdate({ mostrar_logo_en: e.target.value as 'all' | 'voting-only' })}
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
                    checked={config.forma_logo === 'circular'}
                    onChange={(e) => onConfigUpdate({ forma_logo: e.target.value as 'circular' | 'square' })}
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
                    checked={config.forma_logo === 'square'}
                    onChange={(e) => onConfigUpdate({ forma_logo: e.target.value as 'circular' | 'square' })}
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
              value={config.tipografia_principal}
              onChange={(e) => onConfigUpdate({ tipografia_principal: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            >
              <option value="Cabinet Grotesk">Cabinet Grotesk (Actual)</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: '#161616' }}>
              Fuente Secundaria (Cuerpo)
            </label>
            <select
              value={config.tipografia_secundaria}
              onChange={(e) => onConfigUpdate({ tipografia_secundaria: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200"
              style={{
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616',
                backgroundColor: 'white'
              }}
            >
              <option value="Cabinet Grotesk">Cabinet Grotesk (Actual)</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Tahoma">Tahoma</option>
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
                value={config.color_botones}
                onChange={(e) => onConfigUpdate({ color_botones: e.target.value })}
                className="w-12 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: 'rgb(209, 213, 219)' }}
              />
              <input
                type="text"
                value={config.color_botones}
                onChange={(e) => onConfigUpdate({ color_botones: e.target.value })}
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
            checked={config.mostrar_etiquetas_estrellas}
            onChange={(e) => onConfigUpdate({ mostrar_etiquetas_estrellas: e.target.checked })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Mostrar etiquetas debajo de las estrellas
          </span>
        </label>

        {config.mostrar_etiquetas_estrellas && (
          <div className="space-y-3 ml-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="w-16 text-sm" style={{ color: '#161616' }}>
                  {star} estrella{star > 1 ? 's' : ''}
                </span>
                <input
                  type="text"
                  value={
                    star === 1 ? config.etiqueta_1_estrella :
                    star === 2 ? config.etiqueta_2_estrellas :
                    star === 3 ? config.etiqueta_3_estrellas :
                    star === 4 ? config.etiqueta_4_estrellas :
                    config.etiqueta_5_estrellas
                  }
                  onChange={(e) => {
                    const fieldName = 
                      star === 1 ? 'etiqueta_1_estrella' :
                      star === 2 ? 'etiqueta_2_estrellas' :
                      star === 3 ? 'etiqueta_3_estrellas' :
                      star === 4 ? 'etiqueta_4_estrellas' :
                      'etiqueta_5_estrellas';
                    onConfigUpdate({ [fieldName]: e.target.value });
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
            checked={config.oferta_especial_activa}
            onChange={(e) => onConfigUpdate({ oferta_especial_activa: e.target.checked })}
            className="rounded border-gray-300 focus:ring-2"
            style={{ accentColor: '#075E54' }}
          />
          <span className="text-sm font-medium" style={{ color: '#161616' }}>
            Activar oferta en la página
          </span>
        </label>

        {config.oferta_especial_activa && (
          <div className="space-y-4 ml-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: '#161616' }}>
                Headline
              </label>
              <input
                type="text"
                value={config.oferta_especial_titulo}
                onChange={(e) => onConfigUpdate({ oferta_especial_titulo: e.target.value })}
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
                value={config.cuerpo}
                onChange={(e) => onConfigUpdate({ cuerpo: e.target.value })}
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
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
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(socialIcons).map(([key, Icon]) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  key === 'instagram' ? config.mostrar_instagram :
                  key === 'tiktok' ? config.mostrar_tiktok :
                  key === 'linkedin' ? config.mostrar_linkedin :
                  key === 'twitter' ? config.mostrar_twitter :
                  key === 'youtube' ? config.mostrar_youtube :
                  config.mostrar_website
                }
                onChange={(e) => {
                  const fieldName = 
                    key === 'instagram' ? 'mostrar_instagram' :
                    key === 'tiktok' ? 'mostrar_tiktok' :
                    key === 'linkedin' ? 'mostrar_linkedin' :
                    key === 'twitter' ? 'mostrar_twitter' :
                    key === 'youtube' ? 'mostrar_youtube' :
                    'mostrar_website';
                  onConfigUpdate({ [fieldName]: e.target.checked });
                }}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignConfigTab;