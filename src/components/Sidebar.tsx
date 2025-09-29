import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  Building2,
  Vote,
  QrCode,
  Star,
  Settings, 
  User, 
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const mainMenuItems = [
    { icon: Home, label: 'Inicio', id: 'inicio', route: '/app/inicio', color: 'rgb(75, 85, 99)' },
    { icon: Building2, label: 'Mi negocio', id: 'mi-negocio', route: '/app/mi-negocio', color: 'rgb(75, 85, 99)' },
    { icon: Vote, label: 'Página de votación', id: 'pagina-votacion', route: '/app/pagina-votacion', color: 'rgb(75, 85, 99)' },
    { icon: QrCode, label: 'Página QR', id: 'pagina-qr', route: '/app/qr', color: 'rgb(75, 85, 99)' },
    { icon: Star, label: 'Reseñas', id: 'resenas', route: '/app/resenas', color: 'rgb(75, 85, 99)' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div 
      className="fixed inset-y-0 left-0 z-40 w-64"
      style={{
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid rgb(229, 231, 235)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center px-4 h-12" style={{ borderBottom: '1px solid rgb(229, 231, 235)' }}>
          <h1 className="text-lg font-bold" style={{ color: '#075E54' }}>
            Reseña Simple
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Menu Items */}
          {mainMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 group ${
                location.pathname === item.route ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: location.pathname === item.route ? '#075E54' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.route) {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.route) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon 
                size={18} 
                className="flex-shrink-0" 
                style={{
                  color: location.pathname === item.route ? 'rgb(255, 255, 255)' : item.color
                }}
              />
              {isOpen && (
                <span 
                  className="ml-3 font-medium text-sm"
                  style={{
                    color: location.pathname === item.route ? 'rgb(255, 255, 255)' : '#161616'
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}

        </nav>

        {/* User Section */}
        <div className="p-4" style={{ borderTop: '1px solid rgb(229, 231, 235)' }}>
          <div className="space-y-3">
            {/* User Info */}
            <div 
              className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: 'rgb(249, 250, 251)' }}
            >
              <div className="flex items-center overflow-hidden">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#075E54' }}
                >
                  <User size={16} style={{ color: 'rgb(255, 255, 255)' }} />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p 
                    className="font-medium text-sm truncate"
                    style={{ color: 'rgb(17, 24, 39)' }}
                  >
                    {user?.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: 'rgb(107, 114, 128)' }}
                  >
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => navigate('/app/configuracion')}
                className="p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                style={{ color: 'rgb(107, 114, 128)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                  e.currentTarget.style.color = '#075E54';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgb(107, 114, 128)';
                }}
                title="Configuración"
              >
                <Settings size={16} />
              </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                const icon = e.currentTarget.querySelector('svg');
                const text = e.currentTarget.querySelector('span');
                if (icon) icon.style.color = 'rgb(185, 28, 28)';
                if (text) text.style.color = 'rgb(185, 28, 28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                const icon = e.currentTarget.querySelector('svg');
                const text = e.currentTarget.querySelector('span');
                if (icon) icon.style.color = 'rgb(75, 85, 99)';
                if (text) text.style.color = '#161616';
              }}
            >
              <LogOut 
                size={16} 
                className="mr-3 flex-shrink-0" 
                style={{ color: 'rgb(75, 85, 99)' }}
              />
              <span 
                className="text-sm font-medium" 
                style={{ color: '#161616' }}
              >
                Cerrar Sesión
              </span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;