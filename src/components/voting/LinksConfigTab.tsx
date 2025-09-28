import React, { useState } from 'react';
import { Building2, ExternalLink, Copy, Eye, Check } from 'lucide-react';
import { VotingConfiguration } from '../../hooks/useVotingConfig';
import { useBusiness } from '../../hooks/useBusiness';

interface LinksConfigTabProps {
  config: VotingConfiguration;
  onConfigUpdate: (updates: Partial<VotingConfiguration>) => void;
}

const LinksConfigTab: React.FC<LinksConfigTabProps> = ({ config, onConfigUpdate }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { branches } = useBusiness();

  // Use real branches data
  const branchesData = branches.map(branch => ({
    id: branch.id,
    name: branch.name,
    address: branch.address || 'Sin dirección configurada',
    slug: branch.slug,
    isMain: branch.is_main
  }));

  const generateVotingLink = (slug: string) => {
    return `https://reseñasimple.com/v/${slug}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold" style={{ color: '#161616' }}>
          Links de Votación
        </h3>
        <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
          Links únicos para cada sucursal donde los clientes pueden votar y dejar reseñas
        </p>
      </div>

      {/* Links por Sucursal */}
      <div className="space-y-4">
        {branchesData.map((branch) => {
          const votingLink = generateVotingLink(branch.slug);
          
          return (
            <div
              key={branch.id}
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'rgb(229, 231, 235)'
              }}
            >
              {/* Header de Sucursal */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: branch.isMain ? '#075E54' + '20' : 'rgb(243, 244, 246)' }}
                  >
                    <Building2 size={20} style={{ color: branch.isMain ? '#075E54' : 'rgb(107, 114, 128)' }} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold" style={{ color: '#161616' }}>
                        {branch.name}
                      </h4>
                      {branch.isMain && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#075E54' + '20',
                            color: '#075E54'
                          }}
                        >
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      {branch.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Link de Votación */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium mb-1" style={{ color: 'rgb(107, 114, 128)' }}>
                      Link de Votación
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(votingLink)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 hover:shadow-sm"
                        style={{
                          backgroundColor: copiedLink === votingLink ? '#10b981' : '#075E54',
                          color: 'white'
                        }}
                        title={copiedLink === votingLink ? "¡Copiado!" : "Copiar link"}
                      >
                        <div className="flex items-center space-x-1">
                          {copiedLink === votingLink ? <Check size={12} /> : <Copy size={12} />}
                          <span>Copy Link</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border p-3 overflow-hidden">
                    <p 
                      className="text-sm font-mono break-all"
                      style={{ 
                        color: '#161616',
                        wordBreak: 'break-all',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {votingLink}
                    </p>
                  </div>
                </div>

                {/* Acciones Adicionales */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openLink(votingLink)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'rgb(209, 213, 219)',
                      color: 'rgb(107, 114, 128)',
                      border: '1px solid rgb(209, 213, 219)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <Eye size={14} />
                    <span>Vista Previa</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información Adicional */}
      <div 
        className="p-4 rounded-lg"
        style={{ 
          backgroundColor: '#075E54' + '08',
          border: '1px solid #075E54' + '30'
        }}
      >
        <h4 className="font-medium text-sm mb-2" style={{ color: '#075E54' }}>
          💡 Cómo usar estos links
        </h4>
        <ul className="text-sm space-y-1" style={{ color: 'rgb(107, 114, 128)' }}>
          <li>• Comparte estos links con tus clientes o imprime códigos QR</li>
          <li>• Cada sucursal tiene su link único para mejor seguimiento</li>
          <li>• Los clientes votarán y serán redirigidos según tu configuración</li>
          <li>• Puedes ver estadísticas separadas por sucursal</li>
        </ul>
      </div>
    </div>
  );
};

export default LinksConfigTab;