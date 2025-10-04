import React, { useEffect, useState } from 'react';
import { Save, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { QRConfiguration } from '../../contexts/DataContext';

interface UserQRTemplatesTabProps {
  onApplyTemplate: (template: UserQRTemplateRecord) => void;
  currentConfig: QRConfiguration;
  businessId: string;
  userId: string;
}

interface UserQRTemplateRecord {
  id: string;
  user_id: string;
  business_id: string;
  name: string;
  description: string | null;
  qr_size: number;
  qr_foreground_color: string;
  qr_background_color: string;
  qr_error_correction_level: 'L' | 'M' | 'Q' | 'H';
  qr_margin: number;
  show_frame: boolean;
  frame_color: string;
  frame_thickness: number;
  show_logo: boolean;
  logo_shape: 'circular' | 'square';
  show_title: boolean;
  title: string;
  show_subtitle: boolean;
  subtitle: string;
  show_call_to_action: boolean;
  call_to_action: string;
  show_phone: boolean;
  show_email: boolean;
  tipografia_principal: string;
  color_tipografia_principal: string;
  tamano_tipografia_principal: number;
  tipografia_secundaria: string;
  color_tipografia_secundaria: string;
  tamano_tipografia_secundaria: number;
  tamano_titulo: number;
  tamano_subtitulo: number;
  tamano_cta: number;
  print_format: 'A4' | 'Letter' | 'Custom';
  print_orientation: 'portrait' | 'landscape';
  qrs_per_page: number;
  include_instructions: boolean;
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_start: string | null;
  background_gradient_end: string | null;
  background_gradient_direction: string | null;
  background_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const UserQRTemplatesTab: React.FC<UserQRTemplatesTabProps> = ({
  onApplyTemplate,
  currentConfig,
  businessId,
  userId
}) => {
  const [templates, setTemplates] = useState<UserQRTemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchTemplates = async () => {
    if (!userId || !businessId) {
      console.error('Missing userId or businessId', { userId, businessId });
      setError('Usuario o negocio no identificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('user_qr_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching user templates:', err);
      setError('No se pudieron cargar tus plantillas guardadas: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [userId, businessId]);

  const handleSaveTemplate = async () => {
    if (!saveName.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!userId || !businessId) {
      console.error('Missing userId or businessId', { userId, businessId });
      setError('Usuario o negocio no identificado');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const templateData = {
        user_id: userId,
        business_id: businessId,
        name: saveName.trim(),
        description: saveDescription.trim() || null,
        qr_size: currentConfig.qr.size,
        qr_foreground_color: currentConfig.qr.foregroundColor,
        qr_background_color: currentConfig.qr.backgroundColor,
        qr_error_correction_level: currentConfig.qr.errorCorrectionLevel,
        qr_margin: currentConfig.qr.margin,
        show_frame: currentConfig.design.showFrame,
        frame_color: currentConfig.design.frameColor,
        frame_thickness: currentConfig.design.frameThickness,
        show_logo: currentConfig.design.showLogo,
        logo_shape: currentConfig.design.logoShape,
        show_title: currentConfig.content.showTitle,
        title: currentConfig.content.title,
        show_subtitle: currentConfig.content.showSubtitle,
        subtitle: currentConfig.content.subtitle,
        show_call_to_action: currentConfig.content.showCallToAction,
        call_to_action: currentConfig.content.callToAction,
        show_phone: currentConfig.content.showPhone,
        show_email: currentConfig.content.showEmail,
        tipografia_principal: currentConfig.typography.primaryFont,
        color_tipografia_principal: currentConfig.typography.primaryColor,
        tamano_tipografia_principal: currentConfig.typography.primaryFontSize,
        tipografia_secundaria: currentConfig.typography.secondaryFont,
        color_tipografia_secundaria: currentConfig.typography.secondaryColor,
        tamano_tipografia_secundaria: currentConfig.typography.secondaryFontSize,
        tamano_titulo: currentConfig.typography.titleFontSize,
        tamano_subtitulo: currentConfig.typography.subtitleFontSize,
        tamano_cta: currentConfig.typography.ctaFontSize,
        print_format: currentConfig.print.format,
        print_orientation: currentConfig.print.orientation,
        qrs_per_page: currentConfig.print.qrsPerPage,
        include_instructions: currentConfig.print.includeInstructions,
        print_width: currentConfig.print.width,
        background_type: currentConfig.background.type,
        background_color: currentConfig.background.color,
        background_gradient_start: currentConfig.background.gradient?.start || null,
        background_gradient_end: currentConfig.background.gradient?.end || null,
        background_gradient_direction: currentConfig.background.gradient?.direction || null,
        background_image_url: currentConfig.background.imageUrl || null
      };

      console.log('Saving template with data:', templateData);

      const { error: insertError } = await supabase
        .from('user_qr_templates')
        .insert([templateData]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      setSaveName('');
      setSaveDescription('');
      setShowSaveModal(false);
      await fetchTemplates();
    } catch (err) {
      console.error('Error saving template:', err);
      setError('No se pudo guardar la plantilla: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('user_qr_templates')
        .delete()
        .eq('id', templateId);

      if (deleteError) throw deleteError;

      setDeleteConfirm(null);
      await fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('No se pudo eliminar la plantilla');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
              Mis Plantillas
            </h3>
            <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
              Guarda tu configuración actual para reutilizarla más adelante
            </p>
          </div>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: '#075E54',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#064e45';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#075E54';
            }}
          >
            <Save size={16} />
            <span>Guardar Configuración Actual</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <Save size={48} style={{ color: 'rgb(209, 213, 219)' }} className="mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
            No tienes plantillas guardadas aún.
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
            Haz clic en "Guardar Configuración Actual" para crear tu primera plantilla.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold mb-1" style={{ color: '#161616' }}>
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-sm mb-3" style={{ color: 'rgb(107, 114, 128)' }}>
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{
                          backgroundColor: template.background_color,
                          borderColor: 'rgb(209, 213, 219)'
                        }}
                      />
                      <div
                        className="w-6 h-6 rounded border"
                        style={{
                          backgroundColor: template.qr_foreground_color,
                          borderColor: 'rgb(209, 213, 219)'
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                      Colores
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onApplyTemplate(template)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: '#075E54',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#064e45';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#075E54';
                      }}
                    >
                      <Check size={14} />
                      <span>Aplicar</span>
                    </button>

                    {deleteConfirm === template.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: '#DC2626',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#B91C1C';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                          }}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: 'rgb(243, 244, 246)',
                            color: 'rgb(107, 114, 128)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(229, 231, 235)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(template.id)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: 'rgb(243, 244, 246)',
                          color: 'rgb(107, 114, 128)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(229, 231, 235)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#161616' }}>
              Guardar Configuración Actual
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#161616' }}>
                  Nombre de la plantilla *
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Ej: Diseño Verde Moderno"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#161616' }}>
                  Descripción (opcional)
                </label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="Agrega una descripción para recordar este diseño"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'rgb(229, 231, 235)' }}
                  rows={3}
                  maxLength={250}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveName('');
                  setSaveDescription('');
                  setError(null);
                }}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgb(243, 244, 246)',
                  color: 'rgb(107, 114, 128)'
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.backgroundColor = 'rgb(229, 231, 235)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={saving || !saveName.trim()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: saving || !saveName.trim() ? 'rgb(209, 213, 219)' : '#075E54',
                  color: 'white',
                  cursor: saving || !saveName.trim() ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!saving && saveName.trim()) {
                    e.currentTarget.style.backgroundColor = '#064e45';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && saveName.trim()) {
                    e.currentTarget.style.backgroundColor = '#075E54';
                  }
                }}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQRTemplatesTab;
