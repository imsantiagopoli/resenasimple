import React, { useState } from 'react';
import { Star, Building2, Instagram, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';
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
    instagram: Instagram,
    tiktok: TikTokIcon,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    website: Globe
  };

  const getSocialColor = (platform: string) => {
    switch (platform) {
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