import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Palette, FileText, Printer, Save, RotateCcw, Download, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import QRConfigTab from './QRConfigTab';
import QRTemplatesTab from './QRTemplatesTab';
import { QRConfiguration } from '../../hooks/useQRConfig';
import { BusinessBranch } from '../../hooks/useBusiness';

interface QRConfigPanelProps {
  config: QRConfiguration;
  onConfigUpdate: (updates: Partial<QRConfiguration>) => void;
  hasChanges: boolean;
  onSave: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  onReset: () => void;
  onResetToDefaults: () => Promise<{ data: QRConfiguration | null; error: string | null }>;
  isSaving: boolean;
  onDownload?: () => void;
  onPrint?: () => Promise<void>;
  currentBranchSlug: string;
  selectedBranch: BusinessBranch;
}

const QRConfigPanel: React.FC<QRConfigPanelProps> = ({
  config,
  onConfigUpdate,
  hasChanges,
  onSave,
  onReset,
  onResetToDefaults,
  isSaving,
  onDownload,
  onPrint,
  currentBranchSlug,
  selectedBranch
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'templates' | 'content' | 'print'>('design');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      id: 'design' as const,
      label: 'Diseño',
      icon: QrCode
    },
    {
      id: 'templates' as const,
      label: 'Plantillas',
      icon: Wand2
    },
    {
      id: 'content' as const,
      label: 'Contenido',
      icon: FileText
    },
    {
      id: 'print' as const,
      label: 'Impresión',
      icon: Printer
    }
  ];

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await onSave();
      if (error) {
        setSaveMessage({ type: 'error', text: error });
      } else {
        setSaveMessage({ type: 'success', text: 'Configuración QR guardada correctamente' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Error al guardar la configuración QR' });
    }
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleReset = () => {
    onReset();
    setSaveMessage({ type: 'success', text: 'Cambios descartados' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleResetToDefaults = async () => {
    setShowResetModal(false);
    const result = await onResetToDefaults();
    if (result.error) {
      setSaveMessage({ type: 'error', text: result.error });
    } else {
      setSaveMessage({ type: 'success', text: 'Configuración restablecida a valores por defecto' });
    }
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Show real-time preview notice
  const showPreviewNotice = () => {
    setSaveMessage({ type: 'success', text: 'Los cambios se ven en tiempo real en la vista previa' });
    setTimeout(() => setSaveMessage(null), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="border-b relative" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 px-2 flex items-center justify-center transition-all duration-200"
            style={{
              background: 'linear-gradient(to right, white 50%, transparent)',
              color: '#075E54'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#064e45';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#075E54';
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Tabs Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide"
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id ? '' : 'border-transparent'
              }`}
              style={{
                color: activeTab === tab.id ? '#075E54' : 'rgb(107, 114, 128)',
                borderBottomColor: activeTab === tab.id ? '#075E54' : 'transparent',
                backgroundColor: activeTab === tab.id ? '#075E54' + '08' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 px-2 flex items-center justify-center transition-all duration-200"
            style={{
              background: 'linear-gradient(to left, white 50%, transparent)',
              color: '#075E54'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#064e45';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#075E54';
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'templates' ? (
          <QRTemplatesTab
            onApplyTemplate={(template) => {
              const templateAsConfig = {
                id: config.id,
                business_id: config.business_id,
                qr: {
                  size: template.qr_size,
                  foregroundColor: template.qr_foreground_color,
                  backgroundColor: template.qr_background_color,
                  errorCorrectionLevel: template.qr_error_correction_level,
                  margin: template.qr_margin
                },
                design: {
                  showFrame: template.show_frame,
                  frameColor: template.frame_color,
                  frameThickness: template.frame_thickness || 2,
                  showLogo: template.show_logo,
                  logoShape: template.logo_shape
                },
                background: {
                  type: template.background_type,
                  color: template.background_color,
                  gradient: template.background_gradient_start && template.background_gradient_end ? {
                    start: template.background_gradient_start,
                    end: template.background_gradient_end,
                    direction: template.background_gradient_direction || 'to-b'
                  } : undefined,
                  imageUrl: template.background_image_url || undefined
                },
                content: {
                  ...config.content,
                  showPhone: template.show_phone,
                  showEmail: template.show_email
                },
                typography: {
                  primaryFont: template.tipografia_principal,
                  primaryColor: template.color_tipografia_principal,
                  primaryFontSize: template.tamano_tipografia_principal,
                  secondaryFont: template.tipografia_secundaria,
                  secondaryColor: template.color_tipografia_secundaria,
                  secondaryFontSize: template.tamano_tipografia_secundaria,
                  titleFontSize: template.tamano_titulo,
                  subtitleFontSize: template.tamano_subtitulo,
                  ctaFontSize: template.tamano_cta
                },
                print: {
                  format: template.print_format,
                  orientation: template.print_orientation,
                  qrsPerPage: template.qrs_per_page,
                  includeInstructions: template.include_instructions
                },
                created_at: config.created_at,
                updated_at: config.updated_at
              };
              onConfigUpdate(templateAsConfig);
              setSaveMessage({ type: 'success', text: 'Template aplicado. Recuerda guardar los cambios.' });
              setTimeout(() => setSaveMessage(null), 3000);
            }}
            currentBranchSlug={currentBranchSlug}
          />
        ) : (
          <QRConfigTab
            activeTab={activeTab}
            config={config}
            onConfigUpdate={onConfigUpdate}
            onDownload={onDownload}
            onPrint={onPrint}
            hasChanges={hasChanges}
            onResetToDefaults={() => setShowResetModal(true)}
            selectedBranch={selectedBranch}
          />
        )}
      </div>
      
      {/* Save Button Section */}
      {hasChanges && activeTab !== 'print' && (
        <div className="border-t p-4" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          {/* Save Message */}
          {saveMessage && (
            <div 
              className={`mb-3 p-2 rounded-lg text-xs ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {saveMessage.text}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#075E54',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#075E54';
                }
              }}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
            
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgb(209, 213, 219)',
                color: '#161616'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <RotateCcw size={16} />
              <span>Descartar</span>
            </button>
          </div>
        </div>
      )}

      {/* Print Actions Section - Only show in print tab */}
      {activeTab === 'print' && (
        <div className="border-t p-4" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownload}
              className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border flex-1"
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
              <Download size={16} />
              <span>Descargar QR</span>
            </button>
            
            <button
              onClick={async () => {
                if (onPrint && !isGeneratingPDF) {
                  setIsGeneratingPDF(true);
                  try {
                    await onPrint();
                  } finally {
                    setIsGeneratingPDF(false);
                  }
                }
              }}
              disabled={isGeneratingPDF}
              className="group flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#075E54',
                color: 'white',
                border: '1px solid #075E54'
              }}
              onMouseEnter={(e) => {
                if (!isGeneratingPDF) {
                  e.currentTarget.style.backgroundColor = '#064e45';
                }
              }}
              onMouseLeave={(e) => {
                if (!isGeneratingPDF) {
                  e.currentTarget.style.backgroundColor = '#075E54';
                }
              }}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Printer size={16} />
                  <span>Imprimir QR</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#161616' }}>
              Confirmar Restablecimiento
            </h3>
            <p className="mb-6" style={{ color: 'rgb(107, 114, 128)' }}>
              ¿Estás seguro de que deseas restablecer toda la configuración a los valores por defecto? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border"
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
                Cancelar
              </button>
              <button
                onClick={handleResetToDefaults}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRConfigPanel;