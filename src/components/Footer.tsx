import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Building2
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Integrations', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Status Page', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Blog', href: '#' }
    ],
    resources: [
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Case Studies', href: '#' }
    ],
    legal: [
      { name: 'Políticas de Privacidad', href: '/politicas-de-privacidad' },
      { name: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
      { name: 'Seguridad', href: '#' },
      { name: 'Cookies', href: '#' },
      { name: 'GDPR', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' }
  ];

  return (
    <footer 
      className="border-t bg-white"
      style={{ borderColor: 'rgb(229, 231, 235)' }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#075E54' }}>
                    Reseña Simple
                  </h3>
                  <p 
                    className="text-xs font-medium"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    Gestión de Reseñas
                  </p>
                </div>
              </div>

              {/* Description */}
              <p 
                className="text-base leading-relaxed max-w-sm"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                Mejora la reputación online de tu restaurante con nuestro sistema de filtrado de reseñas 
                y códigos QR personalizables.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                  <span 
                    className="text-sm"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    hola@resenasimple.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                  <span 
                    className="text-sm"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} style={{ color: 'rgb(107, 114, 128)' }} />
                  <span 
                    className="text-sm"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    Buenos Aires, Argentina
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 pt-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: 'rgb(243, 244, 246)',
                      color: 'rgb(107, 114, 128)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#075E54';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                      e.currentTarget.style.color = 'rgb(107, 114, 128)';
                    }}
                    aria-label={social.name}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product */}
              <div>
                <h4 
                  className="font-semibold mb-4"
                  style={{ color: '#161616' }}
                >
                  Product
                </h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 flex items-center group"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                      >
                        {link.name}
                        {link.href.startsWith('#') && link.href !== '#features' && link.href !== '#pricing' && (
                          <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 
                  className="font-semibold mb-4"
                  style={{ color: '#161616' }}
                >
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 flex items-center group"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                      >
                        {link.name}
                        <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 
                  className="font-semibold mb-4"
                  style={{ color: '#161616' }}
                >
                  Resources
                </h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 flex items-center group"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                      >
                        {link.name}
                        <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4
                  className="font-semibold mb-4"
                  style={{ color: '#161616' }}
                >
                  Legal
                </h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 flex items-center group"
                        style={{ color: 'rgb(107, 114, 128)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
                      >
                        {link.name}
                        {link.href.startsWith('#') && (
                          <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t py-6"
        style={{ borderColor: 'rgb(229, 231, 235)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p 
              className="text-sm text-center md:text-left"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              © {currentYear} Reseña Simple. Todos los derechos reservados.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-xs">
              <span 
                className="flex items-center font-medium"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: 'rgb(34, 197, 94)' }}
                />
                Seguridad Avanzada
              </span>
              <span 
                className="flex items-center font-medium"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: 'rgb(34, 197, 94)' }}
                />
                Datos Protegidos
              </span>
              <span 
                className="flex items-center font-medium"
                style={{ color: 'rgb(107, 114, 128)' }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: 'rgb(34, 197, 94)' }}
                />
                99.9% Disponibilidad
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;