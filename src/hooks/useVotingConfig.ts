import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export interface VotingConfiguration {
  id: string
  branch_id: string
  
  // Mensaje principal
  encabezado: string
  cuerpo: string
  
  // Logo
  mostrar_logo: boolean
  forma_logo: 'circular' | 'square'
  mostrar_logo_en: 'all' | 'voting-only'
  
  // Tipografía
  tipografia_principal: string
  tipografia_secundaria: string
  
  // Colores
  color_botones: string
  
  // Etiquetas de estrellas
  mostrar_etiquetas_estrellas: boolean
  etiqueta_1_estrella: string
  etiqueta_2_estrellas: string
  etiqueta_3_estrellas: string
  etiqueta_4_estrellas: string
  etiqueta_5_estrellas: string
  
  // Oferta especial
  oferta_especial_activa: boolean
  oferta_especial_titulo: string
  oferta_especial_descripcion: string
  
  // Redes sociales
  mostrar_instagram: boolean
  mostrar_tiktok: boolean
  mostrar_linkedin: boolean
  mostrar_twitter: boolean
  mostrar_youtube: boolean
  mostrar_website: boolean
  
  // Lógica de votación
  umbral_estrellas: number
  redireccion_automatica: boolean
  
  // Flujo público
  mensaje_agradecimiento_publico: string
  texto_boton_publico: string
  
  // Flujo privado
  mensaje_feedback_privado: string
  mensaje_agradecimiento_privado: string
  
  // Campos de feedback privado
  solicitar_nombre: boolean
  nombre_requerido: boolean
  solicitar_telefono: boolean
  telefono_requerido: boolean
  solicitar_email: boolean
  email_requerido: boolean
  
  // Prompt preventivo
  prompt_preventivo_activo: boolean
  texto_prompt_preventivo: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

interface VotingConfigState {
  config: VotingConfiguration | null
  loading: boolean
  error: string | null
  loaded: boolean
}

export const useVotingConfig = (branchId?: string) => {
  const { user } = useAuth()
  const [configState, setConfigState] = useState<VotingConfigState>({
    config: null,
    loading: true,
    error: null,
    loaded: false
  })

  // Fetch voting configuration
  const fetchVotingConfig = async (targetBranchId?: string) => {
    if (!targetBranchId) {
      setConfigState(prev => ({ ...prev, loading: false, loaded: true }))
      return
    }

    try {
      setConfigState(prev => ({ ...prev, loading: true, error: null }))

      const { data: config, error } = await supabase
        .from('voting_configuration')
        .select('*')
        .eq('branch_id', targetBranchId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setConfigState({
        config: config || null,
        loading: false,
        error: null,
        loaded: true
      })

      return config
    } catch (err: any) {
      console.error('Error fetching voting config:', err)
      setConfigState({
        config: null,
        loading: false,
        error: err.message || 'Error al cargar la configuración de votación',
        loaded: true
      })
      return null
    }
  }

  // Create default configuration for a branch
  const createDefaultConfig = async (targetBranchId: string) => {
    try {
      const { data, error } = await supabase
        .from('voting_configuration')
        .insert([{ branch_id: targetBranchId }])
        .select()
        .single()

      if (error) {
        throw error
      }

      setConfigState(prev => ({
        ...prev,
        config: data
      }))

      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating default config:', err)
      return { data: null, error: err.message || 'Error al crear la configuración por defecto' }
    }
  }

  // Update voting configuration (real-time)
  const updateVotingConfig = async (updates: Partial<Omit<VotingConfiguration, 'id' | 'branch_id' | 'created_at' | 'updated_at'>>) => {
    if (!configState.config) {
      throw new Error('No hay configuración para actualizar')
    }

    try {
      const { data, error } = await supabase
        .from('voting_configuration')
        .update(updates)
        .eq('id', configState.config.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setConfigState(prev => ({
        ...prev,
        config: data
      }))

      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating voting config:', err)
      return { data: null, error: err.message || 'Error al actualizar la configuración' }
    }
  }

  // Get or create configuration for a branch
  const getOrCreateConfig = async (targetBranchId: string) => {
    try {
      // First try to fetch existing config
      let config = await fetchVotingConfig(targetBranchId)
      
      // If no config exists, create default one
      if (!config) {
        const { data, error } = await createDefaultConfig(targetBranchId)
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

  useEffect(() => {
    if (branchId && !configState.loaded) {
      fetchVotingConfig(branchId)
    }
  }, [branchId, configState.loaded])

  return {
    ...configState,
    updateVotingConfig,
    createDefaultConfig,
    getOrCreateConfig,
    refetch: () => fetchVotingConfig(branchId)
  }
}