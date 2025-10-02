import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import VotingPagePreview from './VotingPagePreview';
import { VotingConfiguration } from '../../hooks/useVotingConfig';
import { BusinessProfile } from '../../contexts/DataContext';

interface VotingPreviewPanelProps {
  config: VotingConfiguration;
  businessProfile: BusinessProfile | null;
}

type PreviewType = 'voting' | 'private-feedback' | 'public-review' | 'private-thanks';

const VotingPreviewPanel: React.FC<VotingPreviewPanelProps> = ({ config, businessProfile }) => {
  const [selectedView, setSelectedView] = useState<PreviewType>('voting');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const viewOptions = [
    { id: 'voting' as const, label: 'Página de votación' },
    { id: 'public-review' as const, label: 'Solicitud de reseña pública' },
    { id: 'private-feedback' as const, label: 'Solicitud de feedback privado' },
    { id: 'private-thanks' as const, label: 'Página de agradecimiento de feedback privado' }
  ];

  const selectedOption = viewOptions.find(option => option.id === selectedView);

  return (
    <div className="h-full flex flex-col">
      {/* Header con selector */}
      <div className="p-4 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
            Vista Previa
          </h3>
          <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#075E54' + '20', color: '#075E54' }}>
            En vivo
          </div>
        </div>
        
        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all duration-200"
            style={{
              borderColor: 'rgb(209, 213, 219)',
              color: '#161616',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(156, 163, 175)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
            }}
          >
            <span>{selectedOption?.label}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: 'rgb(107, 114, 128)' }}
            />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg bg-white z-10 overflow-hidden"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
            >
              {viewOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedView(option.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left transition-colors duration-200"
                  style={{ 
                    color: '#161616',
                    backgroundColor: selectedView === option.id ? '#075E54' + '10' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedView !== option.id) {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedView !== option.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        <VotingPagePreview config={config} viewType={selectedView} businessProfile={businessProfile} />
      </div>
    </div>
  );
};

export default VotingPreviewPanel;