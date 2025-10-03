import React, { useEffect, useState } from 'react';
import { Wand2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QRTemplatesTabProps {
  onApplyTemplate: (template: QRTemplateRecord) => void;
  currentBranchSlug: string;
}

interface QRTemplateRecord {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  qr_size: number;
  qr_foreground_color: string;
  qr_background_color: string;
  qr_error_correction_level: 'L' | 'M' | 'Q' | 'H';
  qr_margin: number;
  show_frame: boolean;
  frame_color: string;
  frame_thickness: number | null;
  show_title: boolean;
  title: string;
  show_subtitle: boolean;
  subtitle: string;
  show_call_to_action: boolean;
  call_to_action: string;
  tipografia_principal: string;
  color_tipografia_principal: string;
  tipografia_secundaria: string;
  color_tipografia_secundaria: string;
  print_format: 'A4' | 'Letter' | 'Custom';
  print_orientation: 'portrait' | 'landscape';
  qrs_per_page: number;
  include_instructions: boolean;
  created_at: string;
  updated_at: string;
}

const QRTemplatesTab: React.FC<QRTemplatesTabProps> = ({
  onApplyTemplate,
  currentBranchSlug
}) => {
  const [templates, setTemplates] = useState<QRTemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('qr_templates')
          .select('*')
          .eq('is_system', true)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setTemplates(data || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('No se pudieron cargar los templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 size={20} style={{ color: '#075E54' }} />
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Plantillas de QR
          </h3>
        </div>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Elige un diseño preconfigurado. Los templates solo modifican colores y diseño, tus textos permanecerán intactos.
        </p>
      </div>

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
                <p className="text-sm mb-4" style={{ color: 'rgb(107, 114, 128)' }}>
                  {template.description}
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: template.qr_background_color,
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
                    Colores del QR
                  </span>
                </div>

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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRTemplatesTab;
