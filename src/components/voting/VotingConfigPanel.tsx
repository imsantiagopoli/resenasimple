import React, { useState } from 'react';
import { Palette, Brain, Link, Save, RotateCcw } from 'lucide-react';
import DesignConfigTab from './DesignConfigTab';
import LogicConfigTab from './LogicConfigTab';
import LinksConfigTab from './LinksConfigTab';
import { VotingConfiguration } from '../../hooks/useVotingConfig';

interface VotingConfigPanelProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
  hasChanges: boolean;
  onSave: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  onReset: () => void;
  onResetToDefaults: () => Promise<{ data: VotingConfiguration | null; error: string | null }>;
  isSaving: boolean;
}

const VotingConfigPanel: React.FC<VotingConfigPanelProps> = ({
  config,
  onConfigUpdate,
  hasChanges,
  onSave,
  onReset,
  onResetToDefaults,
  isSaving
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'logic' | 'links'>('design');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const tabs = [
    {
      id: 'design' as const,
      label: 'Diseño',
      icon: Palette
    },
    {
      id: 'logic' as const,
      label: 'Lógica',
      icon: Brain
    },
    {
      id: 'links' as const,
      label: 'Links',
      icon: Link
    }
  ];

  const handleSave = async () => {
    try {
      const { error } = await onSave();
      if (error) {
        setSaveMessage({ type: 'error', text: error });
      } else {
        setSaveMessage({ type: 'success', text: 'Configuración guardada correctamente' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Error al guardar la configuración' });
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

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Header */}
      <div className="border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
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
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'design' && (
          <DesignConfigTab
            config={config}
            onConfigUpdate={onConfigUpdate}
            hasChanges={hasChanges}
            onResetToDefaults={() => setShowResetModal(true)}
          />
        )}
        {activeTab === 'logic' && (
          <LogicConfigTab
            config={config}
            onConfigUpdate={onConfigUpdate}
            hasChanges={hasChanges}
            onResetToDefaults={() => setShowResetModal(true)}
          />
        )}
        {activeTab === 'links' && (
          <LinksConfigTab
            config={config}
            onConfigUpdate={onConfigUpdate}
            hasChanges={hasChanges}
            onResetToDefaults={() => setShowResetModal(true)}
          />
        )}
      </div>
      
      {/* Save Button Section */}
      {hasChanges && (
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

export default VotingConfigPanel;