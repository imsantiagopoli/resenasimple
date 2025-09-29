import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useData } from '../contexts/DataContext'

// Database row structure
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

// UI-friendly structure that components expect
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

// Convert database record to UI structure
const mapRecordToConfig = (record: VotingConfigurationRecord): VotingConfiguration => {
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
  }
}

// Convert UI structure back to database format
const mapConfigToRecord = (config: Partial<VotingConfiguration>): Partial<Omit<VotingConfigurationRecord, 'id' | 'business_id' | 'created_at' | 'updated_at'>> => {
  const updates: Partial<Omit<VotingConfigurationRecord, 'id' | 'business_id' | 'created_at' | 'updated_at'>> = {}
  
  if (config.design?.message?.headline !== undefined) updates.encabezado = config.design.message.headline
  if (config.design?.message?.body !== undefined) updates.cuerpo = config.design.message.body
  if (config.design?.showLogo !== undefined) updates.mostrar_logo = config.design.showLogo
  if (config.design?.logoShape !== undefined) updates.forma_logo = config.design.logoShape
  if (config.design?.logoDisplayPages !== undefined) updates.mostrar_logo_en = config.design.logoDisplayPages
  if (config.typography?.primaryFont !== undefined) updates.tipografia_principal = config.typography.primaryFont
  if (config.typography?.secondaryFont !== undefined) updates.tipografia_secundaria = config.typography.secondaryFont
  if (config.colors?.buttonColor !== undefined) updates.color_botones = config.colors.buttonColor
  if (config.design?.starLabels?.enabled !== undefined) updates.mostrar_etiquetas_estrellas = config.design.starLabels.enabled
  if (config.design?.starLabels?.labels?.[1] !== undefined) updates.etiqueta_1_estrella = config.design.starLabels.labels[1]
  if (config.design?.starLabels?.labels?.[2] !== undefined) updates.etiqueta_2_estrellas = config.design.starLabels.labels[2]
  if (config.design?.starLabels?.labels?.[3] !== undefined) updates.etiqueta_3_estrellas = config.design.starLabels.labels[3]
  if (config.design?.starLabels?.labels?.[4] !== undefined) updates.etiqueta_4_estrellas = config.design.starLabels.labels[4]
  if (config.design?.starLabels?.labels?.[5] !== undefined) updates.etiqueta_5_estrellas = config.design.starLabels.labels[5]
  if (config.design?.specialOffer?.enabled !== undefined) updates.oferta_especial_activa = config.design.specialOffer.enabled
  if (config.design?.specialOffer?.headline !== undefined) updates.oferta_especial_titulo = config.design.specialOffer.headline
  if (config.design?.specialOffer?.body !== undefined) updates.oferta_especial_descripcion = config.design.specialOffer.body
  if (config.design?.socials?.instagram !== undefined) updates.mostrar_instagram = config.design.socials.instagram
  if (config.design?.socials?.tiktok !== undefined) updates.mostrar_tiktok = config.design.socials.tiktok
  if (config.design?.socials?.linkedin !== undefined) updates.mostrar_linkedin = config.design.socials.linkedin
  if (config.design?.socials?.twitter !== undefined) updates.mostrar_twitter = config.design.socials.twitter
  if (config.design?.socials?.youtube !== undefined) updates.mostrar_youtube = config.design.socials.youtube
  if (config.design?.socials?.website !== undefined) updates.mostrar_website = config.design.socials.website
  if (config.logic?.threshold !== undefined) updates.umbral_estrellas = config.logic.threshold
  if (config.logic?.smartAutoRedirect !== undefined) updates.redireccion_automatica = config.logic.smartAutoRedirect
  if (config.logic?.publicWorkflow?.thankYouMessage !== undefined) updates.mensaje_agradecimiento_publico = config.logic.publicWorkflow.thankYouMessage
  if (config.logic?.publicWorkflow?.buttonText !== undefined) updates.texto_boton_publico = config.logic.publicWorkflow.buttonText
  if (config.logic?.privateWorkflow?.feedbackMessage !== undefined) updates.mensaje_feedback_privado = config.logic.privateWorkflow.feedbackMessage
  if (config.logic?.privateWorkflow?.thankYouMessage !== undefined) updates.mensaje_agradecimiento_privado = config.logic.privateWorkflow.thankYouMessage
  if (config.logic?.privateWorkflow?.collectName !== undefined) updates.solicitar_nombre = config.logic.privateWorkflow.collectName
  if (config.logic?.privateWorkflow?.nameRequired !== undefined) updates.nombre_requerido = config.logic.privateWorkflow.nameRequired
  if (config.logic?.privateWorkflow?.collectPhone !== undefined) updates.solicitar_telefono = config.logic.privateWorkflow.collectPhone
  if (config.logic?.privateWorkflow?.phoneRequired !== undefined) updates.telefono_requerido = config.logic.privateWorkflow.phoneRequired
  if (config.logic?.privateWorkflow?.collectEmail !== undefined) updates.solicitar_email = config.logic.privateWorkflow.collectEmail
  if (config.logic?.privateWorkflow?.emailRequired !== undefined) updates.email_requerido = config.logic.privateWorkflow.emailRequired
  if (config.logic?.prompt?.enabled !== undefined) updates.prompt_preventivo_activo = config.logic.prompt.enabled
  if (config.logic?.prompt?.text !== undefined) updates.texto_prompt_preventivo = config.logic.prompt.text
  
  return updates
}

interface VotingConfigState {
  config: VotingConfiguration | null
  originalConfig: VotingConfiguration | null
  loading: boolean
  error: string | null
  loaded: boolean
  hasChanges: boolean
  isSaving: boolean
}

export const useVotingConfig = () => {
  const { user } = useAuth()
  const { businessProfile: profile } = useData()
  const [configState, setConfigState] = useState<VotingConfigState>({
    config: null,
    originalConfig: null,
    loading: true,
    error: null,
    loaded: false,
    hasChanges: false,
    isSaving: false
  })

  // Fetch voting configuration for business
  const fetchVotingConfig = async (): Promise<VotingConfiguration | null> => {
    if (!profile?.id) {
      setConfigState(prev => ({ ...prev, loading: false, loaded: true }))
      return null
    }

    try {
      setConfigState(prev => ({ ...prev, loading: true, error: null }))

      const { data: record, error } = await supabase
        .from('voting_configuration')
        .select('*')
        .eq('business_id', profile.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      const config = record ? mapRecordToConfig(record) : null

      setConfigState(prev => ({
        ...prev,
        config,
        originalConfig: config ? JSON.parse(JSON.stringify(config)) : null,
        loading: false,
        error: null,
        loaded: true,
        hasChanges: false
      }))

      return config
    } catch (err: any) {
      console.error('Error fetching voting config:', err)
      setConfigState(prev => ({
        ...prev,
        config: null,
        originalConfig: null,
        loading: false,
        error: err.message || 'Error al cargar la configuración de votación',
        loaded: true,
        hasChanges: false
      }))
      return null
    }
  }

  // Create default configuration for business
  const createDefaultConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    if (!profile?.id) {
      return { data: null, error: 'No se encontró el perfil del negocio' }
    }

    try {
      const { data: record, error } = await supabase
        .from('voting_configuration')
        .upsert([{ business_id: profile.id }], {
          onConflict: 'business_id'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      const config = mapRecordToConfig(record)
      const originalConfig = JSON.parse(JSON.stringify(config))
      
      setConfigState(prev => ({
        ...prev,
        config,
        originalConfig,
        hasChanges: false
      }))

      return { data: config, error: null }
    } catch (err: any) {
      console.error('Error creating default config:', err)
      return { data: null, error: err.message || 'Error al crear la configuración por defecto' }
    }
  }

  // Update config locally (no database save yet)
  const updateConfig = (updates: Partial<VotingConfiguration>) => {
    if (!configState.config || !configState.originalConfig) return

    const newConfig = {
      ...configState.config,
      ...updates,
      design: {
        ...configState.config.design,
        ...(updates.design || {})
      },
      typography: {
        ...configState.config.typography,
        ...(updates.typography || {})
      },
      colors: {
        ...configState.config.colors,
        ...(updates.colors || {})
      },
      logic: {
        ...configState.config.logic,
        ...(updates.logic || {})
      }
    }

    // Check if there are changes
    const hasChanges = JSON.stringify(newConfig) !== JSON.stringify(configState.originalConfig)

    setConfigState(prev => ({
      ...prev,
      config: newConfig,
      hasChanges
    }))
  }

  // Save configuration to database
  const saveConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    if (!configState.config || !configState.hasChanges) {
      return { data: configState.config, error: null }
    }

    setConfigState(prev => ({ ...prev, isSaving: true }))

    try {
      const recordUpdates = mapConfigToRecord(configState.config)
      
      const { data: record, error } = await supabase
        .from('voting_configuration')
        .update(recordUpdates)
        .eq('id', configState.config.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedConfig = mapRecordToConfig(record)
      const originalConfig = JSON.parse(JSON.stringify(updatedConfig))
      
      setConfigState(prev => ({
        ...prev,
        config: updatedConfig,
        originalConfig,
        hasChanges: false,
        isSaving: false
      }))

      return { data: updatedConfig, error: null }
    } catch (err: any) {
      console.error('Error saving voting config:', err)
      setConfigState(prev => ({ ...prev, isSaving: false }))
      return { data: null, error: err.message || 'Error al guardar la configuración' }
    }
  }

  // Get or create configuration for business
  const getOrCreateConfig = async (): Promise<{ data: VotingConfiguration | null; error: string | null }> => {
    try {
      // First try to fetch existing config
      let config = await fetchVotingConfig()
      
      // If no config exists, create default one
      if (!config) {
        const { data, error } = await createDefaultConfig()
        if (error) {
          throw new Error(error)
        }
        config = data
      }

      return { data: config, error: null }
    } catch (err: any) {
      console.error('Error getting or creating config:', err)
      return { data: null, error: err.message || 'Error al obtener o crear la configuración' }
    }
  }

  // Reset changes (revert to original)
  const resetChanges = () => {
    if (configState.originalConfig) {
      setConfigState(prev => ({
        ...prev,
        config: JSON.parse(JSON.stringify(prev.originalConfig)),
        hasChanges: false
      }))
    }
  }

  useEffect(() => {
    if (profile?.id && !configState.loaded) {
      fetchVotingConfig()
    }
  }, [profile?.id, configState.loaded])

  return {
    ...configState,
    updateConfig,
    saveConfig,
    createDefaultConfig,
    getOrCreateConfig,
    resetChanges,
    refetch: fetchVotingConfig
  }
}