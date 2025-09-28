import React, { useState, useEffect } from 'react';
import { Building2, Upload, Camera, Facebook, Instagram, Globe, Phone, Mail, MapPin, Save, X, Plus, Trash2, ExternalLink, Music, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useBusiness } from '../hooks/useBusiness';
import { supabase } from '../lib/supabase';
import BranchesSection from '../components/BranchesSection';
import LogoSection from '../components/LogoSection';
import BusinessInfoSection from '../components/BusinessInfoSection';
import SocialMediaSection from '../components/SocialMediaSection';

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

  // Función para actualizar solo las redes sociales
  const handleSocialUpdate = async (updates: Partial<BusinessProfile>) => {
    try {
      const { error } = await updateBusinessProfile(updates);
      return { error };
    } catch (err: any) {
      return { error: err.message || 'Error al actualizar las redes sociales' };
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
      <SocialMediaSection 
        profile={profile}
        onSocialUpdate={handleSocialUpdate}
        showMessage={showMessage}
      />

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