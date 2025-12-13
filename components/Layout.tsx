import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './Icons';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, logout, setView, view } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (targetView: 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE') => {
    setView(targetView);
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavClick(currentUser ? 'DASHBOARD' : 'LANDING')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">kwibl</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <button 
                    onClick={() => handleNavClick('DASHBOARD')}
                    className={`text-sm font-medium transition-colors ${view === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Dashboard
                  </button>
                  
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 focus:outline-none"
                    >
                      <span className="text-sm text-slate-700 font-medium hidden sm:block">{currentUser.name}</span>
                      <img 
                        src={currentUser.avatar} 
                        alt="Avatar" 
                        className="h-9 w-9 rounded-full border border-slate-200 hover:border-indigo-300 transition-colors object-cover" 
                      />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fade-in z-50">
                        <div className="px-4 py-3 border-b border-slate-50">
                           <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                           <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleNavClick('PROFILE')}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center"
                        >
                          <Icons.User className="w-4 h-4 mr-2" />
                          Account Settings
                        </button>
                        
                        <div className="border-t border-slate-50 my-1"></div>
                        
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Icons.LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => handleNavClick('AUTH')}
                     className="text-slate-600 font-medium hover:text-slate-900 text-sm"
                   >
                     Log in
                   </button>
                   <button 
                     onClick={() => handleNavClick('AUTH')}
                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                   >
                     Sign up
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} kwibl. All rights reserved. Powered by Gemini API.
        </div>
      </footer>
    </div>
  );
};