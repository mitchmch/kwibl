
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { CommunityPage } from './pages/CommunityPage';
import { FriendsPage } from './pages/FriendsPage';
import { UserRole } from './types';

const AppContent = () => {
  const { view, currentUser } = useApp();

  // If user is admin and trying to view dashboard, show AdminDashboard instead
  // Note: We bypass the standard Layout for Admin Dashboard as it has its own Sidebar layout
  if (view === 'DASHBOARD' && currentUser?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  return (
    <Layout>
      {view === 'LANDING' && <LandingPage />}
      {view === 'AUTH' && <AuthPage />}
      {view === 'DASHBOARD' && <Dashboard />}
      {view === 'MESSAGES' && <MessagesPage />}
      {view === 'FORUMS' && <CommunityPage />}
      {view === 'FRIENDS' && <FriendsPage />}
      {view === 'PROFILE' && <ProfilePage />}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
