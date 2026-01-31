
import React from 'react';
import { Icons } from './Icons';
import { AdminViewType } from '../types';

interface Props {
  currentView: AdminViewType;
  onChangeView: (view: AdminViewType) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<Props> = ({ currentView, onChangeView, onLogout }) => {
  const NavItem = ({ view, icon, label, count }: { view: AdminViewType, icon: React.ReactNode, label: string, count?: number }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-colors text-sm font-medium ${
        currentView === view
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${currentView === view ? 'text-emerald-600' : 'text-slate-400'}`}>
          {icon}
        </span>
        {label}
      </div>
      {count !== undefined && (
        <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs font-bold">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-[100]">
      {/* Admin Profile */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full border border-slate-200" />
           <div>
              <div className="font-bold text-slate-900 text-sm">kwibl_admin</div>
              <div className="text-[10px] px-2 py-0.5 bg-slate-800 text-white rounded-full inline-block font-black uppercase tracking-widest">Administrator</div>
           </div>
        </div>
      </div>

      <div className="px-4 flex-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Discovery & Insights</div>
        <NavItem view="PRODUCT_DISCOVERY" icon={<Icons.Brain className="w-4 h-4"/>} label="Product Discovery" />
        <NavItem view="OVERVIEW" icon={<Icons.LayoutDashboard className="w-4 h-4"/>} label="Analytics Hub" />
        
        <div className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Moderation</div>
        <NavItem view="MODERATION" icon={<Icons.Shield className="w-4 h-4"/>} label="Moderation Queue" count={0} />
        <NavItem view="CONTENT_REPORTS" icon={<Icons.Flag className="w-4 h-4"/>} label="Content Reports" />
        <NavItem view="POLICY_ANALYSIS" icon={<Icons.FileText className="w-4 h-4"/>} label="Policy Analysis" />
        <NavItem view="ESCALATIONS" icon={<Icons.AlertCircle className="w-4 h-4"/>} label="Escalation Monitor" />
        
        <div className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Operations</div>
        <NavItem view="ALL_COMPLAINTS" icon={<Icons.List className="w-4 h-4"/>} label="Case Management" />
        <NavItem view="USERS" icon={<Icons.Users className="w-4 h-4"/>} label="User Directory" />
        <NavItem view="INDUSTRIES" icon={<Icons.Layers className="w-4 h-4"/>} label="Taxonomy" />
        <NavItem view="BUSINESSES" icon={<Icons.Building2 className="w-4 h-4"/>} label="Business Directory" />
        
        <div className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3">Compliance & News</div>
        <NavItem view="COMPLIANCE" icon={<Icons.FileBarChart className="w-4 h-4"/>} label="Compliance Engine" />
        <NavItem view="NEWS" icon={<Icons.Newspaper className="w-4 h-4"/>} label="Announcements" />
      </div>

      <div className="p-4 border-t border-slate-100">
        <button onClick={onLogout} className="flex items-center text-slate-600 hover:text-red-600 text-sm font-bold px-3 py-2 w-full transition-colors rounded-lg hover:bg-red-50">
           <Icons.LogOut className="w-4 h-4 mr-3" />
           Logout
        </button>
      </div>
    </div>
  );
};
