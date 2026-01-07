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
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Admin Profile */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full border border-slate-200" />
           <div>
              <div className="font-bold text-slate-900 text-sm">webmaster</div>
              <div className="text-xs px-2 py-0.5 bg-slate-800 text-white rounded-full inline-block">Administrator</div>
           </div>
        </div>
      </div>

      <div className="px-4 flex-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Admin Panel</div>
        <NavItem view="OVERVIEW" icon={<Icons.Home className="w-4 h-4"/>} label="Home" />
        <NavItem view="OVERVIEW" icon={<Icons.LayoutDashboard className="w-4 h-4"/>} label="Overview" />
        
        <NavItem view="MODERATION" icon={<Icons.Shield className="w-4 h-4"/>} label="Moderation" count={0} />
        <NavItem view="CONTENT_REPORTS" icon={<Icons.Flag className="w-4 h-4"/>} label="Content Reports" />
        <NavItem view="POLICY_ANALYSIS" icon={<Icons.FileText className="w-4 h-4"/>} label="Policy Analysis" />
        <NavItem view="ALL_COMPLAINTS" icon={<Icons.FileText className="w-4 h-4"/>} label="All Complaints" />
        <NavItem view="USERS" icon={<Icons.Users className="w-4 h-4"/>} label="Users" />
        <NavItem view="INDUSTRIES" icon={<Icons.Layers className="w-4 h-4"/>} label="Industries" />
        <NavItem view="BUSINESSES" icon={<Icons.Building2 className="w-4 h-4"/>} label="Businesses" />
        <NavItem view="ESCALATIONS" icon={<Icons.AlertCircle className="w-4 h-4"/>} label="Escalation Monitor" />
        
        <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Compliance</div>
        <NavItem view="COMPLIANCE" icon={<Icons.FileBarChart className="w-4 h-4"/>} label="Compliance Reports" />
        <NavItem view="COMPLIANCE" icon={<Icons.Clock className="w-4 h-4"/>} label="Report Scheduler" />

        <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Site Settings</div>
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.Home className="w-4 h-4"/>} label="Homepage" />
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.Image className="w-4 h-4"/>} label="Page Banners" />
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.Menu className="w-4 h-4"/>} label="Navigation" />
        <NavItem view="SETTINGS_BRANDING" icon={<Icons.Palette className="w-4 h-4"/>} label="Branding" />
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.LayoutDashboard className="w-4 h-4"/>} label="Footer Management" />
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.Globe className="w-4 h-4"/>} label="Translations" />
        <NavItem view="SETTINGS_TECH_STACK" icon={<Icons.Database className="w-4 h-4"/>} label="Tech Stack" />
        <NavItem view="SETTINGS_GENERAL" icon={<Icons.Settings className="w-4 h-4"/>} label="Settings" />
      </div>

      <div className="p-4 border-t border-slate-100">
        <button onClick={onLogout} className="flex items-center text-slate-600 hover:text-red-600 text-sm font-medium px-3 py-2 w-full transition-colors rounded-lg hover:bg-red-50">
           <Icons.LogOut className="w-4 h-4 mr-3" />
           Sign Out
        </button>
      </div>
    </div>
  );
};
