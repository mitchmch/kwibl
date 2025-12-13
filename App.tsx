import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent = () => {
  const { view } = useApp();

  return (
    <Layout>
      {view === 'LANDING' && <LandingPage />}
      {view === 'AUTH' && <AuthPage />}
      {view === 'DASHBOARD' && <Dashboard />}
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