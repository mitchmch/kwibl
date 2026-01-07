
import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './Icons';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, setView, view, logout } = useApp();

  if (view === 'LANDING' || view === 'AUTH') {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Refined Sidebar */}
      <aside className="w-[80px] lg:w-[260px] h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col items-center lg:items-stretch z-[100] transition-all">
        <div className="py-8 px-6 flex items-center justify-center lg:justify-start">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('DASHBOARD')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-6">
              <span className="text-xl font-bold italic">k</span>
            </div>
            <span className="hidden lg:block text-2xl font-black text-slate-900 tracking-tighter">kwibl</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {[
            { id: 'DASHBOARD', label: 'Feeds', icon: <Icons.Home className="w-5 h-5" /> },
            { id: 'MESSAGES', label: 'Messages', icon: <Icons.MessageSquare className="w-5 h-5" /> },
            { id: 'FORUMS', label: 'Community', icon: <Icons.Globe className="w-5 h-5" /> },
            { id: 'FRIENDS', label: 'Friends', icon: <Icons.Users className="w-5 h-5" /> },
            { id: 'PROFILE', label: 'Settings', icon: <Icons.Settings className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3.5 rounded-xl transition-all font-semibold text-sm ${
                view === item.id || (view === 'DASHBOARD' && item.id === 'DASHBOARD')
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span className={view === item.id ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          {currentUser && (
            <div 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer mb-2 transition-colors"
              onClick={() => setView('PROFILE')}
            >
              <img src={currentUser.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt="User" />
              <div className="hidden lg:block overflow-hidden">
                <div className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-400 truncate">View Profile</div>
              </div>
            </div>
          )}
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-3.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-semibold text-sm"
          >
            <Icons.LogOut className="w-5 h-5" />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
