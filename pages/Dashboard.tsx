
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintStatus, UserRole } from '../types';
import { Icons } from '../components/Icons';
import { ComplaintDetail } from './ComplaintDetail';
import { CreateComplaintFlow } from '../components/CreateComplaintFlow';

const CATEGORIES = ['Finance', 'Travel', 'Retail', 'Tech', 'Health', 'Food', 'Telecommunications'];
const STATUSES = Object.values(ComplaintStatus);
const SENTIMENTS = ['Positive', 'Neutral', 'Negative', 'Urgent'];

type SortOption = 'UPVOTES' | 'DATE' | 'COMMENTS';

export const Dashboard = () => {
  const { currentUser, complaints, addComplaint } = useApp();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'FOR_YOU' | 'LATEST' | 'MY_POSTS'>('FOR_YOU');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('DATE');
  const [showFilters, setShowFilters] = useState(false);

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    // Basic Tab Filtering
    if (activeTab === 'MY_POSTS' && currentUser) {
      result = result.filter(c => c.authorId === currentUser.id);
    } else if (activeTab === 'FOR_YOU') {
      // Recommendation heuristic: popular items
      result = result.sort((a, b) => b.upvotedBy.length - a.upvotedBy.length);
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        c.companyName.toLowerCase().includes(q)
      );
    }

    // Advanced Filters
    if (statusFilter) result = result.filter(c => c.status === statusFilter);
    if (categoryFilter) result = result.filter(c => c.category === categoryFilter);
    if (sentimentFilter) result = result.filter(c => c.sentiment?.label === sentimentFilter);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'UPVOTES') return b.upvotedBy.length - a.upvotedBy.length;
      if (sortBy === 'COMMENTS') return b.comments.length - a.comments.length;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [complaints, activeTab, currentUser, searchQuery, statusFilter, categoryFilter, sentimentFilter, sortBy]);

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
          <div className="relative group">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <Icons.Sliders className="w-5 h-5" />
          </button>
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

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-50/50 animate-fade-in grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Status</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Category</label>
            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Sentiment</label>
            <select 
              value={sentimentFilter} 
              onChange={e => setSentimentFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Sentiments</option>
              {SENTIMENTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => { setStatusFilter(''); setCategoryFilter(''); setSentimentFilter(''); setSearchQuery(''); }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Feed Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 px-2 pb-1">
            <div className="flex items-center gap-8">
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

            <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-xl">
               <button 
                 onClick={() => setSortBy('DATE')}
                 className={`p-1.5 rounded-lg transition-all ${sortBy === 'DATE' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Sort by Date"
               >
                 <Icons.Clock className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setSortBy('UPVOTES')}
                 className={`p-1.5 rounded-lg transition-all ${sortBy === 'UPVOTES' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Sort by Upvotes"
               >
                 <Icons.ThumbsUp className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setSortBy('COMMENTS')}
                 className={`p-1.5 rounded-lg transition-all ${sortBy === 'COMMENTS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Sort by Comments"
               >
                 <Icons.MessageSquare className="w-4 h-4" />
               </button>
            </div>
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
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                <Icons.FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No results matching your current view.</p>
                <button onClick={() => { setActiveTab('LATEST'); setShowFilters(false); setStatusFilter(''); }} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Clear all filters</button>
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
              {['TechCorp', 'SkyNet', 'Global Log', 'AeroFly'].map((biz) => (
                <div key={biz} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                      <img src={`https://logo.clearbit.com/${biz.toLowerCase().replace(/\s/g, '')}.com`} onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${biz}`; }} className="w-full h-full object-contain p-1" alt={biz} />
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
