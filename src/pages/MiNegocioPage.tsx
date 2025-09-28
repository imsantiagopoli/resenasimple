import React, { useState, useEffect } from 'react';
import { Building2, Upload, Camera, Facebook, Instagram, Globe, Phone, Mail, MapPin, Save, X, Plus, Trash2, ExternalLink, Music, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useBusiness } from '../hooks/useBusiness';
import { supabase } from '../lib/supabase';
import BranchesSection from '../components/BranchesSection';
import LogoSection from '../components/LogoSection';
import BusinessInfoSection from '../components/BusinessInfoSection';

const MiNegocioPage: React.FC = () => {
  const { 
    profile, 
    branches, 
    loading, 
    error,
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    generateSlug
  } = useBusiness();

  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
      setSocialMediaData({
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        tiktok_url: profile.tiktok_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        youtube_url: profile.youtube_url || '',
        website_url: profile.website_url || ''
      });
    }
  }, [profile]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 5000);
  };

  // Función para actualizar solo la información del negocio
  const handleBusinessUpdate = async (updates: Partial<BusinessProfile>) => {
    try {
      const { error } = await updateBusinessProfile(updates);
      return { error };
    } catch (err: any) {
      return { error: err.message || 'Error al actualizar la información del negocio' };
    }
  };

  // Función para actualizar solo el logo
  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      const { error } = await updateBusinessProfile({
        logo_url: logoUrl
      });
      return { error };
    } catch (err: any) {
      return { error: err.message || 'Error al actualizar el logo' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
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
      <div className="min-h-screen flex items-center justify-center p-6">
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
            Gestiona el logo, información, redes sociales y sucursales de tu restaurante
          </p>
        </div>
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
      <LogoSection 
        profile={profile}
        onLogoUpdate={handleLogoUpdate}
        showMessage={showMessage}
      />

      {/* Business Information Section */}
      <BusinessInfoSection 
        profile={profile}
        onBusinessUpdate={handleBusinessUpdate}
        showMessage={showMessage}
      />

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
                value={socialMediaData.facebook_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, facebook_url: e.target.value})}
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
            {!isEditing && socialMediaData.facebook_url && (
              <a 
                href={socialMediaData.facebook_url} 
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
                value={socialMediaData.instagram_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, instagram_url: e.target.value})}
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
            {!isEditing && socialMediaData.instagram_url && (
              <a 
                href={socialMediaData.instagram_url} 
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
                value={socialMediaData.website_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, website_url: e.target.value})}
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
            {!isEditing && socialMediaData.website_url && (
              <a 
                href={socialMediaData.website_url} 
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
                value={socialMediaData.tiktok_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, tiktok_url: e.target.value})}
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
            {!isEditing && socialMediaData.tiktok_url && (
              <a 
                href={socialMediaData.tiktok_url} 
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
              style={{ backgroundColor: '#0077B5' + '20' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.linkedin_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, linkedin_url: e.target.value})}
                disabled={!isEditing}
                placeholder="https://linkedin.com/company/tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.linkedin_url && (
              <a 
                href={socialMediaData.linkedin_url} 
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
              style={{ backgroundColor: '#1DA1F2' + '20' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.twitter_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, twitter_url: e.target.value})}
                disabled={!isEditing}
                placeholder="https://twitter.com/tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.twitter_url && (
              <a 
                href={socialMediaData.twitter_url} 
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
              style={{ backgroundColor: '#FF0000' + '20' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={socialMediaData.youtube_url}
                onChange={(e) => setSocialMediaData({...socialMediaData, youtube_url: e.target.value})}
                disabled={!isEditing}
                placeholder="https://youtube.com/@tu-restaurante"
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: isEditing ? 'white' : 'rgb(249, 250, 251)'
                }}
              />
            </div>
            {!isEditing && socialMediaData.youtube_url && (
              <a 
                href={socialMediaData.youtube_url} 
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

      {/* Branches Section */}
      <BranchesSection 
        branches={branches}
        upsertBranch={upsertBranch}
        deleteBranch={deleteBranch}
        generateSlug={generateSlug}
        showMessage={showMessage}
      />
    </div>
  );
};

export default MiNegocioPage;