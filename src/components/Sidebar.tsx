import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const mainMenuItems = [
    { icon: Home, label: 'Inicio', id: 'inicio', color: 'rgb(75, 85, 99)' },
    { icon: Building2, label: 'Mi negocio', id: 'mi-negocio', color: 'rgb(75, 85, 99)' },
    { icon: Vote, label: 'Página de votación', id: 'pagina-votacion', color: 'rgb(75, 85, 99)' },
    { icon: QrCode, label: 'Página QR', id: 'pagina-qr', color: 'rgb(75, 85, 99)' },
    { icon: Star, label: 'Reseñas', id: 'resenas', color: 'rgb(75, 85, 99)' },
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
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 group ${
                item.id === activePage ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: item.id === activePage ? '#075E54' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (item.id !== activePage) {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }
              }}
              onMouseLeave={(e) => {
                if (item.id !== activePage) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon 
                size={18} 
                className="flex-shrink-0" 
                style={{
                  color: item.id === activePage ? 'rgb(255, 255, 255)' : item.color
                }}
              />
              {isOpen && (
                <span 
                  className="ml-3 font-medium text-sm"
                  style={{
                    color: item.id === activePage ? 'rgb(255, 255, 255)' : '#161616'
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
          <div className="space-y-2">
            {/* User Info */}
            <div 
              className="flex items-center p-2.5 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: 'rgb(249, 250, 251)' }}
            >
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

            {/* Profile and Settings */}
            <div className="space-y-1">
              <button
                onClick={() => onPageChange('settings')}
                className="flex items-center px-2 py-1.5 rounded-md transition-colors duration-200 focus:outline-none"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Settings 
                  size={16} 
                  className="mr-2 flex-shrink-0" 
                  style={{ color: 'rgb(75, 85, 99)' }}
                />
                <span 
                  className="text-sm" 
                  style={{ color: '#161616' }}
                >
                  Profile Settings
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-1.5 rounded-md transition-all duration-200"
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
                  className="mr-2 flex-shrink-0" 
                  style={{ color: 'rgb(75, 85, 99)' }}
                />
                <span 
                  className="text-sm" 
                  style={{ color: '#161616' }}
                >
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;