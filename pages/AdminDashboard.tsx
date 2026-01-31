
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
import { Icons } from '../components/Icons';

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

  // Jira Product Discovery Style Component
  const AdminProductDiscovery = () => (
    <div className="space-y-8 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white shadow-lg">
             <Icons.Brain className="w-6 h-6" />
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900">Impact Discovery</h1>
             <p className="text-xs text-slate-500 font-medium">All ideas & customer insights (triaged)</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm shadow-md hover:bg-indigo-700">Create Idea</button>
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-md"><Icons.Sliders className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
           <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
             <Icons.List className="w-3 h-3" /> List
           </button>
           <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Matrix</button>
           <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Timeline</button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50/80 sticky top-0 z-10">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                <th className="p-4 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="p-4">Summary</th>
                <th className="p-4">Bets / Industry</th>
                <th className="p-4">Impact</th>
                <th className="p-4">Effort</th>
                <th className="p-4">Impact Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 cursor-pointer group">
                  <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.status === ComplaintStatus.RESOLVED ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 truncate max-w-xs">{c.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-tight">{c.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= (c.impactScore || 50) / 20 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-black px-2 py-1 rounded ${
                      (c.impactScore || 0) > 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{c.impactScore || 'N/A'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
        
        {/* Atlassian Inspiration: Product Discovery View */}
        {currentView === 'PRODUCT_DISCOVERY' && <AdminProductDiscovery />}

        {/* Data Sections */}
        {currentView === 'ALL_COMPLAINTS' && (
          <div className="space-y-4">
             <AdminAllComplaints />
             <div className="mt-8">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Live Monitor</h4>
               <div className="flex gap-4">
                 <button onClick={() => setCurrentView('PRODUCT_DISCOVERY')} className="px-6 py-4 bg-white border border-indigo-200 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group">
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                      <Icons.Brain className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                       <div className="text-sm font-black text-slate-900">Switch to Product Discovery View</div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Triage & Prioritize Insights</div>
                    </div>
                 </button>
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
