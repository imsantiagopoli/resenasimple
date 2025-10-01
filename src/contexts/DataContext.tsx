import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

// Types
export interface BusinessProfile {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessBranch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  google_maps_link: string | null;
  slug: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface VotingSession {
  id: string;
  branch_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  rating: number;
  comment: string | null;
  is_public: boolean;
  google_redirect_clicked: boolean | null;
  google_redirect_attempted_at: string | null;
  created_at: string;
  branch_name?: string;
  branch_slug?: string;
}

// Voting Configuration Types
export interface VotingConfigurationRecord {
  id: string
  business_id: string
  encabezado: string
  cuerpo: string
  mostrar_logo: boolean
  forma_logo: 'circular' | 'square'
  mostrar_logo_en: 'all' | 'voting-only'
  tipografia_principal: string
  tipografia_secundaria: string
  color_botones: string
  mostrar_etiquetas_estrellas: boolean
  etiqueta_1_estrella: string
  etiqueta_2_estrellas: string
  etiqueta_3_estrellas: string
  etiqueta_4_estrellas: string
  etiqueta_5_estrellas: string
  oferta_especial_activa: boolean
  oferta_especial_titulo: string
  oferta_especial_descripcion: string
  mostrar_instagram: boolean
  mostrar_tiktok: boolean
  mostrar_linkedin: boolean
  mostrar_twitter: boolean
  mostrar_youtube: boolean
  mostrar_website: boolean
  umbral_estrellas: number
  redireccion_automatica: boolean
  mensaje_agradecimiento_publico: string
  texto_boton_publico: string
  mensaje_feedback_privado: string
  mensaje_agradecimiento_privado: string
  solicitar_nombre: boolean
  nombre_requerido: boolean
  solicitar_telefono: boolean
  telefono_requerido: boolean
  solicitar_email: boolean
  email_requerido: boolean
  prompt_preventivo_activo: boolean
  texto_prompt_preventivo: string
  created_at: string
  updated_at: string
}

// QR Configuration Types
export interface QRConfigurationRecord {
  id: string
  business_id: string
  qr_size: number
  qr_foreground_color: string
  qr_background_color: string
  qr_error_correction_level: 'L' | 'M' | 'Q' | 'H'
  qr_margin: number
  show_frame: boolean
  frame_color: string
  frame_thickness: number
  show_logo: boolean
  logo_shape: 'circular' | 'square'
  show_title: boolean
  title: string
  show_subtitle: boolean
  subtitle: string
  show_call_to_action: boolean
  call_to_action: string
  tipografia_principal: string
  color_tipografia_principal: string
  tamano_tipografia_principal: number
  tipografia_secundaria: string
  color_tipografia_secundaria: string
  tamano_tipografia_secundaria: number
  print_format: 'A4' | 'Letter' | 'Custom'
  print_orientation: 'portrait' | 'landscape'
  qrs_per_page: number
  include_instructions: boolean
  created_at: string
  updated_at: string
}

export interface QRConfiguration {
  id: string
  business_id: string
  qr: {
    size: number
    foregroundColor: string
    backgroundColor: string
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
    margin: number
  }
  design: {
    showFrame: boolean
    frameColor: string
    frameThickness: number
    showLogo: boolean
    logoShape: 'circular' | 'square'
  }
  content: {
    showTitle: boolean
    title: string
    showSubtitle: boolean
    subtitle: string
    showCallToAction: boolean
    callToAction: string
  }
  typography: {
    primaryFont: string
    primaryColor: string
    primaryFontSize: number
    secondaryFont: string
    secondaryColor: string
    secondaryFontSize: number
  }
  print: {
    format: 'A4' | 'Letter' | 'Custom'
    orientation: 'portrait' | 'landscape'
    qrsPerPage: number
    includeInstructions: boolean
  }
  created_at: string
  updated_at: string
}

export interface VotingConfiguration {
  id: string
  business_id: string
  design: {
    message: {
      headline: string
      body: string
    }
    showLogo: boolean
    logoShape: 'circular' | 'square'
    logoDisplayPages: 'all' | 'voting-only'
    starLabels: {
      enabled: boolean
      labels: {
        1: string
        2: string
        3: string
        4: string
        5: string
      }
    }
    specialOffer: {
      enabled: boolean
      headline: string
      body: string
    }
    socials: {
      instagram: boolean
      tiktok: boolean
      linkedin: boolean
      twitter: boolean
      youtube: boolean
      website: boolean
    }
  }
  typography: {
    primaryFont: string
    secondaryFont: string
  }
  colors: {
    buttonColor: string
  }
  logic: {
    threshold: number
    smartAutoRedirect: boolean
    publicWorkflow: {
      thankYouMessage: string
      buttonText: string
    }
    privateWorkflow: {
      feedbackMessage: string
      thankYouMessage: string
      collectName: boolean
      nameRequired: boolean
      collectPhone: boolean
      phoneRequired: boolean
      collectEmail: boolean
      emailRequired: boolean
    }
    prompt: {
      enabled: boolean
      text: string
    }
  }
  created_at: string
  updated_at: string
}

interface DataContextType {
  // Business data
  businessProfile: BusinessProfile | null;
  businessBranches: BusinessBranch[];
  businessLoading: boolean;
  businessError: string | null;
  businessLoaded: boolean;
  
