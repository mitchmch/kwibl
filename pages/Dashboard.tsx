
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintStatus, UserRole } from '../types';
import { Icons } from '../components/Icons';
import { ComplaintDetail } from './ComplaintDetail';
import { CreateComplaintFlow } from '../components/CreateComplaintFlow';

const CATEGORIES = ['Finance', 'Travel', 'Retail', 'Tech', 'Health', 'Food'];

export const Dashboard = () => {
  const { currentUser, complaints, addComplaint } = useApp();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'FOR_YOU' | 'LATEST' | 'MY_POSTS'>('FOR_YOU');

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];
    if (activeTab === 'LATEST') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeTab === 'MY_POSTS' && currentUser) {
      result = result.filter(c => c.authorId === currentUser.id);
    } else {
      // FOR_YOU: Sort by upvotes for a "popular" feel
      result.sort((a, b) => b.upvotedBy.length - a.upvotedBy.length);
    }
    return result;
  }, [complaints, activeTab, currentUser]);

  const selectedComplaint = selectedComplaintId ? complaints.find(c => c.id === selectedComplaintId) : null;

  if (selectedComplaint) {
    return <ComplaintDetail complaint={selectedComplaint} onBack={() => setSelectedComplaintId(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Feeds</h1>
          <p className="text-sm text-slate-500 font-medium">Insights and updates from your community.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
          {currentUser?.role === UserRole.CUSTOMER && (
            <button 
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Icons.Plus className="w-4 h-4" />
              New Post
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Composer - Refined */}
          {currentUser?.role === UserRole.CUSTOMER && (
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="Me" />
                <div className="flex-1">
                  <div 
                    onClick={() => setShowNewModal(true)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-slate-400 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    Share an issue with the community...
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Image className="w-4 h-4 text-indigo-400" /> Evidence</button>
                      <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Paperclip className="w-4 h-4 text-emerald-400" /> Document</button>
                      <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 hover:text-indigo-600 transition-colors"><Icons.Globe className="w-4 h-4 text-sky-400" /> Region</button>
                    </div>
                    <button 
                      onClick={() => setShowNewModal(true)}
                      className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Advanced
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 px-2 pb-1">
            {[
              { id: 'FOR_YOU', label: 'Recommended' },
              { id: 'LATEST', label: 'Latest' },
              { id: 'MY_POSTS', label: 'My Posts' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
              </button>
            ))}
          </div>

          {/* The Feed */}
          <div className="space-y-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(complaint => (
                <ComplaintCard 
                  key={complaint.id} 
                  complaint={complaint} 
                  onClick={() => setSelectedComplaintId(complaint.id)} 
                />
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Icons.FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No complaints found in this view.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Discover & Stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trending Businesses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top Brands</h3>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-5">
              {['TechCorp', 'SkyNet', 'Global Log', 'AeroFly'].map((biz, i) => (
                <div key={biz} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                      <img src={`https://logo.clearbit.com/${biz.toLowerCase().replace(' ', '')}.com?size=80`} className="w-full h-full object-cover" alt={biz} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{biz}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Partner</div>
                    </div>
                  </div>
                  <Icons.CheckCircle className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Insights Grid */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <Icons.Brain className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Market Pulse</h3>
              <p className="text-white text-lg font-bold leading-snug mb-6 tracking-tight">
                "Customer sentiment across the Retail sector has improved by 14% this quarter."
              </p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-5">
                <div className="flex-1">
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Trust Score</div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-indigo-500"></div>
                   </div>
                </div>
                <div className="text-white font-black text-sm">92%</div>
              </div>
            </div>
          </div>

          {/* Categories / Tags */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Hot Sectors</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <span key={cat} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2">
            <a href="#" className="hover:text-slate-600 transition-colors">About</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Safety</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Legal</a>
            <span>kwibl © 2025</span>
          </div>
        </div>
      </div>

      {showNewModal && (
        <CreateComplaintFlow 
          onClose={() => setShowNewModal(false)}
          onSubmit={async (data) => {
            await addComplaint(data.title, data.description, data.category, data.companyName, data.privateDetails, data.attachment);
            setShowNewModal(false);
          }}
          industries={CATEGORIES}
        />
      )}
    </div>
  );
};
