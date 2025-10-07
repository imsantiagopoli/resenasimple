import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UploadProvider } from './components/UploadContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import UploadDocumentModal from './components/UploadDocumentModal';
import { useUpload } from './components/UploadContext';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import InicioPage from './pages/InicioPage';
import MiNegocioPage from './pages/MiNegocioPage';
import PaginaVotacionPage from './pages/PaginaVotacionPage';
import PaginaQRPage from './pages/PaginaQRPage';
import ResenasPage from './pages/ResenasPage';
import RespuestasPage from './pages/RespuestasPage';
import ClientesPage from './pages/ClientesPage';
import VotingPage from './pages/VotingPage';
import SettingsPage from './pages/SettingsPage';
import PoliticasPrivacidadPage from './pages/PoliticasPrivacidadPage';
import TerminosCondicionesPage from './pages/TerminosCondicionesPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleEditorPage from './pages/ArticleEditorPage';

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
        <Route path="/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/v/:slug" element={<VotingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/politicas-de-privacidad" element={<PoliticasPrivacidadPage />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/app/respuestas"
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="respuestas">
                <RespuestasPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/analisis"
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="analisis">
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/clientes"
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="clientes">
                <ClientesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/configuracion"
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="configuracion">
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/article"
          element={
            <ProtectedRoute>
              <ArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:slug"
          element={
            <ProtectedRoute>
              <ArticleEditorPage />
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
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </UploadProvider>
  );
}

export default App;