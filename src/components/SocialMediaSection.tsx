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
      icon: null, // Custom image
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
      
      <div className="space-y-4">
        {socialIcons.map((social) => (
          <div key={social.key} className="flex items-center space-x-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: social.key === 'tiktok_url' ? '#6b7280' + '20' : social.color + '20' }}
            >
              {social.key === 'tiktok_url' ? (
                <img 
                  src="https://qxylsmbtngtvoinoozsh.supabase.co/storage/v1/object/public/assets/tiktok-color-icon.svg"
                  alt="TikTok"
                  width={20}
                  height={20}
                />
              ) : (
                <social.icon size={20} style={{ color: social.color }} />
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