
import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';

export const LandingPage = () => {
  const { setView, isLoading } = useApp();

  const handleGetStarted = () => {
    setView('AUTH');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 flex flex-col items-center justify-center py-20 px-6">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradients Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] animate-float-delayed"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px] animate-float"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-grid opacity-[0.4]"></div>
        
        {/* Lens Flare Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,1)_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-up">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next-Gen Dispute Resolution</span>
        </div>

        <div className="mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.95]">
            Resolving issues, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">better & together.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            kwibl uses neural-sync technology to bridge the gap between customers and brands. 
            Automated sentiment analysis, smart drafting, and community-driven oversight.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left mt-16 perspective-1000">
          {/* Customer Card */}
          <div 
            className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:border-indigo-100 transition-all duration-500 group animate-fade-up hover:-translate-y-2"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Icons.User className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Customer</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">File complaints with AI assistance, track progress in real-time, and join the community feed.</p>
            <button 
              disabled={isLoading}
              onClick={handleGetStarted}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* Business Card */}
          <div 
            className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-indigo-100 ring-2 ring-indigo-50/50 group animate-fade-up hover:-translate-y-2 transition-all duration-500"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-xl shadow-indigo-200">
              <Icons.Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Business</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">Protect your reputation, analyze customer sentiment patterns, and resolve cases with AI-drafted replies.</p>
            <button 
               disabled={isLoading}
               onClick={handleGetStarted}
               className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              Business Portal
            </button>
          </div>

          {/* Admin Card */}
          <div 
            className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white hover:border-purple-100 transition-all duration-500 group animate-fade-up hover:-translate-y-2"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Icons.Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Admin</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">Moderate community content, view high-level industry analytics, and manage global compliance.</p>
            <button 
              disabled={isLoading}
              onClick={handleGetStarted}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-lg active:scale-95"
            >
              Admin Access
            </button>
          </div>
        </div>

        {/* Floating Social Proof */}
        <div className="mt-24 flex flex-col items-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8">Trusted by Global Entities</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-black tracking-tighter text-slate-900 italic">TechCorp</div>
             <div className="text-2xl font-black tracking-tighter text-slate-900 italic">SkyNet</div>
             <div className="text-2xl font-black tracking-tighter text-slate-900 italic">GlobalLog</div>
             <div className="text-2xl font-black tracking-tighter text-slate-900 italic">AeroFly</div>
          </div>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
        Kwibl Protocol v3.1.0-PRO
      </div>
    </div>
  );
};