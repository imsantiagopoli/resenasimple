import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Cal) {
        window.Cal('init', '15min', { origin: 'https://app.cal.com' });

        window.Cal.ns['15min']('inline', {
          elementOrSelector: '#my-cal-inline-15min',
          config: { layout: 'month_view' },
          calLink: 'resenasimple/15min',
        });

        window.Cal.ns['15min']('ui', {
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Agendar Demo - Reseña Simple"
        description="Agenda una demostración personalizada de Reseña Simple y descubre cómo podemos ayudarte a mejorar las reseñas de tu restaurante."
        url="https://resenasimple.com/demo"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-sm mb-8 transition-colors duration-200"
          style={{ color: '#075E54' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#064e45';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#075E54';
          }}
        >
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#075E54' + '20' }}
            >
              <Calendar size={24} style={{ color: '#075E54' }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#161616' }}>
                Agenda tu Demo Personalizada
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Reserva una sesión de 15 minutos con nuestro equipo para descubrir cómo
            Reseña Simple puede transformar la gestión de reseñas de tu restaurante.
          </p>
        </div>

        <div
          className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ minHeight: '700px' }}
        >
          <div
            id="my-cal-inline-15min"
            style={{ width: '100%', height: '100%', minHeight: '700px', overflow: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    Cal: any;
  }
}

export default DemoPage;
