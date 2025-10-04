import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Building2, Instagram, Linkedin, Twitter, Youtube, Globe, ExternalLink, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { VotingConfiguration } from '../hooks/useVotingConfig';

interface BusinessBranch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  google_maps_link: string | null;
  slug: string;
  is_main: boolean;
}

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

interface VotingSession {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  rating: number;
  comment?: string;
  is_public: boolean;
  status: 'positive_viewed' | 'positive_clicked' | 'negative_incomplete' | 'negative_complete';
  google_redirect_clicked_at?: string;
  form_submitted_at?: string;
  form_completed: boolean;
}

type ViewState = 'loading' | 'voting' | 'private-feedback' | 'public-review' | 'private-thanks' | 'error';

const VotingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [branch, setBranch] = useState<BusinessBranch | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [config, setConfig] = useState<VotingConfiguration | null>(null);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load branch, business and config data
  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setViewState('error');
        return;
      }

      try {
        // Get branch by slug
        const { data: branchData, error: branchError } = await supabase
          .from('business_branches')
          .select('*')
          .eq('slug', slug)
          .single();

        if (branchError || !branchData) {
          setViewState('error');
          return;
        }

        setBranch(branchData);

        // Get business profile
        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', branchData.business_id)
          .single();

        if (businessError || !businessData) {
          setViewState('error');
          return;
        }

        setBusiness(businessData);

        // Get voting configuration
        const { data: configData, error: configError } = await supabase
          .from('voting_configuration')
          .select('*')
          .eq('business_id', branchData.business_id)
          .single();

        if (configError || !configData) {
          setViewState('error');
          return;
        }

        // Map database config to UI format
        const mappedConfig: VotingConfiguration = {
          id: configData.id,
          business_id: configData.business_id,
          design: {
            message: {
              headline: configData.encabezado,
              body: configData.cuerpo,
              bodyTextColor: configData.color_texto_body || '#6b7280'
            },
            showLogo: configData.mostrar_logo,
            logoShape: configData.forma_logo,
            logoDisplayPages: configData.mostrar_logo_en,
            starLabels: {
              enabled: configData.mostrar_etiquetas_estrellas,
              labels: {
                1: configData.etiqueta_1_estrella,
                2: configData.etiqueta_2_estrellas,
                3: configData.etiqueta_3_estrellas,
                4: configData.etiqueta_4_estrellas,
                5: configData.etiqueta_5_estrellas
              }
            },
            specialOffer: {
              enabled: configData.oferta_especial_activa,
              headline: configData.oferta_especial_titulo,
              body: configData.oferta_especial_descripcion,
              color: configData.oferta_especial_color || '#075E54',
              textColor: configData.color_texto_oferta || '#6b7280'
            },
            socials: {
              facebook: configData.mostrar_facebook,
              instagram: configData.mostrar_instagram,
              tiktok: configData.mostrar_tiktok,
              linkedin: configData.mostrar_linkedin,
              twitter: configData.mostrar_twitter,
              youtube: configData.mostrar_youtube,
              website: configData.mostrar_website
            }
          },
          typography: {
            primaryFont: configData.tipografia_principal,
            secondaryFont: configData.tipografia_secundaria
          },
          colors: {
            buttonColor: configData.color_botones
          },
          logic: {
            threshold: configData.umbral_estrellas,
            smartAutoRedirect: configData.redireccion_automatica,
            publicWorkflow: {
              title: configData.titulo_agradecimiento_publico || '¡Gracias por tu Calificación!',
              thankYouMessage: configData.mensaje_agradecimiento_publico,
              buttonText: configData.texto_boton_publico
            },
            privateWorkflow: {
              title: configData.titulo_feedback_privado || 'Tu Opinión es Valiosa',
              feedbackMessage: configData.mensaje_feedback_privado,
              buttonText: configData.texto_boton_privado || 'Enviar comentarios',
              thankYouTitle: configData.titulo_agradecimiento_privado || '¡Gracias por tu Feedback!',
              thankYouMessage: configData.mensaje_agradecimiento_privado,
              collectName: configData.solicitar_nombre,
              nameRequired: configData.nombre_requerido,
              collectPhone: configData.solicitar_telefono,
              phoneRequired: configData.telefono_requerido,
              collectEmail: configData.solicitar_email,
              emailRequired: configData.email_requerido,
              showWhatsAppButton: configData.mostrar_boton_whatsapp,
              whatsAppButtonText: configData.texto_boton_whatsapp || 'Contáctanos por WhatsApp',
              whatsAppButtonColor: configData.color_boton_whatsapp || '#25D366',
              showEmailButton: configData.mostrar_boton_email,
              emailButtonText: configData.texto_boton_email || 'Contáctanos por Email',
              emailButtonColor: configData.color_boton_email || '#075E54'
            },
            prompt: {
              enabled: configData.prompt_preventivo_activo,
              text: configData.texto_prompt_preventivo,
              color: configData.color_prompt || '#075E54'
            }
          },
          created_at: configData.created_at,
          updated_at: configData.updated_at
        };

        setConfig(mappedConfig);
        setViewState('voting');

      } catch (err) {
        console.error('Error loading voting page data:', err);
        setViewState('error');
      }
    };

    loadData();
  }, [slug]);

  // Handle star selection
  const handleStarClick = (stars: number) => {
    setSelectedStars(stars);

    if (!config) return;

    // Determine next view based on rating and threshold
    if (stars >= config.logic.threshold) {
      // High rating - show public review flow
      // Register voting session immediately when reaching public review page
      submitPublicVotingSession(stars);
      setViewState('public-review');
    } else {
      // Low rating - show private feedback flow
      // Create incomplete negative session immediately
      submitNegativeIncompleteSession(stars);
      setViewState('private-feedback');
    }
  };

  // Submit negative incomplete session when user clicks low rating
  const submitNegativeIncompleteSession = async (stars: number) => {
    try {
      const session = await submitVotingSession({
        rating: stars,
        is_public: false,
        status: 'negative_incomplete',
        form_completed: false
      });

      if (session) {
        console.log('Negative incomplete session created with ID:', session.id);
        setCurrentSessionId(session.id);
      } else {
        console.error('No session data returned for negative incomplete');
      }
    } catch (err) {
      console.error('Error submitting negative incomplete session:', err);
      setError('Error al procesar tu calificación. Por favor intenta de nuevo.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit voting session
  const submitVotingSession = async (sessionData: VotingSession) => {
    if (!branch) return null;

    try {
      const { data, error } = await supabase
        .from('voting_sessions')
        .insert([{
          branch_id: branch.id,
          customer_name: sessionData.customer_name || null,
          customer_email: sessionData.customer_email || null,
          customer_phone: sessionData.customer_phone || null,
          rating: sessionData.rating,
          comment: sessionData.comment || null,
          is_public: sessionData.is_public,
          status: sessionData.status,
          google_redirect_clicked_at: sessionData.google_redirect_clicked_at || null,
          form_submitted_at: sessionData.form_submitted_at || null,
          form_completed: sessionData.form_completed,
          ip_address: null,
          user_agent: navigator.userAgent
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error submitting voting session:', err);
      throw err;
    }
  };

  // State to store current session ID
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Submit public voting session when reaching thank you page
  const submitPublicVotingSession = async (stars: number) => {
    try {
      const session = await submitVotingSession({
        rating: stars,
        is_public: true,
        status: 'positive_viewed',
        form_completed: false
      });

      if (session) {
        console.log('Session created with ID:', session.id);
        setCurrentSessionId(session.id);
      } else {
        console.error('No session data returned');
      }
    } catch (err) {
      console.error('Error submitting public voting session:', err);
      setError('Error al procesar tu calificación. Por favor intenta de nuevo.');
    }
  };
  // Handle public review submission
  const handlePublicReview = async () => {
    console.log('handlePublicReview called, currentSessionId:', currentSessionId);

    if (!config) {
      console.error('No config available');
      return;
    }

    if (!currentSessionId) {
      console.error('No currentSessionId available');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Updating session to positive_clicked:', currentSessionId);

      // Update the session to mark that Google button was clicked
      const { data: updateData, error: updateError } = await supabase
        .from('voting_sessions')
        .update({
          status: 'positive_clicked',
          google_redirect_clicked_at: new Date().toISOString()
        })
        .eq('id', currentSessionId)
        .select();

      console.log('Update response:', { data: updateData, error: updateError });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      if (!updateData || updateData.length === 0) {
        console.error('Update succeeded but no rows were affected. Session may not exist or RLS prevented update.');
      }

      console.log('Session updated successfully:', updateData);

      // Redirect to Google or show success based on config
      if (config.logic.smartAutoRedirect && business) {
        // Try to redirect to Google My Business
        const googleUrl = `https://search.google.com/local/writereview?placeid=${business.name}`;
        window.open(googleUrl, '_blank');
      }

    } catch (err) {
      console.error('Error updating Google redirect click:', err);
      setError('Error al procesar tu calificación. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle private feedback submission
  const handlePrivateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handlePrivateFeedback called, currentSessionId:', currentSessionId);

    if (!config) {
      console.error('No config available');
      return;
    }

    if (!currentSessionId) {
      console.error('No currentSessionId available');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (config.logic.privateWorkflow.nameRequired && !formData.name.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (config.logic.privateWorkflow.emailRequired && !formData.email.trim()) {
        throw new Error('El email es requerido');
      }
      if (config.logic.privateWorkflow.phoneRequired && !formData.phone.trim()) {
        throw new Error('El teléfono es requerido');
      }

      console.log('Updating session to negative_complete:', currentSessionId);
      console.log('Form data:', formData);

      // Update the existing incomplete session to mark it as complete
      const { data: updateData, error: updateError } = await supabase
        .from('voting_sessions')
        .update({
          customer_name: formData.name || null,
          customer_email: formData.email || null,
          customer_phone: formData.phone || null,
          comment: formData.comment || null,
          status: 'negative_complete',
          form_submitted_at: new Date().toISOString(),
          form_completed: true
        })
        .eq('id', currentSessionId)
        .select();

      console.log('Update response:', { data: updateData, error: updateError });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      if (!updateData || updateData.length === 0) {
        console.error('Update succeeded but no rows were affected. Session may not exist or RLS prevented update.');
      }

      console.log('Session updated successfully to negative_complete:', updateData);

      setViewState('private-thanks');

    } catch (err: any) {
      console.error('Error in handlePrivateFeedback:', err);
      setError(err.message || 'Error al enviar tu feedback. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const shouldShowLogo = (viewType: string) => {
    if (!config?.design.showLogo) return false;
    if (config.design.logoDisplayPages === 'all') return true;
    if (config.design.logoDisplayPages === 'voting-only' && viewType === 'voting') return true;
    return false;
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

  const getSocialUrl = (platform: string) => {
    if (!business) return '#';
    switch (platform) {
      case 'facebook': return business.facebook_url || '#';
      case 'instagram': return business.instagram_url || '#';
      case 'tiktok': return business.tiktok_url || '#';
      case 'linkedin': return business.linkedin_url || '#';
      case 'twitter': return business.twitter_url || '#';
      case 'youtube': return business.youtube_url || '#';
      case 'website': return business.website_url || '#';
      default: return '#';
    }
  };

  const renderSocialIcons = () => {
    if (!config) return null;

    const activeSocials = Object.entries(config.design.socials)
      .filter(([key, value]) => value === true);

    if (activeSocials.length === 0) return null;

    const socialLinks = activeSocials.map(([platform]) => {
      const Icon = socialIcons[platform as keyof typeof socialIcons];
      const url = getSocialUrl(platform);
      if (!Icon || url === '#') return null;

      return (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: 'rgb(243, 244, 246)' }}
        >
          <Icon size={18} style={{ color: 'rgb(107, 114, 128)' }} />
        </a>
      );
    }).filter(Boolean);

    if (socialLinks.length === 0) return null;

    return (
      <div className="flex items-center justify-center space-x-4 pt-6">
        {socialLinks}
      </div>
    );
  };

  const renderLogo = () => {
    if (!shouldShowLogo(viewState) || !business) return null;

    return (
      <div className="flex justify-center mb-8">
        {business.logo_url ? (
          <img
            src={business.logo_url}
            alt={`Logo de ${business.name}`}
            className={`w-20 h-20 object-cover ${
              config?.design.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        ) : (
          <div 
            className={`w-20 h-20 flex items-center justify-center ${
              config?.design.logoShape === 'circular' ? 'rounded-full' : 'rounded-lg'
            }`}
            style={{ backgroundColor: '#075E54' + '20' }}
          >
            <Building2 size={32} style={{ color: '#075E54' }} />
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  // Error state
  if (viewState === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#161616' }}>
            Página no encontrada
          </h1>
          <p className="text-base mb-6" style={{ color: 'rgb(107, 114, 128)' }}>
            La página de votación que buscas no existe o no está disponible.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg font-medium text-base transition-all duration-200"
            style={{
              backgroundColor: '#075E54',
              color: 'white'
            }}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!config || !business || !branch) {
    return null;
  }

  // Voting page
  if (viewState === 'voting') {
    return (
      <div className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-md mx-auto w-full">
          {renderLogo()}

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
            <div className="flex items-center space-x-3 relative">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative">
                  <button
                    onMouseEnter={() => setHoveredStars(star)}
                    onMouseLeave={() => setHoveredStars(0)}
                    onClick={() => handleStarClick(star)}
                    className="p-3 transition-transform duration-200 hover:scale-110"
                    disabled={isSubmitting}
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
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-10">
                      <div
                        className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border"
                        style={{
                          backgroundColor: '#161616',
                          color: 'white',
                          borderColor: 'rgb(75, 85, 99)'
                        }}
                      >
                        {config.design.starLabels.labels[star as keyof typeof config.design.starLabels.labels]}
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
              className="p-8 rounded-lg border text-center mb-6"
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

          {renderSocialIcons()}

          {/* Footer */}
          <div className="pt-8">
            <div
              className="text-center text-xs"
              style={{
                color: 'rgb(107, 114, 128)',
                fontFamily: config.typography.secondaryFont,
                fontWeight: 400
              }}
            >
              Creado con Reseña Simple
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Private feedback page
  if (viewState === 'private-feedback') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full">
          {renderLogo()}
          
          <div className="text-center space-y-6">
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

            {/* Prompt Preventivo */}
            {config.logic.prompt.enabled && (
              <div
                className="p-6 rounded-lg border text-center"
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

            {/* Error Message */}
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
            
            <form onSubmit={handlePrivateFeedback} className="space-y-4">
              {/* Campos adicionales */}
              {config.logic.privateWorkflow.collectName && (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
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
              
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
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
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-lg font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: config.colors.buttonColor,
                  color: getContrastColor(config.colors.buttonColor)
                }}
              >
                {isSubmitting ? 'Enviando...' : config.logic.privateWorkflow.buttonText}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div
            className="pt-4 mt-6 text-center text-xs"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont,
              fontWeight: 400
            }}
          >
            Creado con Reseña Simple
          </div>
        </div>
      </div>
    );
  }

  // Public review page
  if (viewState === 'public-review') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full text-center space-y-6">
          {renderLogo()}
          
          <div className="flex justify-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={`${
                  star <= selectedStars
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
            onClick={handlePublicReview}
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-lg font-medium text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: config.colors.buttonColor,
              color: getContrastColor(config.colors.buttonColor)
            }}
          >
            {isSubmitting ? 'Redirigiendo...' : config.logic.publicWorkflow.buttonText}
          </button>

          {/* Footer */}
          <div
            className="pt-4 mt-6 text-center text-xs"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont,
              fontWeight: 400
            }}
          >
            Creado con Reseña Simple
          </div>
        </div>
      </div>
    );
  }

  // Private thanks page
  if (viewState === 'private-thanks') {
    const WhatsAppIcon = ({ color }: { color: string }) => (
      <svg fill={color} viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
      </svg>
    );

    const EnvelopeIcon = ({ color }: { color: string }) => (
      <svg fill={color} viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    );

    const handleWhatsAppClick = () => {
      if (branch?.phone) {
        const phoneNumber = branch.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
      }
    };

    const handleEmailClick = () => {
      if (business?.email) {
        window.location.href = `mailto:${business.email}`;
      }
    };

    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full text-center space-y-6">
          {renderLogo()}

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
            {config.logic.privateWorkflow.showWhatsAppButton && branch?.phone && (
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-4 px-8 rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: config.logic.privateWorkflow.whatsAppButtonColor,
                  color: getContrastColor(config.logic.privateWorkflow.whatsAppButtonColor)
                }}
              >
                <WhatsAppIcon color={getContrastColor(config.logic.privateWorkflow.whatsAppButtonColor)} />
                <span>{config.logic.privateWorkflow.whatsAppButtonText}</span>
              </button>
            )}

            {config.logic.privateWorkflow.showEmailButton && business?.email && (
              <button
                onClick={handleEmailClick}
                className="w-full py-4 px-8 rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: config.logic.privateWorkflow.emailButtonColor,
                  color: getContrastColor(config.logic.privateWorkflow.emailButtonColor)
                }}
              >
                <EnvelopeIcon color={getContrastColor(config.logic.privateWorkflow.emailButtonColor)} />
                <span>{config.logic.privateWorkflow.emailButtonText}</span>
              </button>
            )}
          </div>

          {/* Footer */}
          <div
            className="pt-4 mt-6 text-center text-xs"
            style={{
              color: 'rgb(107, 114, 128)',
              fontFamily: config.typography.secondaryFont,
              fontWeight: 400
            }}
          >
            Creado con Reseña Simple
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VotingPage;