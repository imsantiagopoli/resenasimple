import React, { useEffect, useState } from 'react';
import { Wand2, Check } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { supabase } from '../../lib/supabase';

interface QRTemplatesTabProps {
  onApplyTemplate: (template: Partial<QRConfiguration>) => void;
  onDownload: (templateConfig: Partial<QRConfiguration>) => void;
  currentBranchSlug: string;
}

interface QRTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<QRConfiguration>;
  preview_colors: {
    bgColor: string;
    qrColor: string;
    accentColor: string;
  };
}

const QRTemplatesTab: React.FC<QRTemplatesTabProps> = ({
  onApplyTemplate,
  onDownload,
  currentBranchSlug
}) => {
  const [templates, setTemplates] = useState<QRTemplate[]>([]);
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
            Templates de QR
          </h3>
        </div>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Elige un diseño preconfigurado y personalízalo a tu gusto
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
                        backgroundColor: template.preview_colors.bgColor,
                        borderColor: 'rgb(209, 213, 219)'
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: template.preview_colors.qrColor,
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
                    onClick={() => onApplyTemplate(template.config)}
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

                  <button
                    onClick={() => onDownload(template.config)}
                    className="px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRTemplatesTab;
