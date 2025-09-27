import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadContextType {
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <UploadContext.Provider value={{ isUploadModalOpen, openUploadModal, closeUploadModal }}>
      {children}
    </UploadContext.Provider>
  );
};