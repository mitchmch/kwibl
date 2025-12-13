import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';

export const LandingPage = () => {
  const { setView, isLoading } = useApp();

  const handleGetStarted = () => {
    setView('AUTH');
  };

  return (
    <div className="max-w-4xl mx-auto text-center pt-20">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Resolving issues, <span className="text-indigo-600">together.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          kwibl is the AI-powered community platform bridging the gap between customers and businesses. 
          Experience faster resolutions with automated insights.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
        {/* Customer Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-indigo-100 transition-colors relative group">
          <div className="absolute -top-6 left-8 bg-blue-100 p-3 rounded-xl text-blue-600">
            <Icons.User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2">Customer</h3>
          <p className="text-slate-500 text-sm mb-6">Track complaints, join discussions, and get real-time updates.</p>
          <button 
            disabled={isLoading}
            onClick={handleGetStarted}
            className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Business Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 relative group ring-1 ring-indigo-50">
          <div className="absolute -top-6 left-8 bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Icons.Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2">Business</h3>
          <p className="text-slate-500 text-sm mb-6">Manage reputation, analyze sentiment, and resolve cases efficiently.</p>
          <button 
             disabled={isLoading}
             onClick={handleGetStarted}
             className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            Business Portal
          </button>
        </div>

        {/* Admin Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-indigo-100 transition-colors relative group">
          <div className="absolute -top-6 left-8 bg-purple-100 p-3 rounded-xl text-purple-600">
            <Icons.Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2">Admin</h3>
          <p className="text-slate-500 text-sm mb-6">Moderate content, manage users, and view platform analytics.</p>
          <button 
            disabled={isLoading}
            onClick={handleGetStarted}
            className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};