import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {isHomePage ? (
            <h1 className="text-xl font-bold" style={{ color: '#075E54' }}>
              Reseña Simple
            </h1>
          ) : (
            <Link 
              to="/"
              className="text-xl font-bold transition-opacity duration-200 hover:opacity-80"
              style={{ color: '#075E54' }}
            >
              Reseña Simple
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href={isHomePage ? "#features" : "/#features"}
              className="text-sm font-medium transition-colors duration-200 py-2"
              style={{ color: 'rgb(107, 114, 128)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
            >
              Características
            </a>
            <a
              href={isHomePage ? "#features" : "/#features"}
              className="text-sm font-medium transition-colors duration-200 py-2"
              style={{ color: 'rgb(107, 114, 128)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
            >
              Cómo Funciona
            </a>
            <a
              href={isHomePage ? "#pricing" : "/#pricing"}
              className="text-sm font-medium transition-colors duration-200 py-2"
              style={{ color: 'rgb(107, 114, 128)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
            >
              Precios
            </a>
            <Link
              to="/blog"
              className="text-sm font-medium transition-colors duration-200 py-2"
              style={{ color: 'rgb(107, 114, 128)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#075E54'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(107, 114, 128)'}
            >
              Blog
            </Link>
            <Link 
              to="/auth"
              className="px-6 py-2 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                backgroundColor: '#075E54', 
                color: 'white',
                borderColor: '#075E54'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#064e45';
                e.currentTarget.style.borderColor = '#064e45';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#075E54';
                e.currentTarget.style.borderColor = '#075E54';
              }}
            >
              Comenzar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{ color: 'rgb(107, 114, 128)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                e.currentTarget.style.color = '#075E54';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgb(107, 114, 128)';
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div className="flex flex-col space-y-4">
              <a
                href={isHomePage ? "#features" : "/#features"}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </a>
              <a
                href={isHomePage ? "#features" : "/#features"}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a
                href={isHomePage ? "#pricing" : "/#pricing"}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </a>
              <Link
                to="/blog"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgb(107, 114, 128)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/auth"
                className="px-6 py-2 rounded-lg text-sm font-medium border transition-all duration-200 text-center"
                style={{
                  backgroundColor: '#075E54',
                  color: 'white',
                  borderColor: '#075E54'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Comenzar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;