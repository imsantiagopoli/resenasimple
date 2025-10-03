import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../contexts/DataContext';
import { createBusinessAndBranch } from '../lib/businessSetup';
import { supabase } from '../lib/supabase';
import {
  ArrowRight,
  Building2,
  Upload
} from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businessProfile, businessLoading, refetchBusinessData } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    businessType: '',
    logo: null as File | null
  });

  useEffect(() => {
    if (!businessLoading && businessProfile) {
      navigate('/app/inicio', { replace: true });
    }
  }, [businessProfile, businessLoading, navigate]);

  const businessTypes = [
    'Restaurante',
    'Pizzería',
    'Bar',
    'Café',
    'Parrilla',
    'Food Truck',
    'Panadería',
    'Heladería',
    'Otro'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        logo: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user) {
      setError('No hay sesión activa');
      setIsSubmitting(false);
      return;
    }

    try {
      // Update profile with Google data if needed
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profile && (!profile.first_name || !profile.last_name)) {
        const fullName = user.user_metadata?.full_name || '';
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        await supabase
          .from('profiles')
          .update({
            first_name: firstName || null,
            last_name: lastName || null,
            avatar_url: user.user_metadata?.avatar_url || null
          })
          .eq('id', user.id);
      }

      // Upload logo if provided
      let logoUrl: string | undefined = undefined;
      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-logos')
          .upload(filePath, formData.logo, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading logo:', uploadError);
          throw new Error('Error al subir el logo');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('business-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      // Create business and branch with logo
      await createBusinessAndBranch(
        user.id,
        formData.restaurantName,
        formData.businessType,
        logoUrl
      );

      await refetchBusinessData();
      navigate('/app/inicio');
    } catch (err: any) {
      console.error('Error creating business:', err);
      setError(err.message || 'Error al configurar tu negocio. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold" style={{ color: '#075E54' }}>
            Reseña Simple
          </h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#075E54' + '20' }}
            >
              <Building2 size={32} style={{ color: '#075E54' }} />
            </div>

            <h2 className="text-3xl font-bold mb-2" style={{ color: '#161616' }}>
              Bienvenido a Reseña Simple
            </h2>
            <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
              Cuéntanos sobre tu negocio para comenzar
            </p>
          </div>

          {error && (
            <div
              className="p-3 rounded-lg border text-sm"
              style={{
                backgroundColor: '#fee2e2',
                borderColor: '#fecaca',
                color: '#dc2626'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="restaurantName"
                className="block text-sm font-medium"
                style={{ color: '#161616' }}
              >
                Nombre del negocio
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'rgb(107, 114, 128)' }}
                />
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#075E54';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Ej: Pizzería Napolitana"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="block text-sm font-medium"
                style={{ color: '#161616' }}
              >
                ¿Qué tipo de negocio es?
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#075E54';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(7, 94, 84, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              >
                <option value="">Selecciona un tipo...</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="logo"
                className="block text-sm font-medium"
                style={{ color: '#161616' }}
              >
                Logo (Opcional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg border text-sm cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderColor: 'rgb(209, 213, 219)',
                    color: 'rgb(107, 114, 128)',
                  }}
                >
                  <Upload size={18} className="mr-2" />
                  {formData.logo ? formData.logo.name : 'Subir logo'}
                </label>
              </div>
              <p className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                Puedes agregar tu logo más tarde desde la configuración
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#075E54',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                  e.currentTarget.style.borderColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#075E54';
                e.currentTarget.style.borderColor = '#075E54';
              }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                    Comenzar
                  </span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
