import React, { useState } from 'react';
import { Palette, Brain, Link, Building2, ChevronDown } from 'lucide-react';
import DesignConfigTab from './DesignConfigTab';
import LogicConfigTab from './LogicConfigTab';
import LinksConfigTab from './LinksConfigTab';
import { VotingConfiguration } from '../../hooks/useVotingConfig';
import { BusinessBranch } from '../../hooks/useBusiness';

interface VotingConfigPanelProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
  branches: BusinessBranch[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
}

const VotingConfigPanel: React.FC<VotingConfigPanelProps> = ({ 
  config, 
  onConfigUpdate, 
  branches, 
  selectedBranchId, 
  onBranchChange 
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'logic' | 'links'>('design');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

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

  const selectedBranch = branches.find(branch => branch.id === selectedBranchId) || branches[0];

  return (
    <div className="h-full flex flex-col">
      {/* Branch Selector */}
      <div className="p-4 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#161616' }}>
            Configuración para:
          </label>
          <div className="relative">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
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
              <div className="flex items-center space-x-2">
                <Building2 size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                <span>{selectedBranch?.name}</span>
                {selectedBranch?.is_main && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: '#075E54' + '20',
                      color: '#075E54'
                    }}
                  >
                    Principal
                  </span>
                )}
              </div>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${isBranchDropdownOpen ? 'rotate-180' : ''}`}
                style={{ color: 'rgb(107, 114, 128)' }}
              />
            </button>
            
            {isBranchDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg bg-white z-10 overflow-hidden"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      onBranchChange(branch.id);
                      setIsBranchDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left transition-colors duration-200 flex items-center justify-between"
                    style={{ 
                      color: '#161616',
                      backgroundColor: selectedBranchId === branch.id ? '#075E54' + '10' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedBranchId !== branch.id) {
                        e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedBranchId !== branch.id) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{branch.name}</span>
                      {branch.is_main && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#075E54' + '20',
                            color: '#075E54'
                          }}
                        >
                          Principal
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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