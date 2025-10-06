import React, { useState } from 'react';
import { useUpload } from './UploadContext';
import { FileText, Receipt, Scale, Clock, User, Star } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { useSubscription } from '../hooks/useSubscription';
import SubscriptionModal from './SubscriptionModal';

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
  const { user } = useAuth();
  const { profile } = useBusiness();
  const { canAccessApp, loading: subscriptionLoading } = useSubscription(user?.id, profile?.id);

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#075E54' }}></div>
      </div>
    );
  }

  if (!canAccessApp) {
    return <SubscriptionModal user={user} currentBusiness={profile} />;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage={initialActivePage} />

      {/* Main Content */}
      <div
        className="flex-1 ml-64 bg-white shadow-lg relative z-50"
      >
        {/* Page Content */}
        <div
          className="bg-white shadow-sm relative z-10 min-h-screen"
          style={{
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02)'
          }}
        >
          {children || <DashboardContent />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;