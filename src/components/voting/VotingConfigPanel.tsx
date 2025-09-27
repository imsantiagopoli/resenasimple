import React, { useState } from 'react';
import { Palette, Brain, Link } from 'lucide-react';
import DesignConfigTab from './DesignConfigTab';
import LogicConfigTab from './LogicConfigTab';
import LinksConfigTab from './LinksConfigTab';
import { VotingConfig } from '../../pages/PaginaVotacionPage';

interface VotingConfigPanelProps {
  config: VotingConfig;
  onConfigUpdate: (updates: Partial<VotingConfig>) => void;
}

const VotingConfigPanel: React.FC<VotingConfigPanelProps> = ({ config, onConfigUpdate }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'logic' | 'links'>('design');

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
          <DesignConfigTab config={config} onConfigUpdate={onConfigUpdate} />
        )}
        {activeTab === 'logic' && (
          <LogicConfigTab config={config} onConfigUpdate={onConfigUpdate} />
        )}
        {activeTab === 'links' && (
          <LinksConfigTab config={config} onConfigUpdate={onConfigUpdate} />
        )}
      </div>
    </div>
  );
};

export default VotingConfigPanel;