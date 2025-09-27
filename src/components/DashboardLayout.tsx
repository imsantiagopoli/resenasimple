import React, { useState } from 'react';
import { useUpload } from './UploadContext';
import { FileText, Receipt, Scale, Clock, User, Star } from 'lucide-react';
import Sidebar from './Sidebar';
import MiNegocioPage from '../pages/MiNegocioPage';
import PaginaVotacionPage from '../pages/PaginaVotacionPage';
import PaginaQRPage from '../pages/PaginaQRPage';
import ResenasPage from '../pages/ResenasPage';

import DashboardContent from './DashboardContent';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  activePage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({  
  children,  
  activePage: initialActivePage = 'inicio'
}) => {
  const { openUploadModal } = useUpload();
  const [activePage, setActivePage] = useState(initialActivePage);

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const renderPageContent = () => {
    switch (activePage) {
      case 'inicio':
        return children || <DashboardContent />;
      case 'mi-negocio':
        return <MiNegocioPage />;
      case 'pagina-votacion':
        return <PaginaVotacionPage />;
      case 'pagina-qr':
        return <PaginaQRPage />;
      case 'resenas':
        return <ResenasPage />;
      default:
        return children || <DashboardContent />;
    }
  };

  return (
    // CAMBIO 1: Añadido fondo gris al contenedor principal.
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />

      {/* Main Content */}
      {/* CAMBIO 2: Se ajustaron las clases para un mejor efecto de sombra y posicionamiento. */}
      <div 
        className="flex-1 flex flex-col ml-64 bg-white shadow-lg relative z-50"
      >
        {/* Top Header */}

        {/* Page Content */}
        <div 
          className="bg-white shadow-sm relative z-10"
          style={{ 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02)' 
          }}
        >
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;