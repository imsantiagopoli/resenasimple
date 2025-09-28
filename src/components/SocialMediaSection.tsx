import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Globe, Linkedin, Twitter, Youtube, ExternalLink, Save, X } from 'lucide-react';
import { BusinessProfile } from '../hooks/useBusiness';

interface SocialMediaSectionProps {
  profile: BusinessProfile;
  onSocialUpdate: (updates: Partial<BusinessProfile>) => Promise<{ error: string | null }>;
  showMessage: (type: 'success' | 'error', text: string) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ 
  profile, 
  onSocialUpdate, 
  showMessage 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempSocialMediaData, setTempSocialMediaData] = useState({
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    linkedin_url: '',
    twitter_url: '',
    youtube_url: '',
    website_url: ''
  });

  const [socialMediaData, setSocialMediaData] = useState({
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    linkedin_url: '',
    twitter_url: '',
    youtube_url: '',
    website_url: ''
  });

  // Initialize social media data from profile
  useEffect(() => {
    if (profile) {
      const socialData = {
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        tiktok_url: profile.tiktok_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        youtube_url: profile.youtube_url || '',
        website_url: profile.website_url || ''
      };
      setSocialMediaData(socialData);
      setTempSocialMediaData(socialData);
    }
  }, [profile]);

  const handleEdit = () => {
    setTempSocialMediaData(socialMediaData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await onSocialUpdate(tempSocialMediaData);
      if (error) {
        showMessage('error', error);
      } else {
        setSocialMediaData(tempSocialMediaData);
        setIsEditing(false);
        showMessage('success', 'Redes sociales actualizadas correctamente');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error al actualizar las redes sociales');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempSocialMediaData(socialMediaData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempSocialMediaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const socialIcons = [
    {
      key: 'facebook_url',
      icon: Facebook,
      color: '#1877f2',
      placeholder: 'https://facebook.com/tu-restaurante',
      label: 'Facebook'
    },
    {
      key: 'instagram_url',
      icon: Instagram,
      color: '#E4405F',
      placeholder: 'https://instagram.com/tu-restaurante',
      label: 'Instagram'
    },
    {
      key: 'tiktok_url',
      icon: () => (
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
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: '#6b7280', // Gray background
      placeholder: 'https://tiktok.com/@tu-restaurante',
      label: 'TikTok'
    },
    {
      key: 'website_url',
      icon: Globe,
      color: '#6b7280',
      placeholder: 'https://tu-restaurante.com',
      label: 'Sitio Web'
    },
    {
      key: 'linkedin_url',
      icon: Linkedin,
      color: '#0077B5',
      placeholder: 'https://linkedin.com/company/tu-restaurante',
      label: 'LinkedIn'
    },
    {
      key: 'twitter_url',
      icon: Twitter,
      color: '#1DA1F2',
      placeholder: 'https://twitter.com/tu-restaurante',
      label: 'Twitter/X'
    },
    {
      key: 'youtube_url',
      icon: Youtube,
      color: '#FF0000',
      placeholder: 'https://youtube.com/@tu-restaurante',
      label: 'YouTube'
    }
  ];

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Redes Sociales
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
            <Globe size={14} />
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
      
      <div className="grid grid-cols-2 gap-4">
        {socialIcons.map((social) => (
          <div key={social.key} className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgb(243, 244, 246)' }}
            >
              {typeof social.icon === 'function' ? (
                <social.icon />
              ) : (
                <social.icon size={20} style={{ color: 'rgb(107, 114, 128)' }} />
              )}
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={isEditing ? tempSocialMediaData[social.key as keyof typeof tempSocialMediaData] : socialMediaData[social.key as keyof typeof socialMediaData]}
                onChange={(e) => handleInputChange(social.key, e.target.value)}
                disabled={!isEditing}
                placeholder={social.placeholder}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData[social.key as keyof typeof socialMediaData] && (
              <a 
                href={socialMediaData[social.key as keyof typeof socialMediaData]} 
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
        ))}
      </div>
    </div>
  );
};

export default SocialMediaSection; 