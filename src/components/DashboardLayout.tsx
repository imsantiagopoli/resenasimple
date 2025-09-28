import React, { useState } from 'react';
import { BusinessProvider } from '../contexts/BusinessContext';
import { useUpload } from './UploadContext';
import { FileText, Receipt, Scale, Clock, User, Star } from 'lucide-react';
import Sidebar from './Sidebar';

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

  return (
    <BusinessProvider>
    // CAMBIO 1: Añadido fondo gris al contenedor principal.
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage={initialActivePage} />

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
          {children || <DashboardContent />}
        </div>
      </div>
    </div>
    </BusinessProvider>
  );
};

export default DashboardLayout;