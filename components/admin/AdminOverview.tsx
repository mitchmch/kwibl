import React from 'react';
import { Icons } from '../Icons';

export const AdminOverview = () => {
  const StatCard = ({ label, value, sub, icon, bg, text }: any) => (
    <div className={`p-6 rounded-2xl border border-slate-100 shadow-sm ${bg}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-500 font-medium text-sm">{label}</h3>
          <p className={`text-3xl font-bold mt-1 ${text}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white/50 ${text}`}>
           {icon}
        </div>
      </div>
      <p className={`text-xs font-medium ${text} flex items-center`}>
         {sub}
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Hero Banner */}
       <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100 flex items-center shadow-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6 shadow-sm text-orange-500">
             <Icons.Activity className="w-8 h-8" />
          </div>
          <div>
             <h1 className="text-3xl font-bold text-slate-900 mb-1">Admin Overview</h1>
             <p className="text-slate-500">Platform statistics and key metrics</p>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Users" 
            value="7" 
            sub="" 
            icon={<Icons.Users className="w-6 h-6" />} 
            bg="bg-indigo-50" 
            text="text-indigo-700" 
          />
          <StatCard 
            label="Total Complaints" 
            value="9" 
            sub="↑ 15% from last month" 
            icon={<Icons.FileText className="w-6 h-6" />} 
            bg="bg-emerald-50" 
            text="text-emerald-700" 
          />
          <StatCard 
            label="Pending Moderation" 
            value="0" 
            sub="" 
            icon={<Icons.AlertCircle className="w-6 h-6" />} 
            bg="bg-orange-50" 
            text="text-orange-700" 
          />
          <StatCard 
            label="Resolution Rate" 
            value="11%" 
            sub="↑ 5% from last month" 
            icon={<Icons.CheckCircle className="w-6 h-6" />} 
            bg="bg-slate-100" 
            text="text-slate-700" 
          />
       </div>

       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6">Complaints Trend (Last 7 Days)</h3>
             <div className="h-48 flex items-end justify-between space-x-2">
                 {/* CSS Mock Chart */}
                 <div className="w-full h-full bg-gradient-to-t from-slate-600 to-transparent opacity-10 rounded-xl relative overflow-hidden">
                     <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
                         <path d="M0 50 L0 40 Q25 45 50 20 T100 10 L100 50 Z" fill="#475569" opacity="0.8" />
                     </svg>
                 </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-2">Industry Distribution</h3>
             <p className="text-sm text-slate-500 mb-6">Complaints by industry</p>
             <div className="flex items-center justify-center">
                 {/* CSS Pie Chart Mock */}
                 <div className="w-48 h-48 rounded-full border-8 border-white shadow-xl relative" style={{ background: 'conic-gradient(#10b981 0% 35%, #0ea5e9 35% 60%, #a855f7 60% 80%, #f59e0b 80% 100%)' }}></div>
             </div>
             <div className="flex justify-center gap-4 mt-6 flex-wrap">
                 <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div> Housing</div>
                 <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-sky-500 rounded mr-2"></div> Healthcare</div>
                 <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-purple-500 rounded mr-2"></div> Retail</div>
                 <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-amber-500 rounded mr-2"></div> Utilities</div>
             </div>
          </div>
       </div>
    </div>
  );
};
