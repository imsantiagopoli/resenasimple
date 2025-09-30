import React from 'react';
import { Wand2, Check } from 'lucide-react';
import { QRConfiguration } from '../../hooks/useQRConfig';

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
  preview: {
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
  const templates: QRTemplate[] = [
    {
      id: 'classic',
      name: 'Clásico',
      description: 'Diseño tradicional en blanco y negro, ideal para cualquier ocasión',
      config: {
        qr: {
          size: 300,
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          margin: 4,
          errorCorrectionLevel: 'M'
        },
        typography: {
          primaryFont: 'Arial',
          primaryColor: '#000000',
          secondaryFont: 'Arial',
          secondaryColor: '#666666'
        },
        design: {
          showFrame: true,
          frameColor: '#000000',
          frameThickness: 2
        },
        content: {
          title: '¡Déjanos tu opinión!',
          subtitle: 'Escanea el código QR',
          callToAction: 'Tu opinión es importante',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: true
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: true
        }
      },
      preview: {
        bgColor: '#FFFFFF',
        qrColor: '#000000',
        accentColor: '#000000'
      }
    },
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Estilo contemporáneo con verde WhatsApp y tipografía elegante',
      config: {
        qr: {
          size: 350,
          foregroundColor: '#075E54',
          backgroundColor: '#FFFFFF',
          margin: 6,
          errorCorrectionLevel: 'H'
        },
        typography: {
          primaryFont: 'Cabinet Grotesk',
          primaryColor: '#075E54',
          secondaryFont: 'Cabinet Grotesk',
          secondaryColor: '#6b7280'
        },
        design: {
          showFrame: true,
          frameColor: '#075E54',
          frameThickness: 3
        },
        content: {
          title: 'Comparte tu experiencia',
          subtitle: 'Nos encantaría conocer tu opinión',
          callToAction: '¡Ayúdanos a mejorar!',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: true
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: true
        }
      },
      preview: {
        bgColor: '#FFFFFF',
        qrColor: '#075E54',
        accentColor: '#075E54'
      }
    },
    {
      id: 'elegant',
      name: 'Elegante',
      description: 'Diseño sofisticado con tipografía serif y marco delicado',
      config: {
        qr: {
          size: 320,
          foregroundColor: '#1a1a1a',
          backgroundColor: '#FFFFFF',
          margin: 8,
          errorCorrectionLevel: 'Q'
        },
        typography: {
          primaryFont: 'Georgia',
          primaryColor: '#1a1a1a',
          secondaryFont: 'Georgia',
          secondaryColor: '#4a4a4a'
        },
        design: {
          showFrame: true,
          frameColor: '#1a1a1a',
          frameThickness: 1
        },
        content: {
          title: 'Tu opinión nos importa',
          subtitle: 'Escanea para compartir tu experiencia',
          callToAction: 'Comparte tu valoración',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: true
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: true
        }
      },
      preview: {
        bgColor: '#FFFFFF',
        qrColor: '#1a1a1a',
        accentColor: '#1a1a1a'
      }
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      description: 'Diseño limpio y simple sin distracciones',
      config: {
        qr: {
          size: 300,
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          margin: 10,
          errorCorrectionLevel: 'M'
        },
        typography: {
          primaryFont: 'Helvetica',
          primaryColor: '#000000',
          secondaryFont: 'Helvetica',
          secondaryColor: '#666666'
        },
        design: {
          showFrame: false,
          frameColor: '#000000',
          frameThickness: 0
        },
        content: {
          title: 'Déjanos tu opinión',
          subtitle: 'Escanea el código',
          callToAction: '',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: false
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: false
        }
      },
      preview: {
        bgColor: '#FFFFFF',
        qrColor: '#000000',
        accentColor: '#000000'
      }
    },
    {
      id: 'bold',
      name: 'Llamativo',
      description: 'Diseño audaz con colores contrastantes y marco grueso',
      config: {
        qr: {
          size: 380,
          foregroundColor: '#000000',
          backgroundColor: '#FFEB3B',
          margin: 4,
          errorCorrectionLevel: 'H'
        },
        typography: {
          primaryFont: 'Impact',
          primaryColor: '#000000',
          secondaryFont: 'Arial',
          secondaryColor: '#333333'
        },
        design: {
          showFrame: true,
          frameColor: '#000000',
          frameThickness: 5
        },
        content: {
          title: '¡VALÓRANOS!',
          subtitle: 'Tu opinión cuenta',
          callToAction: '¡ESCANEA AHORA!',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: true
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: true
        }
      },
      preview: {
        bgColor: '#FFEB3B',
        qrColor: '#000000',
        accentColor: '#000000'
      }
    },
    {
      id: 'restaurant',
      name: 'Restaurante',
      description: 'Perfecto para mesas de restaurantes con colores cálidos',
      config: {
        qr: {
          size: 340,
          foregroundColor: '#8B4513',
          backgroundColor: '#FFF8DC',
          margin: 6,
          errorCorrectionLevel: 'Q'
        },
        typography: {
          primaryFont: 'Georgia',
          primaryColor: '#8B4513',
          secondaryFont: 'Georgia',
          secondaryColor: '#A0522D'
        },
        design: {
          showFrame: true,
          frameColor: '#8B4513',
          frameThickness: 3
        },
        content: {
          title: '¿Cómo estuvo tu comida?',
          subtitle: 'Nos encantaría conocer tu opinión',
          callToAction: 'Comparte tu experiencia',
          showTitle: true,
          showSubtitle: true,
          showCallToAction: true
        },
        print: {
          format: 'A4',
          orientation: 'portrait',
          includeInstructions: true
        }
      },
      preview: {
        bgColor: '#FFF8DC',
        qrColor: '#8B4513',
        accentColor: '#8B4513'
      }
    }
  ];

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
                        backgroundColor: template.preview.bgColor,
                        borderColor: 'rgb(209, 213, 219)'
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded border"
                      style={{
                        backgroundColor: template.preview.qrColor,
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
