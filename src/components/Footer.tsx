import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Enlaces legales esenciales
  const legalLinks = [
    { name: 'Políticas de Privacidad', href: '/politicas-de-privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {currentYear} Reseña Simple. Todos los derechos reservados.
          </p>

          {/* Enlaces legales */}
          <div className="flex items-center gap-x-6">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-500 hover:text-[#075E54] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;