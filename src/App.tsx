import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UploadProvider } from './components/UploadContext';
import ProtectedRoute from './components/ProtectedRoute';
import UploadDocumentModal from './components/UploadDocumentModal';
import { useUpload } from './components/UploadContext';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import InicioPage from './pages/InicioPage';
import MiNegocioPage from './pages/MiNegocioPage';
import PaginaVotacionPage from './pages/PaginaVotacionPage';
import PaginaQRPage from './pages/PaginaQRPage';
import ResenasPage from './pages/ResenasPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';

const AppContent: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal } = useUpload();

  const handleUpload = (uploadData: any) => {
    console.log('Uploaded documents:', uploadData);
    // Here you would typically send the data to your backend
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogArticlePage />} />
        <Route 
          path="/app/inicio" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="inicio">
                <InicioPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/mi-negocio" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="mi-negocio">
                <MiNegocioPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/pagina-votacion" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="pagina-votacion">
                <PaginaVotacionPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/qr" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="pagina-qr">
                <PaginaQRPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/resenas" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="resenas">
                <ResenasPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {/* Global Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onUpload={handleUpload}
      />
    </>
  );
};

function App() {
  return (
    <UploadProvider>
      <Router>
        <AppContent />
      </Router>
    </UploadProvider>
  );
}

export default App;