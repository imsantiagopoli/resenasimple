import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UploadProvider } from './components/UploadContext';
import ProtectedRoute from './components/ProtectedRoute';
import UploadDocumentModal from './components/UploadDocumentModal';
import { useUpload } from './components/UploadContext';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import InicioPage from './pages/InicioPage';
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
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout activePage="inicio">
                <InicioPage />
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