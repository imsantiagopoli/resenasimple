import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Home,
  Building2,
  Vote,
  QrCode,
  Star,
  MessageSquare,
  Users,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mainMenuItems = [
    { icon: Home, label: 'Inicio', id: 'inicio', route: '/app/inicio', color: 'rgb(75, 85, 99)' },
    { icon: Building2, label: 'Mi negocio', id: 'mi-negocio', route: '/app/mi-negocio', color: 'rgb(75, 85, 99)' },
    { icon: Vote, label: 'Página de votación', id: 'pagina-votacion', route: '/app/pagina-votacion', color: 'rgb(75, 85, 99)' },
    { icon: QrCode, label: 'QR', id: 'pagina-qr', route: '/app/qr', color: 'rgb(75, 85, 99)' },
    { icon: MessageSquare, label: 'Respuestas', id: 'respuestas', route: '/app/respuestas', color: 'rgb(75, 85, 99)' },
    { icon: BarChart3, label: 'Análisis', id: 'analisis', route: '/app/analisis', color: 'rgb(75, 85, 99)' },
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
              <span 
                className="ml-3 font-medium text-sm"
                style={{
                  color: location.pathname === item.route ? 'rgb(255, 255, 255)' : '#161616'
                }}
              >
                {item.label}
              </span>
            </button>
          ))}

        </nav>

        {/* User Section */}
        <div className="p-4" style={{ borderTop: '1px solid rgb(229, 231, 235)' }}>
          {/* User Menu Dropdown */}
          <div className="relative">
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border shadow-lg bg-white z-10 overflow-hidden"
                style={{ borderColor: 'rgb(229, 231, 235)' }}
              >
                <button
                  onClick={() => {
                    navigate('/app/configuracion');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm transition-colors duration-200"
                  style={{ 
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <Settings size={16} className="mr-3" style={{ color: 'rgb(107, 114, 128)' }} />
                  <span>Configuración</span>
                </button>
                
                <div className="border-t" style={{ borderColor: 'rgb(229, 231, 235)' }} />
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm transition-colors duration-200"
                  style={{ 
                    color: '#161616',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)';
                    const icon = e.currentTarget.querySelector('svg');
                    const text = e.currentTarget.querySelector('span');
                    if (icon) icon.style.color = 'rgb(185, 28, 28)';
                    if (text) text.style.color = 'rgb(185, 28, 28)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    const icon = e.currentTarget.querySelector('svg');
                    const text = e.currentTarget.querySelector('span');
                    if (icon) icon.style.color = 'rgb(107, 114, 128)';
                    if (text) text.style.color = '#161616';
                  }}
                >
                  <LogOut size={16} className="mr-3" style={{ color: 'rgb(107, 114, 128)' }} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
            
            {/* User Card Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center p-3 rounded-lg transition-all duration-200"
              style={{ backgroundColor: 'rgb(249, 250, 251)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(249, 250, 251)';
              }}
            >
              <div className="flex items-center overflow-hidden flex-1">
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
              
              {/* Dropdown Arrow */}
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                style={{ color: 'rgb(107, 114, 128)' }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;