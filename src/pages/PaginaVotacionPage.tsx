import React, { useState } from 'react';
import VotingConfigPanel from '../components/voting/VotingConfigPanel';
import VotingPreviewPanel from '../components/voting/VotingPreviewPanel';

export interface VotingConfig {
  // Diseño
  design: {
    message: {
      headline: string;
      body: string;
    };
    showLogo: boolean;
    logoDisplayPages: 'all' | 'voting-only';
    starLabels: {
      enabled: boolean;
      labels: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
      };
    };
    logoShape: 'circular' | 'square';
    specialOffer: {
      enabled: boolean;
      headline: string;
      body: string;
    };
    socials: {
      instagram: boolean;
      tiktok: boolean;
      linkedin: boolean;
      twitter: boolean;
      youtube: boolean;
      website: boolean;
    };
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
  };
  // Lógica
  logic: {
    threshold: number;
    smartAutoRedirect: boolean;
    publicWorkflow: {
      thankYouMessage: string;
      buttonText: string;
    };
    privateWorkflow: {
      feedbackMessage: string;
      thankYouMessage: 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
      collectName: false,
      nameRequired: false,
      collectPhone: false,
      phoneRequired: false
      collectEmail: boolean;
      emailRequired: boolean;
     collectName: boolean;
     nameRequired: boolean;
     collectPhone: boolean;
     phoneRequired: boolean;
    };
    prompt: {
      enabled: boolean;
      text: string;
    };
  };
}

const PaginaVotacionPage: React.FC = () => {
  const [config, setConfig] = useState<VotingConfig>({
    design: {
      message: {
        headline: 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
        body: 'Tomate un momento para compartir tu experiencia con nosotros. Tu opinión guía nuestro servicio y ayuda a otros clientes.'
      },
      showLogo: true,
      logoDisplayPages: 'all',
      logoShape: 'circular',
      starLabels: {
        enabled: true,
        labels: {
          1: 'Muy malo',
          2: 'Regular', 
          3: 'Aceptable',
          4: 'Bueno',
          5: 'Excelente'
        }
      },
      specialOffer: {
        enabled: false,
        headline: '¡Oferta exclusiva para reseñadores!',
        body: 'Deja una reseña y obtené un 10% de descuento en tu próxima compra. Enviá un screenshot de la página de agradecimiento para reclamar tu beneficio.'
      },
      socials: {
        instagram: true,
        tiktok: true,
        linkedin: false,
        twitter: false,
        youtube: false,
        website: true
      }
    },
    typography: {
      primaryFont: 'Cabinet Grotesk',
      secondaryFont: 'Cabinet Grotesk'
    },
    colors: {
      buttonColor: '#075E54'
    },
    logic: {
      threshold: 4,
      smartAutoRedirect: true,
      publicWorkflow: {
        thankYouMessage: 'Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.',
        buttonText: 'Califícanos en Google'
      },
      privateWorkflow: {
        feedbackMessage: 'Tu opinión es muy valiosa. Por favor, contanos cómo podemos mejorar.',
        thankYouMessage: 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
        collectName: false,
        nameRequired: false,
        collectPhone: false,
        phoneRequired: false,
        collectEmail: false,
        emailRequired: false
      },
      prompt: {
        enabled: true,
        text: 'Tu opinión es importante. Antes de enviar una reseña neutral o negativa, ¿podrías compartir tus comentarios en privado para ayudarnos a mejorar?'
      }
    }
  });

  const updateConfig = (updates: Partial<VotingConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      design: {
        ...prev.design,
        ...(updates.design || {})
      },
      logic: {
        ...prev.logic,
        ...(updates.logic || {})
      }
    }));
  };

  return (
    <div className="h-screen bg-white">
      <div className="flex h-screen">
        {/* Columna izquierda - Configuración (más estrecha) */}
        <div className="w-2/5 border-r overflow-y-auto" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <VotingConfigPanel config={config} onConfigUpdate={updateConfig} />
        </div>
        
        {/* Columna derecha - Vista previa (más ancha) */}
        <div className="w-3/5 h-screen overflow-hidden">
          <VotingPreviewPanel config={config} />
        </div>
      </div>
    </div>
  );
};

export default PaginaVotacionPage;