  // Voting sessions data
  votingSessions: VotingSession[];
  sessionsLoading: boolean;
  sessionsError: string | null;
  sessionsLoaded: boolean;
  
  // Voting configuration data
  votingConfiguration: VotingConfiguration | null;
  originalVotingConfiguration: VotingConfiguration | null;
  configLoading: boolean;
  configError: string | null;
  configLoaded: boolean;
  configHasChanges: boolean;
  configIsSaving: boolean;
  
  // QR configuration data
  qrConfiguration: QRConfiguration | null;
  originalQRConfiguration: QRConfiguration | null;
  qrConfigLoading: boolean;
  qrConfigError: string | null;
  qrConfigLoaded: boolean;
  qrConfigHasChanges: boolean;
  qrConfigIsSaving: boolean;
  
  // Actions
  updateBusinessProfile: (updates: Partial<Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<{ data: any; error: string | null }>;
  upsertBranch: (branch: Partial<BusinessBranch>) => Promise<{ data: any; error: string | null }>;
  deleteBranch: (branchId: string) => Promise<{ error: string | null }>;
  refetchBusinessData: () => Promise<void>;
  refetchSessionsData: () => Promise<void>;
  generateSlug: (name: string) => string;
  
  // Voting config actions
  updateVotingConfig: (updates: Partial<VotingConfiguration>) => void;
  saveVotingConfig: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  createDefaultVotingConfig: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  getOrCreateVotingConfig: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  resetVotingConfigChanges: () => void;
  resetVotingConfigToDefaults: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  refetchVotingConfig: () => Promise<VotingConfiguration | null>;
  
  // QR config actions
  updateQRConfig: (updates: Partial<QRConfiguration>) => void;
  saveQRConfig: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  createDefaultQRConfig: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  getOrCreateQRConfig: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  resetQRConfigChanges: () => void;
  resetQRConfigToDefaults: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  refetchQRConfig: () => Promise<QRConfiguration | null>;
  generateQRURL: (branchSlug: string, qrConfig?: QRConfiguration) => string;
  
  // Statistics helpers
  getStatistics: () => {
    totalSessions: number;
    publicSessions: number;
    privateSessions: number;
    averageRating: string;
    positiveReviews: number;
    positiveReviewsRate: string;
  };
  getTodayStatistics: () => {
    totalToday: number;
    publicToday: number;
    privateToday: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Business state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [businessBranches, setBusinessBranches] = useState<BusinessBranch[]>([]);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [businessLoaded, setBusinessLoaded] = useState(false);
  
  // Voting sessions state
  const [votingSessions, setVotingSessions] = useState<VotingSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  // Voting configuration state
  const [votingConfiguration, setVotingConfiguration] = useState<VotingConfiguration | null>(null);
  const [originalVotingConfiguration, setOriginalVotingConfiguration] = useState<VotingConfiguration | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configHasChanges, setConfigHasChanges] = useState(false);
  const [configIsSaving, setConfigIsSaving] = useState(false);

  // QR configuration state
  const [qrConfiguration, setQRConfiguration] = useState<QRConfiguration | null>(null);
  const [originalQRConfiguration, setOriginalQRConfiguration] = useState<QRConfiguration | null>(null);
  const [qrConfigLoading, setQRConfigLoading] = useState(true);
  const [qrConfigError, setQRConfigError] = useState<string | null>(null);
  const [qrConfigLoaded, setQRConfigLoaded] = useState(false);
  const [qrConfigHasChanges, setQRConfigHasChanges] = useState(false);
  const [qrConfigIsSaving, setQRConfigIsSaving] = useState(false);

  // Helper functions for voting configuration
  const mapRecordToConfigUI = (record: VotingConfigurationRecord): VotingConfiguration => {
    return {
      id: record.id,
      business_id: record.business_id,
      design: {
        message: {
          headline: record.encabezado,
          body: record.cuerpo
        },
        showLogo: record.mostrar_logo,
        logoShape: record.forma_logo,
        logoDisplayPages: record.mostrar_logo_en,
        starLabels: {
          enabled: record.mostrar_etiquetas_estrellas,
          labels: {
            1: record.etiqueta_1_estrella,
            2: record.etiqueta_2_estrellas,
            3: record.etiqueta_3_estrellas,
            4: record.etiqueta_4_estrellas,
            5: record.etiqueta_5_estrellas
          }
        },
        specialOffer: {
          enabled: record.oferta_especial_activa,
          headline: record.oferta_especial_titulo,
          body: record.oferta_especial_descripcion
        },
        socials: {
          instagram: record.mostrar_instagram,
          tiktok: record.mostrar_tiktok,
          linkedin: record.mostrar_linkedin,
          twitter: record.mostrar_twitter,
          youtube: record.mostrar_youtube,
          website: record.mostrar_website
        }
      },
      typography: {
        primaryFont: record.tipografia_principal,
        secondaryFont: record.tipografia_secundaria
      },
      colors: {
        buttonColor: record.color_botones
      },
      logic: {
        threshold: record.umbral_estrellas,
        smartAutoRedirect: record.redireccion_automatica,
        publicWorkflow: {
          thankYouMessage: record.mensaje_agradecimiento_publico,
          buttonText: record.texto_boton_publico
        },
        privateWorkflow: {
          feedbackMessage: record.mensaje_feedback_privado,
          thankYouMessage: record.mensaje_agradecimiento_privado,
          collectName: record.solicitar_nombre,
          nameRequired: record.nombre_requerido,
          collectPhone: record.solicitar_telefono,
          phoneRequired: record.telefono_requerido,
          collectEmail: record.solicitar_email,
          emailRequired: record.email_requerido
        },
        prompt: {
          enabled: record.prompt_preventivo_activo,
          text: record.texto_prompt_preventivo
        }
      },
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  };

  // Helper functions for QR configuration
  const mapQRRecordToConfigUI = (record: QRConfigurationRecord): QRConfiguration => {
    return {
      id: record.id,
      business_id: record.business_id,
      qr: {
        size: record.qr_size,
        foregroundColor: record.qr_foreground_color,
        backgroundColor: record.qr_background_color,
        errorCorrectionLevel: record.qr_error_correction_level,
        margin: record.qr_margin
      },
      design: {
        showFrame: record.show_frame,
        frameColor: record.frame_color,
        frameThickness: record.frame_thickness,
        showLogo: record.show_logo,
        logoShape: record.logo_shape
      },
      content: {
        showTitle: record.show_title,
        title: record.title,
        showSubtitle: record.show_subtitle,
        subtitle: record.subtitle,
        showCallToAction: record.show_call_to_action,
        callToAction: record.call_to_action
      },
      typography: {
        primaryFont: record.tipografia_principal,
        primaryColor: record.color_tipografia_principal,
        primaryFontSize: record.tamano_tipografia_principal || 24,
        secondaryFont: record.tipografia_secundaria,
        secondaryColor: record.color_tipografia_secundaria,
        secondaryFontSize: record.tamano_tipografia_secundaria || 16
      },
      print: {
        format: record.print_format,
        orientation: record.print_orientation,
        qrsPerPage: record.qrs_per_page,
        includeInstructions: record.include_instructions
      },
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  };

  const mapQRConfigUIToRecord = (config: QRConfiguration): Omit<QRConfigurationRecord, 'created_at' | 'updated_at'> => {
    return {
      id: config.id,
      business_id: config.business_id,
      qr_size: config.qr.size,
      qr_foreground_color: config.qr.foregroundColor,
      qr_background_color: config.qr.backgroundColor,
      qr_error_correction_level: config.qr.errorCorrectionLevel,
      qr_margin: config.qr.margin,
      show_frame: config.design.showFrame,
      frame_color: config.design.frameColor,
      frame_thickness: config.design.frameThickness,
      show_logo: config.design.showLogo,
      logo_shape: config.design.logoShape,
      show_title: config.content.showTitle,
      title: config.content.title,
      show_subtitle: config.content.showSubtitle,
      subtitle: config.content.subtitle,
      show_call_to_action: config.content.showCallToAction,
      call_to_action: config.content.callToAction,
      tipografia_principal: config.typography.primaryFont,
      color_tipografia_principal: config.typography.primaryColor,
      tamano_tipografia_principal: config.typography.primaryFontSize,
      tipografia_secundaria: config.typography.secondaryFont,
      color_tipografia_secundaria: config.typography.secondaryColor,
      tamano_tipografia_secundaria: config.typography.secondaryFontSize,
      print_format: config.print.format,
      print_orientation: config.print.orientation,
      qrs_per_page: config.print.qrsPerPage,
      include_instructions: config.print.includeInstructions
    };
  };

  const mapConfigUIToRecord = (config: VotingConfiguration): Omit<VotingConfigurationRecord, 'created_at' | 'updated_at'> => {
    return {
      id: config.id,
      business_id: config.business_id,
      encabezado: config.design.message.headline,
      cuerpo: config.design.message.body,
      mostrar_logo: config.design.showLogo,
      forma_logo: config.design.logoShape,
      mostrar_logo_en: config.design.logoDisplayPages,
      tipografia_principal: config.typography.primaryFont,
      tipografia_secundaria: config.typography.secondaryFont,
      color_botones: config.colors.buttonColor,
      mostrar_etiquetas_estrellas: config.design.starLabels.enabled,
      etiqueta_1_estrella: config.design.starLabels.labels[1],
      etiqueta_2_estrellas: config.design.starLabels.labels[2],
      etiqueta_3_estrellas: config.design.starLabels.labels[3],
      etiqueta_4_estrellas: config.design.starLabels.labels[4],
      etiqueta_5_estrellas: config.design.starLabels.labels[5],
      oferta_especial_activa: config.design.specialOffer.enabled,
      oferta_especial_titulo: config.design.specialOffer.headline,
      oferta_especial_descripcion: config.design.specialOffer.body,
      mostrar_instagram: config.design.socials.instagram,
      mostrar_tiktok: config.design.socials.tiktok,
      mostrar_linkedin: config.design.socials.linkedin,
      mostrar_twitter: config.design.socials.twitter,
      mostrar_youtube: config.design.socials.youtube,
      mostrar_website: config.design.socials.website,
      umbral_estrellas: config.logic.threshold,
      redireccion_automatica: config.logic.smartAutoRedirect,
      mensaje_agradecimiento_publico: config.logic.publicWorkflow.thankYouMessage,
      texto_boton_publico: config.logic.publicWorkflow.buttonText,
      mensaje_feedback_privado: config.logic.privateWorkflow.feedbackMessage,
      mensaje_agradecimiento_privado: config.logic.privateWorkflow.thankYouMessage,
      solicitar_nombre: config.logic.privateWorkflow.collectName,
      nombre_requerido: config.logic.privateWorkflow.nameRequired,
      solicitar_telefono: config.logic.privateWorkflow.collectPhone,
      telefono_requerido: config.logic.privateWorkflow.phoneRequired,
      solicitar_email: config.logic.privateWorkflow.collectEmail,
      email_requerido: config.logic.privateWorkflow.emailRequired,
      prompt_preventivo_activo: config.logic.prompt.enabled,
      texto_prompt_preventivo: config.logic.prompt.text
    };
  };

  // Fetch QR configuration
  const fetchQRConfig = async (): Promise<QRConfiguration | null> => {
    if (!businessProfile?.id) {
      setQRConfigLoaded(true);
      return null;
    }

    try {
      setQRConfigLoading(true);
      setQRConfigError(null);

      const { data, error } = await supabase
        .from('qr_configuration')
        .select('*')
        .eq('business_id', businessProfile.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        const config = mapQRRecordToConfigUI(data);
        setQRConfiguration(config);
        setOriginalQRConfiguration(config);
        setQRConfigLoaded(true);
        return config;
      } else {
        setQRConfiguration(null);
        setOriginalQRConfiguration(null);
        setQRConfigLoaded(true);
        return null;
      }
    } catch (err: any) {
      console.error('Error fetching QR config:', err);
      setQRConfigError(err.message || 'Error al cargar la configuración QR');
      setQRConfigLoaded(true);
      return null;
    } finally {
      setQRConfigLoading(false);
    }
  };

  // Create default QR configuration
  const createDefaultQRConfig = async (): Promise<{ data: QRConfiguration | null; error: string | null }> => {
    if (!businessProfile?.id) {
      return { data: null, error: 'No hay perfil de negocio' };
    }

    try {
      setQRConfigLoading(true);
      setQRConfigError(null);

      const { data, error } = await supabase
        .from('qr_configuration')
        .insert([{ business_id: businessProfile.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const config = mapQRRecordToConfigUI(data);
      setQRConfiguration(config);
      setOriginalQRConfiguration(config);
      setQRConfigHasChanges(false);
      
      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error creating default QR config:', err);
      const errorMessage = err.message || 'Error al crear la configuración QR';
      setQRConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setQRConfigLoading(false);
    }
  };

  // Get or create QR configuration
  const getOrCreateQRConfig = async (): Promise<{ data: QRConfiguration | null; error: string | null }> => {
    try {
      let config = await fetchQRConfig();
      
      if (!config) {
        const result = await createDefaultQRConfig();
        config = result.data;
        if (result.error) {
          return result;
        }
      }
      
      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error in getOrCreateQRConfig:', err);
      return { data: null, error: err.message || 'Error al obtener la configuración QR' };
    }
  };

  // Update QR configuration (local state only)
  const updateQRConfig = (updates: Partial<QRConfiguration>) => {
    if (!qrConfiguration) return;

    const updatedConfig = {
      ...qrConfiguration,
      ...updates
    };
    
    setQRConfiguration(updatedConfig);
    
    // Check if there are changes compared to original
    if (originalQRConfiguration) {
      const hasChanges = JSON.stringify(updatedConfig) !== JSON.stringify(originalQRConfiguration);
      setQRConfigHasChanges(hasChanges);
    }
  };

  // Save QR configuration
  const saveQRConfig = async (): Promise<{ data: QRConfiguration | null; error: string | null }> => {
    if (!qrConfiguration || !businessProfile?.id) {
      return { data: null, error: 'No hay configuración para guardar' };
    }

    try {
      setQRConfigIsSaving(true);
      setQRConfigError(null);

      const recordData = mapQRConfigUIToRecord(qrConfiguration);
      
      const { data, error } = await supabase
        .from('qr_configuration')
        .upsert([recordData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedConfig = mapQRRecordToConfigUI(data);
      setQRConfiguration(updatedConfig);
      setOriginalQRConfiguration(updatedConfig);
      setQRConfigHasChanges(false);
      
      return { data: updatedConfig, error: null };
    } catch (err: any) {
      console.error('Error saving QR config:', err);
      const errorMessage = err.message || 'Error al guardar la configuración QR';
      setQRConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setQRConfigIsSaving(false);
    }
  };

  // Reset QR configuration changes
  const resetQRConfigChanges = () => {
    if (originalQRConfiguration) {
      setQRConfiguration(originalQRConfiguration);
      setQRConfigHasChanges(false);
    }
  };

  // Reset QR configuration to default values
  const resetQRConfigToDefaults = async (): Promise<{ data: QRConfiguration | null; error: string | null }> => {
    if (!businessProfile?.id || !qrConfiguration?.id) {
      return { data: null, error: 'No hay configuración para restablecer' };
    }

    try {
      setQRConfigIsSaving(true);
      setQRConfigError(null);

      // Delete current configuration
      const { error: deleteError } = await supabase
        .from('qr_configuration')
        .delete()
        .eq('id', qrConfiguration.id);

      if (deleteError) {
        throw deleteError;
      }

      // Create new default configuration
      const { data, error } = await supabase
        .from('qr_configuration')
        .insert([{ business_id: businessProfile.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const config = mapQRRecordToConfigUI(data);
      setQRConfiguration(config);
      setOriginalQRConfiguration(config);
      setQRConfigHasChanges(false);

      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error resetting QR config to defaults:', err);
      const errorMessage = err.message || 'Error al restablecer la configuración';
      setQRConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setQRConfigIsSaving(false);
    }
  };

  // Generate QR URL
  const generateQRURL = (branchSlug: string, qrConfig?: QRConfiguration): string => {
    // Always prioritize the passed config to ensure real-time updates
    const config = qrConfig || qrConfiguration;
    const baseURL = 'https://resenasimple.com';
    const votingURL = `${baseURL}/v/${branchSlug}`;
    
    if (!config) {
      // Fallback to default QR settings if no config
      const params = new URLSearchParams({
        size: '200x200',
        data: votingURL,
        format: 'png',
        bgcolor: 'FFFFFF',
        color: '000000',
        ecc: 'M',
        margin: '4'
      });
      return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    }
    
    // Ensure colors don't have # prefix for QR API
    const foregroundColor = config.qr.foregroundColor.replace('#', '');
    const backgroundColor = config.qr.backgroundColor.replace('#', '');
    
    const params = new URLSearchParams({
      size: `${config.qr.size}x${config.qr.size}`,
      data: votingURL,
      format: 'png',
      bgcolor: backgroundColor,
      color: foregroundColor,
      ecc: config.qr.errorCorrectionLevel,
      margin: config.qr.margin.toString()
    });

    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    
    // Add cache busting parameter to ensure fresh QR generation
    return `${qrURL}&t=${Date.now()}`;
  };

  // Fetch voting configuration
  const fetchVotingConfig = async (): Promise<VotingConfiguration | null> => {
    if (!businessProfile?.id) {
      setConfigLoaded(true);
      return null;
    }

    try {
      setConfigLoading(true);
      setConfigError(null);

      const { data, error } = await supabase
        .from('voting_configuration')
        .select('*')
        .eq('business_id', businessProfile.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        const config = mapRecordToConfigUI(data);
        setVotingConfiguration(config);
        setOriginalVotingConfiguration(config);
        setConfigLoaded(true);
        return config;
      } else {
        setVotingConfiguration(null);
        setOriginalVotingConfiguration(null);
        setConfigLoaded(true);
        return null;
      }
    } catch (err: any) {
      console.error('Error fetching voting config:', err);
      setConfigError(err.message || 'Error al cargar la configuración');
      setConfigLoaded(true);
      return null;
    } finally {
      setConfigLoading(false);
    }
  };

  // Create default voting configuration
  const createDefaultVotingConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    if (!businessProfile?.id) {
      return { data: null, error: 'No hay perfil de negocio' };
    }

    try {
      setConfigLoading(true);
      setConfigError(null);

      const { data, error } = await supabase
        .from('voting_configuration')
        .insert([{ business_id: businessProfile.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const config = mapRecordToConfigUI(data);
      setVotingConfiguration(config);
      setOriginalVotingConfiguration(config);
      setConfigHasChanges(false);
      
      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error creating default config:', err);
      const errorMessage = err.message || 'Error al crear la configuración';
      setConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setConfigLoading(false);
    }
  };

  // Get or create voting configuration
  const getOrCreateVotingConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    try {
      let config = await fetchVotingConfig();
      
      if (!config) {
        const result = await createDefaultVotingConfig();
        config = result.data;
        if (result.error) {
          return result;
        }
      }
      
      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error in getOrCreateVotingConfig:', err);
      return { data: null, error: err.message || 'Error al obtener la configuración' };
    }
  };

  // Update voting configuration (local state only)
  const updateVotingConfig = (updates: Partial<VotingConfiguration>) => {
    if (!votingConfiguration) return;

    const updatedConfig = {
      ...votingConfiguration,
      ...updates
    };
    
    setVotingConfiguration(updatedConfig);
    
    // Check if there are changes compared to original
    if (originalVotingConfiguration) {
      const hasChanges = JSON.stringify(updatedConfig) !== JSON.stringify(originalVotingConfiguration);
      setConfigHasChanges(hasChanges);
    }
  };

  // Save voting configuration
  const saveVotingConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    if (!votingConfiguration || !businessProfile?.id) {
      return { data: null, error: 'No hay configuración para guardar' };
    }

    try {
      setConfigIsSaving(true);
      setConfigError(null);

      const recordData = mapConfigUIToRecord(votingConfiguration);
      
      const { data, error } = await supabase
        .from('voting_configuration')
        .upsert([recordData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedConfig = mapRecordToConfigUI(data);
      setVotingConfiguration(updatedConfig);
      setOriginalVotingConfiguration(updatedConfig);
      setConfigHasChanges(false);
      
      return { data: updatedConfig, error: null };
    } catch (err: any) {
      console.error('Error saving voting config:', err);
      const errorMessage = err.message || 'Error al guardar la configuración';
      setConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setConfigIsSaving(false);
    }
  };

  // Reset voting configuration changes
  const resetVotingConfigChanges = () => {
    if (originalVotingConfiguration) {
      setVotingConfiguration(originalVotingConfiguration);
      setConfigHasChanges(false);
    }
  };

  // Reset voting configuration to default values
  const resetVotingConfigToDefaults = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    if (!businessProfile?.id || !votingConfiguration?.id) {
      return { data: null, error: 'No hay configuración para restablecer' };
    }

    try {
      setConfigLoading(true);
      setConfigError(null);

      // Delete current configuration
      const { error: deleteError } = await supabase
        .from('voting_configuration')
        .delete()
        .eq('id', votingConfiguration.id);

      if (deleteError) {
        throw deleteError;
      }

      // Create new default configuration
      const { data, error } = await supabase
        .from('voting_configuration')
        .insert([{ business_id: businessProfile.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const config = mapRecordToConfigUI(data);
      setVotingConfiguration(config);
      setOriginalVotingConfiguration(config);
      setConfigHasChanges(false);

      return { data: config, error: null };
    } catch (err: any) {
      console.error('Error resetting voting config to defaults:', err);
      const errorMessage = err.message || 'Error al restablecer la configuración';
      setConfigError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setConfigLoading(false);
    }
  };

  // Fetch business data
  const fetchBusinessData = async () => {
    if (!user) {
      setBusinessLoading(false);
      setBusinessLoaded(true);
      return;
    }

    try {
      setBusinessLoading(true);
      setBusinessError(null);

      // Fetch business profile
      const { data: profile, error: profileError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profile) {
        setBusinessProfile(profile);
        
        // Fetch branches
        const { data: branches, error: branchesError } = await supabase
          .from('business_branches')
          .select('*')
          .eq('business_id', profile.id)
          .order('is_main', { ascending: false });

        if (branchesError) {
          throw branchesError;
        }

        setBusinessBranches(branches || []);
      } else {
        setBusinessProfile(null);
        setBusinessBranches([]);
      }

      setBusinessLoaded(true);
    } catch (err: any) {
      console.error('Error fetching business data:', err);
      setBusinessError(err.message || 'Error al cargar los datos del negocio');
      setBusinessLoaded(true);
    } finally {
      setBusinessLoading(false);
    }
  };

  // Fetch voting sessions
  const fetchVotingSessions = async () => {
    if (!user || !businessProfile || businessBranches.length === 0) {
      setSessionsLoading(false);
      setSessionsLoaded(true);
      return;
    }

    try {
      setSessionsLoading(true);
      setSessionsError(null);

      // Get all branch IDs for this business
      const branchIds = businessBranches.map(branch => branch.id);

      // Fetch voting sessions for all branches
      const { data: sessions, error } = await supabase
        .from('voting_sessions')
        .select(`
          *,
          business_branches!inner(
            name,
            slug
          )
        `)
        .in('branch_id', branchIds)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Map sessions with branch data
      const mappedSessions: VotingSession[] = (sessions || []).map(session => ({
        id: session.id,
        branch_id: session.branch_id,
        customer_name: session.customer_name,
        customer_email: session.customer_email,
        customer_phone: session.customer_phone,
        rating: session.rating,
        comment: session.comment,
        is_public: session.is_public,
        google_redirect_clicked: session.google_redirect_clicked,
        google_redirect_attempted_at: session.google_redirect_attempted_at,
        created_at: session.created_at,
        branch_name: session.business_branches?.name,
        branch_slug: session.business_branches?.slug
      }));

      setVotingSessions(mappedSessions);
      setSessionsLoaded(true);
    } catch (err: any) {
      console.error('Error fetching voting sessions:', err);
      setSessionsError(err.message || 'Error al cargar las reseñas');
      setSessionsLoaded(true);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Update business profile
  const updateBusinessProfile = async (updates: Partial<Omit<BusinessProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !businessProfile) {
      throw new Error('No hay perfil de negocio para actualizar');
    }

    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .update(updates)
        .eq('id', businessProfile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBusinessProfile(data);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating business profile:', err);
      return { data: null, error: err.message || 'Error al actualizar el perfil' };
    }
  };

  // Add or update branch
  const upsertBranch = async (branch: Partial<BusinessBranch>) => {
    if (!user || !businessProfile) {
      throw new Error('No hay perfil de negocio');
    }

    try {
      let result;
      if (branch.id) {
        // Update existing branch
        const branchData = {
          ...branch,
          business_id: businessProfile.id
        };
        result = await supabase
          .from('business_branches')
          .update(branchData)
          .eq('id', branch.id)
          .select()
          .single();
      } else {
        // Create new branch
        const { id, ...branchDataWithoutId } = branch;
        const branchData = {
          ...branchDataWithoutId,
          business_id: businessProfile.id
        };
        result = await supabase
          .from('business_branches')
          .insert([branchData])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Refresh branches data
      await fetchBusinessData();
      return { data: result.data, error: null };
    } catch (err: any) {
      console.error('Error upserting branch:', err);
      return { data: null, error: err.message || 'Error al guardar la sucursal' };
    }
  };

  // Delete branch
  const deleteBranch = async (branchId: string) => {
    try {
      const { error } = await supabase
        .from('business_branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        throw error;
      }

      // Refresh branches data
      await fetchBusinessData();
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      return { error: err.message || 'Error al eliminar la sucursal' };
    }
  };

  // Generate slug from name
  const generateSlug = async (name: string): Promise<string> => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if base slug is available
    const { data: existingBranch, error } = await supabase
      .from('business_branches')
      .select('slug')
      .eq('slug', baseSlug)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking slug uniqueness:', error);
      // Fallback to base slug if there's an error
      return baseSlug;
    }

    // If slug doesn't exist, use it
    if (!existingBranch) {
      return baseSlug;
    }

    // If slug exists, find the next available number
    let counter = 2;
    let newSlug = `${baseSlug}-${counter}`;
    
    while (true) {
      const { data: existingSlug, error: slugError } = await supabase
        .from('business_branches')
        .select('slug')
        .eq('slug', newSlug)
        .maybeSingle();

      if (slugError && slugError.code !== 'PGRST116') {
        console.error('Error checking slug uniqueness:', slugError);
        break;
      }

      if (!existingSlug) {
        break; // Found available slug
      }

      counter++;
      newSlug = `${baseSlug}-${counter}`;
      
      // Safety check to prevent infinite loop
      if (counter > 100) {
        console.warn('Reached maximum slug attempts, using timestamp suffix');
        newSlug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return newSlug;
  };

  // Synchronous version for backwards compatibility (deprecated)
  const generateSlugSync = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Get statistics from sessions
  const getStatistics = () => {
    const totalSessions = votingSessions.length;
    const publicSessions = votingSessions.filter(s => s.is_public).length;
    const privateSessions = votingSessions.filter(s => !s.is_public).length;
    
    const averageRating = totalSessions > 0 
      ? (votingSessions.reduce((sum, s) => sum + s.rating, 0) / totalSessions).toFixed(1)
      : '0.0';
    
    // Calcular tasa de reseñas positivas (4 o 5 estrellas)
    const positiveReviews = votingSessions.filter(s => s.rating >= 4).length;
    const positiveReviewsRate = totalSessions > 0 
      ? ((positiveReviews / totalSessions) * 100).toFixed(1)
      : '0.0';

    return {
      totalSessions,
      publicSessions,
      privateSessions,
      averageRating,
      positiveReviews,
      positiveReviewsRate
    };
  };

  // Get today's statistics
  const getTodayStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = votingSessions.filter(session => 
      session.created_at.startsWith(today)
    );
    
    const totalToday = todaySessions.length;
    const publicToday = todaySessions.filter(s => s.is_public).length;
    const privateToday = todaySessions.filter(s => !s.is_public).length;

    return {
      totalToday,
      publicToday,
      privateToday
    };
  };

  // Effects
  useEffect(() => {
    if (user && !businessLoaded) {
      fetchBusinessData();
    }
  }, [user, businessLoaded]);

  useEffect(() => {
    if (businessProfile && businessBranches.length > 0 && !sessionsLoaded) {
      fetchVotingSessions();
    }
  }, [businessProfile, businessBranches, sessionsLoaded]);

  useEffect(() => {
    if (businessProfile?.id && !configLoaded) {
      fetchVotingConfig();
    }
  }, [businessProfile?.id, configLoaded]);

  useEffect(() => {
    if (businessProfile?.id && !qrConfigLoaded) {
      fetchQRConfig();
    }
  }, [businessProfile?.id, qrConfigLoaded]);
  
  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setBusinessProfile(null);
      setBusinessBranches([]);
      setBusinessLoading(true);
      setBusinessError(null);
      setBusinessLoaded(false);
      
      setVotingSessions([]);
      setSessionsLoading(true);
      setSessionsError(null);
      setSessionsLoaded(false);
      
      setVotingConfiguration(null);
      setOriginalVotingConfiguration(null);
      setConfigLoading(true);
      setConfigError(null);
      setConfigLoaded(false);
      setConfigHasChanges(false);
      setConfigIsSaving(false);
      
      setQRConfiguration(null);
      setOriginalQRConfiguration(null);
      setQRConfigLoading(true);
      setQRConfigError(null);
      setQRConfigLoaded(false);
      setQRConfigHasChanges(false);
      setQRConfigIsSaving(false);
    }
  }, [user]);

  const value: DataContextType = {
    // Business data
    businessProfile,
    businessBranches,
    businessLoading,
    businessError,
    businessLoaded,
    
    // Voting sessions data
    votingSessions,
    sessionsLoading,
    sessionsError,
    sessionsLoaded,
    
    // Voting configuration data
    votingConfiguration,
    originalVotingConfiguration,
    configLoading,
    configError,
    configLoaded,
    configHasChanges,
    configIsSaving,
    
    // QR configuration data
    qrConfiguration,
    originalQRConfiguration,
    qrConfigLoading,
    qrConfigError,
    qrConfigLoaded,
    qrConfigHasChanges,
    qrConfigIsSaving,
    
    // Actions
    updateBusinessProfile,
    upsertBranch,
    deleteBranch,
    refetchBusinessData: fetchBusinessData,
    refetchSessionsData: fetchVotingSessions,
    generateSlug,
    generateSlugSync,
    
    // Voting config actions
    updateVotingConfig,
    saveVotingConfig,
    createDefaultVotingConfig,
    getOrCreateVotingConfig,
    resetVotingConfigChanges,
    resetVotingConfigToDefaults,
    refetchVotingConfig: fetchVotingConfig,
    
    // QR config actions
    updateQRConfig,
    saveQRConfig,
    createDefaultQRConfig,
    getOrCreateQRConfig,
    resetQRConfigChanges,
    resetQRConfigToDefaults,
    refetchQRConfig: fetchQRConfig,
    generateQRURL,
    
    // Statistics
    getStatistics,
    getTodayStatistics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};