import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { Complaint, ComplaintStatus, UserRole } from '../types';
import { Icons } from '../components/Icons';
import { ComplaintDetail } from './ComplaintDetail';
import { CreateComplaintFlow } from '../components/CreateComplaintFlow';

const CATEGORIES = ['Finance', 'Travel', 'Retail', 'Tech', 'Health', 'Food'];

export const Dashboard = () => {
  const { currentUser, complaints, addComplaint } = useApp();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [feedTab, setFeedTab] = useState<'ALL' | 'FRIENDS' | 'PEOPLE'>('ALL');

  const selectedComplaint = selectedComplaintId ? complaints.find(c => c.id === selectedComplaintId) : null;

  if (selectedComplaint) {
    return <ComplaintDetail complaint={selectedComplaint} onBack={() => setSelectedComplaintId(null)} />;
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Central Feed Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Top Bar (Within Feed) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Feeds</h1>
            <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {['All', 'Friends', 'People'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setFeedTab(tab.toUpperCase() as any)}
                  className={`transition-all ${feedTab === tab.toUpperCase() ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-slate-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Post/Create Area - Floating Composer Style */}
          {currentUser?.role === UserRole.CUSTOMER && (
            <div 
              onClick={() => setShowNewModal(true)}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] border border-white cursor-pointer group transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-6">
                <img src={currentUser.avatar} className="w-14 h-14 rounded-full object-cover" alt="Me" />
                <div className="flex-1 text-slate-400 font-bold text-lg">What's the issue, {currentUser.name.split(' ')[0]}?</div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl group-hover:scale-105 transition-transform">
                  Post
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8 border-t border-slate-50 pt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Image className="w-4 h-4" /> File</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.MessageSquare className="w-4 h-4" /> Image</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Globe className="w-4 h-4" /> Location</div>
                <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Link className="w-4 h-4" /> News</div>
              </div>
            </div>
          )}

          {/* The Feed Cards */}
          <div className="space-y-8">
            {complaints.map(complaint => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onClick={() => setSelectedComplaintId(complaint.id)} 
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Match UI Widgets */}
        <div className="lg:col-span-4 space-y-12 h-fit sticky top-12">
          
          {/* Stories Segment - Mapped to Categories */}
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
              Stories <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {CATEGORIES.map((cat, i) => (
                <div key={cat} className="flex-shrink-0 w-24 text-center cursor-pointer group">
                  <div className={`w-24 h-32 rounded-[2rem] p-0.5 border-2 ${i === 0 ? 'border-indigo-500' : 'border-slate-100'} transition-all group-hover:scale-105 shadow-xl`}>
                    <div className="w-full h-full rounded-[1.8rem] bg-slate-200 overflow-hidden relative">
                       <img src={`https://picsum.photos/seed/${cat}/200/300`} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-3">
                          <span className="text-white text-[9px] font-black uppercase tracking-widest">{cat}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions - Mapped to Top Businesses */}
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.04)] border border-white">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Top Business Response</h3>
            <div className="space-y-8">
              {['TechCorp', 'SkyNet', 'Global Logistics'].map((biz, i) => (
                <div key={biz} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100 overflow-hidden border border-slate-50 shadow-md">
                       <img src={`https://logo.clearbit.com/${biz.toLowerCase()}.com?size=100`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 leading-none mb-1">{biz}</div>
                      <div className="text-[10px] font-bold text-slate-400">Verified Partner</div>
                    </div>
                  </div>
                  <button className="w-12 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 transition-all hover:bg-slate-900 hover:text-white">
                    <Icons.Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations - Grid Widgets */}
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.04)] border border-white">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">AI Quick Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Policy Scan', icon: <Icons.FileText className="w-5 h-5" />, color: 'bg-blue-50 text-blue-500' },
                { label: 'Resolution', icon: <Icons.Zap className="w-5 h-5" />, color: 'bg-rose-50 text-rose-500' },
                { label: 'Tracking', icon: <Icons.Globe className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-500' },
                { label: 'Neural Intel', icon: <Icons.Brain className="w-5 h-5" />, color: 'bg-purple-50 text-purple-500' },
              ].map((item, i) => (
                <button key={i} className={`${item.color} p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-sm`}>
                   <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                     {item.icon}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showNewModal && (
        <CreateComplaintFlow 
          onClose={() => setShowNewModal(false)}
          onSubmit={async (data) => {
            await addComplaint(data.title, data.description, data.category, data.companyName);
            setShowNewModal(false);
          }}
          industries={CATEGORIES}
        />
      )}
    </div>
  );
};