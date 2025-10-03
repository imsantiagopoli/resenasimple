import React, { useState } from 'react';
import { Star, Building2, Instagram, Linkedin, Twitter, Youtube, Globe, Facebook } from 'lucide-react';
import { VotingConfiguration } from '../../hooks/useVotingConfig';
import { BusinessProfile } from '../../contexts/DataContext';

// Function to calculate if text should be white or black based on background color
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

interface VotingPagePreviewProps {
  config: VotingConfiguration;
  viewType: 'voting' | 'private-feedback' | 'public-review' | 'private-thanks';
  businessProfile: BusinessProfile | null;
}

const VotingPagePreview: React.FC<VotingPagePreviewProps> = ({ config, viewType, businessProfile }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);

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

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return '#1877f2';
      case 'instagram': return '#E4405F';
      case 'tiktok': return '#000000';
      case 'linkedin': return '#0077B5';
      case 'twitter': return '#1DA1F2';
      case 'youtube': return '#FF0000';
      case 'website': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const shouldShowLogo = (viewType: string) => {
    if (!config.design.showLogo) return false;
    if (config.design.logoDisplayPages === 'all') return true;
    if (config.design.logoDisplayPages === 'voting-only' && viewType === 'voting') return true;
    return false;
  };

  const renderLogo = () => {
    if (businessProfile?.logo_url) {
      return (
        <img
          src={businessProfile.logo_url}
          alt="Logo"
          className="object-cover"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: config.design.logoShape === 'circular' ? '50%' : '8px'
          }}
        />
      );
    }

    return (
      <div
        className={`w-20 h-20 flex items-center justify-center ${
          config.design.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
        }`}
        style={{ backgroundColor: '#075E54' + '20' }}
      >
        <Building2 size={32} style={{ color: '#075E54' }} />
      </div>
    );
  };

  const renderSocialIcons = () => {
    const activeSocials = Object.entries(config.design.socials)
      .filter(([key, value]) => value === true);

    if (activeSocials.length === 0) return null;

    return (
      <div className="flex items-center justify-center space-x-4 pt-6">
        {activeSocials.map(([platform]) => {
          const Icon = socialIcons[platform as keyof typeof socialIcons];
          if (!Icon) return null;
          
          return (
            <button
              key={platform}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: 'rgb(243, 244, 246)' }}
            >
              <Icon size={18} style={{ color: 'rgb(107, 114, 128)' }} />
            </button>
          );
        })}
      </div>
    );
  };

  const renderVotingPage = () => (
    <div className="min-h-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-12 py-12">
        {/* Logo */}
        {shouldShowLogo('voting') && (
          <div className="flex justify-center mb-8">
            {renderLogo()}
          </div>
        )}

        {/* Message */}
        <div className="text-center mb-8 space-y-3">
          <h1 
            className="text-2xl font-bold leading-tight" 
            style={{ 
              color: '#161616',
              fontFamily: config.typography.primaryFont
            }}
          >
            {config.design.message.headline}
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont
            }}
          >
            {config.design.message.body}
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center mb-6 relative">
          <div className="flex items-center space-x-2 relative">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="relative"
              >
                <button
                  onMouseEnter={() => setHoveredStars(star)}
                  onMouseLeave={() => setHoveredStars(0)}
                  onClick={() => setSelectedStars(star)}
                  className="p-2 transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors duration-200 ${
                      star <= (hoveredStars || selectedStars)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
                
                {config.design.starLabels.enabled && hoveredStars === star && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                    <div 
                      className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border"
                      style={{ 
                        backgroundColor: '#161616',
                        color: 'white',
                        borderColor: 'rgb(75, 85, 99)'
                      }}
                    >
                      {config.design.starLabels.labels[star as keyof typeof config.design.starLabels.labels]}
                      {/* Tooltip Arrow */}
                      <div 
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                        style={{ borderTopColor: '#161616' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Special Offer */}
        {config.design.specialOffer.enabled && (
          <div
            className="mx-auto max-w-md p-6 rounded-lg border text-center mb-6"
            style={{
              backgroundColor: config.design.specialOffer.color + '08',
              borderColor: config.design.specialOffer.color + '30'
            }}
          >
            <h3 className="font-bold mb-2" style={{ color: config.design.specialOffer.color }}>
              {config.design.specialOffer.headline}
            </h3>
            <p className="text-sm" style={{ color: config.design.specialOffer.color }}>
              {config.design.specialOffer.body}
            </p>
          </div>
        )}

        {/* Social Icons */}
        {renderSocialIcons()}
      </div>
    </div>
  );

  const renderPrivateFeedback = () => (
    <div className="min-h-full bg-white flex flex-col justify-center px-12 py-12">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Logo */}
        {shouldShowLogo('private-feedback') && (
          <div className="flex justify-center mb-8">
            {renderLogo()}
          </div>
        )}
        
        <div className="space-y-3">
          <h2
            className="text-2xl font-bold"
            style={{
              color: '#161616',
              fontFamily: config.typography.primaryFont
            }}
          >
            {config.logic.privateWorkflow.title}
          </h2>

          <p
            className="text-base"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont
            }}
          >
            {config.logic.privateWorkflow.feedbackMessage}
          </p>
        </div>

        {/* Campos adicionales */}
        {(config.logic.privateWorkflow.collectName || config.logic.privateWorkflow.collectPhone || config.logic.privateWorkflow.collectEmail) && (
          <div className="space-y-4">
            {config.logic.privateWorkflow.collectName && (
              <input
                type="text"
                placeholder={`Nombre${config.logic.privateWorkflow.nameRequired ? ' *' : ''}`}
                required={config.logic.privateWorkflow.nameRequired}
                className="w-full px-3 py-3 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            )}
            
            {config.logic.privateWorkflow.collectEmail && (
              <input
                type="email"
                placeholder={`Email${config.logic.privateWorkflow.emailRequired ? ' *' : ''}`}
                required={config.logic.privateWorkflow.emailRequired}
                className="w-full px-3 py-3 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            )}
            {config.logic.privateWorkflow.collectPhone && (
              <input
                type="tel"
                placeholder={`Teléfono${config.logic.privateWorkflow.phoneRequired ? ' *' : ''}`}
                required={config.logic.privateWorkflow.phoneRequired}
                className="w-full px-3 py-3 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            )}
          </div>
        )}
        
        <textarea
          placeholder="Comparte tus comentarios aquí..."
          rows={4}
          className="w-full px-3 py-3 rounded-lg border text-sm resize-none"
          style={{
            borderColor: 'rgb(209, 213, 219)',
            color: '#161616',
            backgroundColor: 'white'
          }}
        />
        
        <button
          className="w-full py-3 px-6 rounded-lg font-medium text-base transition-all duration-200"
          style={{
            backgroundColor: config.colors.buttonColor,
            color: getContrastColor(config.colors.buttonColor)
          }}
        >
          {config.logic.privateWorkflow.buttonText}
        </button>
        
        {/* Prompt Preventivo */}
        {config.logic.prompt.enabled && (
          <div
            className="p-4 rounded-lg border text-center"
            style={{
              backgroundColor: config.logic.prompt.color + '08',
              borderColor: config.logic.prompt.color + '30'
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: config.logic.prompt.color }}>
              {config.logic.prompt.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPublicReview = () => (
    <div className="min-h-full bg-white flex flex-col justify-center px-12 py-12">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Logo */}
        {shouldShowLogo('public-review') && (
          <div className="flex justify-center mb-8">
            {renderLogo()}
          </div>
        )}
        
        <div className="flex justify-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`${
                star <= (selectedStars || config.logic.threshold)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="space-y-3">
          <h2
            className="text-2xl font-bold"
            style={{
              color: '#161616',
              fontFamily: config.typography.primaryFont
            }}
          >
            {config.logic.publicWorkflow.title}
          </h2>

          <p
            className="text-base"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont
            }}
          >
            {config.logic.publicWorkflow.thankYouMessage}
          </p>
        </div>

        <button
          className="w-full py-3 px-6 rounded-lg font-medium text-base transition-all duration-200"
          style={{
            backgroundColor: config.colors.buttonColor,
            color: getContrastColor(config.colors.buttonColor)
          }}
        >
          {config.logic.publicWorkflow.buttonText}
        </button>
      </div>
    </div>
  );

  const WhatsAppIcon = () => (
    <svg fill="#ffffff" viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
    </svg>
  );

  const renderPrivateThanks = () => (
    <div className="min-h-full bg-white flex flex-col justify-center px-12 py-12">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Logo */}
        {shouldShowLogo('private-thanks') && (
          <div className="flex justify-center mb-8">
            {renderLogo()}
          </div>
        )}

        <div className="space-y-3">
          <h2
            className="text-2xl font-bold"
            style={{
              color: '#161616',
              fontFamily: config.typography.primaryFont
            }}
          >
            {config.logic.privateWorkflow.thankYouTitle}
          </h2>

          <p
            className="text-base"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont
            }}
          >
            {config.logic.privateWorkflow.thankYouMessage}
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-3 pt-4">
          {config.logic.privateWorkflow.showWhatsAppButton && (
            <button
              className="w-full py-3 px-6 rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2"
              style={{
                backgroundColor: config.logic.privateWorkflow.whatsAppButtonColor,
                color: getContrastColor(config.logic.privateWorkflow.whatsAppButtonColor)
              }}
            >
              <WhatsAppIcon />
              <span>{config.logic.privateWorkflow.whatsAppButtonText}</span>
            </button>
          )}

          {config.logic.privateWorkflow.showEmailButton && (
            <button
              className="w-full py-3 px-6 rounded-lg font-medium text-base transition-all duration-200"
              style={{
                backgroundColor: config.logic.privateWorkflow.emailButtonColor,
                color: getContrastColor(config.logic.privateWorkflow.emailButtonColor)
              }}
            >
              {config.logic.privateWorkflow.emailButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (viewType) {
      case 'voting':
        return renderVotingPage();
      case 'private-feedback':
        return renderPrivateFeedback();
      case 'public-review':
        return renderPublicReview();
      case 'private-thanks':
        return renderPrivateThanks();
      default:
        return renderVotingPage();
    }
  };

  return (
    <div className="h-full bg-white overflow-auto">
      {renderContent()}
    </div>
  );
};

export default VotingPagePreview;