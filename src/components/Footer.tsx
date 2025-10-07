import React from 'react';
import { 
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Enlaces legales esenciales
  const legalLinks = [
    { name: 'Políticas de Privacidad', href: '/politicas-de-privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  ];

  // Enlaces a redes sociales
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' }
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {currentYear} Reseña Simple. Todos los derechos reservados.
          </p>

          {/* Enlaces legales y sociales */}
          <div className="flex items-center gap-x-6">
            {/* Enlaces Legales */}
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

            {/* Iconos Sociales */}
            <div className="flex items-center gap-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="text-gray-500 hover:text-[#075E54] transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;