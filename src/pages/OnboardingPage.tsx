import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Building2, Upload, ArrowRight, Loader2 } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: ''
  });

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

  // Check if user already has a business
  useEffect(() => {
    const checkExistingBusiness = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        // User already has a business, redirect to dashboard
        navigate('/app/inicio');
      }
    };

    checkExistingBusiness();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen válida');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen debe ser menor a 2MB');
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1: Create business profile
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .insert([
          {
            user_id: user.id,
            name: formData.businessName,
            description: `Auténtico ${formData.businessType.toLowerCase()} con los mejores sabores.`,
          }
        ])
        .select()
        .single();

      if (businessError) {
        throw businessError;
      }

      let logoUrl: string | null = null;

      // Step 2: Upload logo if provided
      if (logoFile && businessData) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${businessData.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('business-logos')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading logo:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('business-logos')
            .getPublicUrl(fileName);

          logoUrl = urlData.publicUrl;

          // Update business profile with logo URL
          await supabase
            .from('business_profiles')
            .update({ logo_url: logoUrl })
            .eq('id', businessData.id);
        }
      }

      // Step 3: Create main branch
      const branchName = formData.businessName;
      const branchSlug = generateSlug(formData.businessName) + '-' + Date.now().toString().slice(-6);

      const { error: branchError } = await supabase
        .from('business_branches')
        .insert([
          {
            business_id: businessData.id,
            name: branchName,
            slug: branchSlug,
            is_main: true,
            address: '',
            phone: '',
            google_maps_link: ''
          }
        ]);

      if (branchError) {
        throw branchError;
      }

      // Step 4: Get branch ID and create voting config
      const { data: branchData, error: branchSelectError } = await supabase
        .from('business_branches')
        .select('id')
        .eq('business_id', businessData.id)
        .eq('is_main', true)
        .single();

      if (!branchSelectError && branchData) {
        // Create default voting config
        await supabase
          .from('voting_configs')
          .insert([
            {
              branch_id: branchData.id,
              threshold: 4,
              config_json: {
                design: {
                  message: {
                    headline: 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
                    body: 'Tómate un momento para compartir tu experiencia con nosotros.'
                  },
                  showLogo: true,
                  starLabels: {
                    enabled: true,
                    labels: {
                      1: 'Muy malo',
                      2: 'Regular',
                      3: 'Aceptable',
                      4: 'Bueno',
                      5: 'Excelente'
                    }
                  }
                },
                logic: {
                  threshold: 4,
                  publicWorkflow: {
                    thankYouMessage: 'Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.',
                    buttonText: 'Califícanos en Google'
                  },
                  privateWorkflow: {
                    feedbackMessage: 'Tu opinión es muy valiosa. Por favor, contanos cómo podemos mejorar.',
                    thankYouMessage: 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
                    collectEmail: true,
                    emailRequired: false,
                    collectName: false,
                    nameRequired: false,
                    collectPhone: false,
                    phoneRequired: false
                  }
                }
              }
            }
          ]);
      }

      // Success! Redirect to dashboard
      navigate('/app/inicio');
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Error al configurar tu negocio. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-10 text-white"
            style={{ backgroundColor: '#075E54' }}
          >
            <div className="flex items-center justify-center mb-4">
              <Building2 size={48} />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              Bienvenido a Reseña Simple
            </h1>
            <p className="text-center text-white/90">
              Cuéntanos sobre tu negocio para comenzar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div
                className="p-4 rounded-lg border text-sm"
                style={{
                  backgroundColor: '#fee2e2',
                  borderColor: '#fecaca',
                  color: '#dc2626'
                }}
              >
                {error}
              </div>
            )}

            {/* Business Name */}
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="block text-sm font-semibold"
                style={{ color: '#161616' }}
              >
                Nombre del negocio <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'rgb(107, 114, 128)' }}
                />
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
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
                  placeholder="Ej: Pizzería Don Luigi"
                  required
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="block text-sm font-semibold"
                style={{ color: '#161616' }}
              >
                ¿Qué tipo de negocio es? <span style={{ color: '#dc2626' }}>*</span>
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

            {/* Logo Upload (Optional) */}
            <div className="space-y-2">
              <label
                htmlFor="logo"
                className="block text-sm font-semibold"
                style={{ color: '#161616' }}
              >
                Logo (opcional)
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                {logoPreview && (
                  <div
                    className="flex-shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  >
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload button */}
                <div className="flex-1">
                  <label
                    htmlFor="logo"
                    className="flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                    style={{ borderColor: 'rgb(209, 213, 219)' }}
                  >
                    <Upload size={18} className="mr-2" style={{ color: 'rgb(107, 114, 128)' }} />
                    <span className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {logoFile ? 'Cambiar logo' : 'Subir logo'}
                    </span>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-2 text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                    Formatos: JPG, PNG. Tamaño máximo: 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Configurando tu negocio...
                </>
              ) : (
                <>
                  <span className="inline-block transition-transform group-hover:scale-105 mr-2">
                    Comenzar
                  </span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center mt-6 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Podrás editar esta información más adelante desde tu panel de control
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
