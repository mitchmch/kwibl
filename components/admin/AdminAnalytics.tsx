import React from 'react';
import { Icons } from '../Icons';

export const AdminAnalytics = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-500">Deep dive into platform usage and resolution metrics</p>
        </div>
        <div className="flex gap-2">
           <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium">
             <option>Last 30 Days</option>
             <option>Last 90 Days</option>
             <option>Year to Date</option>
           </select>
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 flex items-center text-sm">
             <Icons.Download className="w-4 h-4 mr-2" /> Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Resolution Time', value: '4.2 Days', trend: '-12%', icon: <Icons.Clock className="w-6 h-6" /> },
          { label: 'Active Users', value: '1,284', trend: '+5.4%', icon: <Icons.Users className="w-6 h-6" /> },
          { label: 'Net Promoter Score', value: '72', trend: '+2', icon: <Icons.Star className="w-6 h-6" /> },
          { label: 'AI Accuracy', value: '94.2%', trend: '+0.8%', icon: <Icons.Activity className="w-6 h-6" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{stat.icon}</div>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-indigo-600'}`}>{stat.trend}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 mb-6">User Engagement Trends</h3>
        <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
           {/* Chart Mockup */}
           <div className="flex items-end gap-2 h-32">
             {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 40].map((h, i) => (
               <div key={i} className="w-4 bg-indigo-500 rounded-t opacity-40 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSentimentIntel = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
               <Icons.Brain className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Sentiment Intelligence</h2>
          </div>
          <p className="text-indigo-100 max-w-xl">
            Aggregate AI analysis of all platform content. Identifying recurring themes, emerging crises, and positive breakthroughs across all sectors.
          </p>
        </div>
        <Icons.Activity className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Sentiment Over Time</h3>
            <div className="h-48 flex items-center justify-center border border-slate-100 rounded-xl">
               <span className="text-slate-400 text-sm italic">Generative Chart Rendering...</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">Top Sentiment Drivers</h3>
             <div className="space-y-4">
               {[
                 { word: 'Pricing Transparency', weight: 85, pos: true },
                 { word: 'Support Latency', weight: 72, pos: false },
                 { word: 'Refund Ease', weight: 64, pos: true },
                 { word: 'Mobile App Bug', weight: 58, pos: false },
               ].map((item, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{item.word}</span>
                      <span className={item.pos ? 'text-green-600' : 'text-red-600'}>{item.weight}% Impact</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.pos ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${item.weight}%` }}></div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4">AI Thematic Breakdown</h3>
          <div className="flex-1 space-y-6">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
               <h4 className="font-bold text-purple-900 text-sm mb-1">Emerging Issue: Logistics</h4>
               <p className="text-xs text-purple-700">High volume of negative sentiment related to "delivery windows" in the last 24 hours.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
               <h4 className="font-bold text-green-900 text-sm mb-1">Success Theme: Clarity</h4>
               <p className="text-xs text-green-700">"Policy Analysis" features are receiving positive feedback for reducing user confusion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
