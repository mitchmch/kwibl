import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminViewType, ComplaintStatus, Complaint } from '../types';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminModeration, AdminPolicyAnalysis, AdminBusinesses, AdminIndustries, AdminEscalations, AdminContentReports } from '../components/admin/AdminManagement';
import { AdminSettingsGeneral, AdminSettingsBranding, AdminTechStack } from '../components/admin/AdminSettings';
import { AdminPageBanners, AdminNavigation, AdminTranslations, AdminFooter, AdminHomepage } from '../components/admin/AdminSiteSettings';
import { AdminAllComplaints, AdminUsers } from '../components/admin/AdminDataViews';
import { AdminCompliance } from '../components/admin/AdminCompliance';
import { AdminAnalytics, AdminSentimentIntel } from '../components/admin/AdminAnalytics';
import { AdminNews } from '../components/admin/AdminNews';
import { AdminBilling } from '../components/admin/AdminBilling';
import { AdminComplaintDetail } from '../components/admin/AdminComplaintDetail';

export const AdminDashboard = () => {
  const { logout, complaints, updateStatus } = useApp();
  const [currentView, setCurrentView] = useState<AdminViewType>('OVERVIEW');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedComplaint = selectedId ? complaints.find(c => c.id === selectedId) : null;

  const handleOpenComplaint = (id: string) => {
    setSelectedId(id);
    setCurrentView('COMPLAINT_DETAIL');
  };

  const handleBackToList = () => {
    setSelectedId(null);
    setCurrentView('ALL_COMPLAINTS');
  };

  const handleUpdateStatus = (status: ComplaintStatus) => {
    if (selectedId) {
      updateStatus(selectedId, status);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setSelectedId(null); // Clear detail if navigating away
        }} 
        onLogout={logout} 
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-slate-50 scroll-smooth">
        {/* Core Sections */}
        {currentView === 'OVERVIEW' && <AdminOverview />}
        {currentView === 'MODERATION' && <AdminModeration />}
        {currentView === 'CONTENT_REPORTS' && <AdminContentReports />}
        {currentView === 'POLICY_ANALYSIS' && <AdminPolicyAnalysis />}
        {currentView === 'ESCALATIONS' && <AdminEscalations />}
        
        {/* Data Sections */}
        {currentView === 'ALL_COMPLAINTS' && (
          <div className="space-y-4">
             {/* We inject the detailed handler into the list view component internally if needed, 
                 but for simplicity in this demo, let's assume the user clicks "View" which we override here */}
             <AdminAllComplaints />
             <div className="mt-8">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Quick Links</h4>
               <div className="flex gap-4">
                 {complaints.slice(0, 3).map(c => (
                   <button 
                    key={c.id} 
                    onClick={() => handleOpenComplaint(c.id)}
                    className="p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 shadow-sm hover:border-indigo-300 transition-colors"
                   >
                     Inspect: {c.title.slice(0, 20)}...
                   </button>
                 ))}
               </div>
             </div>
          </div>
        )}
        {currentView === 'USERS' && <AdminUsers />}
        {currentView === 'BUSINESSES' && <AdminBusinesses />}
        {currentView === 'INDUSTRIES' && <AdminIndustries />}
        
        {/* Detail View */}
        {currentView === 'COMPLAINT_DETAIL' && selectedComplaint && (
          <AdminComplaintDetail 
            complaint={selectedComplaint} 
            onBack={handleBackToList}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* Intelligence & News */}
        {currentView === 'NEWS' && <AdminNews />}
        {currentView === 'ANALYTICS' && <AdminAnalytics />}
        {currentView === 'SENTIMENT_INTEL' && <AdminSentimentIntel />}
        
        {/* Operations */}
        {currentView === 'COMPLIANCE' && <AdminCompliance />}
        {currentView === 'SUBSCRIPTIONS' && <AdminBilling />}
        
        {/* Settings Groups */}
        {currentView === 'SETTINGS_GENERAL' && (
            <div className="space-y-16 pb-20">
                <AdminSettingsGeneral />
                <AdminHomepage />
                <AdminPageBanners />
                <AdminNavigation />
                <AdminFooter />
                <AdminTranslations />
            </div>
        )}
        {currentView === 'SETTINGS_BRANDING' && <AdminSettingsBranding />}
        {currentView === 'SETTINGS_TECH_STACK' && <AdminTechStack />}
        
      </main>
    </div>
  );
};
