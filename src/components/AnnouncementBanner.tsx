import React from 'react';
import { ArrowRight, X } from 'lucide-react';

const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="relative py-2 px-4"
      style={{ backgroundColor: '#075E54' }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center text-center relative">
          <div className="flex items-center space-x-2 text-sm font-medium text-white">
            <span>🍕</span>
            <span>
              Más de 500 restaurantes ya mejoraron sus reseñas con Reseña Simple
            </span>
            <a
              href="/auth"
              className="inline-flex items-center space-x-1 underline hover:no-underline transition-all duration-200"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span>Comenzar gratis</span>
              <ArrowRight size={12} />
            </a>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 p-1 rounded-full transition-all duration-200"
            style={{ color: 'white' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Cerrar anuncio"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;