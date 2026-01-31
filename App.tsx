
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
import { KwibleManager } from './pages/KwibleManager';
import { UserRole } from './types';

const AppContent = () => {
  const { view, currentUser } = useApp();

  // If user is admin and trying to view dashboard, show AdminDashboard instead
  if (view === 'DASHBOARD' && currentUser?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // If user is business, they get the Jira-like Kwible Manager experience
  if (view === 'MANAGER' && currentUser?.role === UserRole.BUSINESS) {
    return <KwibleManager />;
  }

  return (
    <Layout>
      {view === 'LANDING' && <LandingPage />}
      {view === 'AUTH' && <AuthPage />}
      {view === 'DASHBOARD' && <Dashboard />}
      {view === 'MANAGER' && <KwibleManager />}
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
