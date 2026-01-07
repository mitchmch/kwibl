import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './Icons';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, setView, view, logout } = useApp();

  if (view === 'LANDING' || view === 'AUTH') {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Left Sidebar - Exact match to image */}
      <aside className="w-[100px] lg:w-[280px] h-screen sticky top-0 bg-white border-r border-slate-100 flex flex-col items-center lg:items-stretch py-8 px-4 lg:px-8 z-[100]">
        <div className="flex flex-col items-center lg:items-start mb-12">
          <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mb-6 group cursor-pointer hover:rotate-12 transition-transform">
            <span className="text-3xl font-black italic">k</span>
          </div>
          {currentUser && (
            <div className="hidden lg:block text-center lg:text-left">
              <img 
                src={currentUser.avatar} 
                className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-xl object-cover mb-4" 
                alt="Profile" 
              />
              <h2 className="text-lg font-black text-slate-900 leading-tight">{currentUser.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">@{currentUser.name.split(' ')[0].toLowerCase()}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'DASHBOARD', label: 'Newsfeed', icon: <Icons.Home className="w-6 h-6" /> },
            { id: 'MESSAGES', label: 'Messages', icon: <Icons.MessageSquare className="w-6 h-6" /> },
            { id: 'FORUMS', label: 'Forums', icon: <Icons.Globe className="w-6 h-6" /> },
            { id: 'FRIENDS', label: 'Friends', icon: <Icons.Users className="w-6 h-6" /> },
            { id: 'PRIVATE', label: 'Private', icon: <Icons.Shield className="w-6 h-6" /> },
            { id: 'PROFILE', label: 'Settings', icon: <Icons.Settings className="w-6 h-6" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center justify-center lg:justify-start gap-5 p-4 rounded-[1.5rem] transition-all duration-300 ${
                view === item.id || (view === 'DASHBOARD' && item.id === 'DASHBOARD')
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 translate-x-1'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center lg:justify-start gap-5 p-4 rounded-[1.5rem] text-red-400 hover:text-red-600 hover:bg-red-50 transition-all mt-auto"
        >
          <Icons.LogOut className="w-6 h-6" />
          <span className="hidden lg:block font-bold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* Main Content Frame */}
      <main className="flex-1 overflow-x-hidden p-6 lg:p-12">
        {children}
      </main>
    </div>
  );
};