import React, { useState } from 'react';
import { QrCode, Palette, FileText, Printer } from 'lucide-react';
import QRConfigTab from './QRConfigTab';
import { QRConfig } from '../../pages/PaginaQRPage';

interface QRConfigPanelProps {
  config: QRConfig;
  onConfigUpdate: (updates: Partial<QRConfig>) => void;
}

const QRConfigPanel: React.FC<QRConfigPanelProps> = ({ config, onConfigUpdate }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'print'>('design');

  const tabs = [
    {
      id: 'design' as const,
      label: 'Diseño',
      icon: QrCode
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
        <QRConfigTab activeTab={activeTab} config={config} onConfigUpdate={onConfigUpdate} />
      </div>
    </div>
  );
};

export default QRConfigPanel;