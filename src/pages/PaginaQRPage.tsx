import React, { useState } from 'react';
import QRConfigPanel from '../components/qr/QRConfigPanel';
import QRPreviewPanel from '../components/qr/QRPreviewPanel';

export interface QRConfig {
  // Configuración del QR
  qr: {
    size: number;
    foregroundColor: string;
    backgroundColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
  };
  // Diseño
  design: {
    showLogo: boolean;
    logoSize: number;
    showFrame: boolean;
    frameColor: string;
    frameThickness: number;
  };
  // Texto y llamada a la acción
  content: {
    showTitle: boolean;
    title: string;
    showSubtitle: boolean;
    subtitle: string;
    showCallToAction: boolean;
    callToAction: string;
  };
  // Configuración de sucursal
  branch: {
    selectedBranchId: number;
    branchName: string;
    branchSlug: string;
  };
  // Configuración de impresión
  print: {
    format: 'A4' | 'Letter' | 'Custom';
    orientation: 'portrait' | 'landscape';
    qrsPerPage: number;
    includeInstructions: boolean;
  };
}

const PaginaQRPage: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>({
    qr: {
      size: 200,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
      margin: 4
    },
    design: {
      showLogo: true,
      logoSize: 50,
      showFrame: false,
      frameColor: '#075E54',
      frameThickness: 4
    },
    content: {
      showTitle: true,
      title: '¿Cómo fue tu experiencia?',
      showSubtitle: true,
      subtitle: 'Escanea el código QR y comparte tu opinión',
      showCallToAction: true,
      callToAction: 'Escanear para votar'
    },
    branch: {
      selectedBranchId: 1,
      branchName: 'Sucursal Centro',
      branchSlug: 'pizzeria-napolitana-centro'
    },
    print: {
      format: 'A4',
      orientation: 'portrait',
      qrsPerPage: 1,
      includeInstructions: true
    }
  });

  const updateConfig = (updates: Partial<QRConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      qr: {
        ...prev.qr,
        ...(updates.qr || {})
      },
      design: {
        ...prev.design,
        ...(updates.design || {})
      },
      content: {
        ...prev.content,
        ...(updates.content || {})
      },
      branch: {
        ...prev.branch,
        ...(updates.branch || {})
      },
      print: {
        ...prev.print,
        ...(updates.print || {})
      }
    }));
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex h-screen">
        {/* Columna izquierda - Configuración QR (más estrecha) */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <QRConfigPanel config={config} onConfigUpdate={updateConfig} />
        </div>
        
        {/* Columna derecha - Vista previa QR (más ancha) */}
        <div className="w-3/5 h-screen overflow-hidden">
          <QRPreviewPanel config={config} />
        </div>
      </div>
    </div>
  );
};

export default PaginaQRPage;