
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('DATE');
  const [showFilters, setShowFilters] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'URGENT' | 'TOP_VOTED'>('ALL');

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    if (quickFilter === 'URGENT') {
      result = result.filter(c => c.sentiment?.label === 'Urgent');
    } else if (quickFilter === 'TOP_VOTED') {
      result = result.sort((a, b) => b.upvotedBy.length - a.upvotedBy.length);
    }

    if (activeTab === 'MY_POSTS' && currentUser) {
      result = result.filter(c => c.authorId === currentUser.id);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        c.companyName.toLowerCase().includes(q) ||
        c.taskKey.toLowerCase().includes(q)
      );
    }

    if (statusFilter) result = result.filter(c => c.status === statusFilter);
    if (categoryFilter) result = result.filter(c => c.category === categoryFilter);
    if (sentimentFilter) result = result.filter(c => c.sentiment?.label === sentimentFilter);

    result.sort((a, b) => {
      if (sortBy === 'UPVOTES') return b.upvotedBy.length - a.upvotedBy.length;
      if (sortBy === 'COMMENTS') return b.comments.length - a.comments.length;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [complaints, activeTab, currentUser, searchQuery, statusFilter, categoryFilter, sentimentFilter, sortBy, quickFilter]);

  const selectedComplaint = selectedComplaintId ? complaints.find(c => c.id === selectedComplaintId) : null;

  if (selectedComplaint) {
    return <ComplaintDetail complaint={selectedComplaint} onBack={() => setSelectedComplaintId(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Feed</h1>
          <p className="text-sm text-slate-500 font-medium">Resolution progress and collaborative oversight.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by key, company or issue..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80 transition-all shadow-sm"
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
              <Icons.Plus className="w-4 h-4" /> New Post
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-50/50 animate-fade-in grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Category</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Sentiment</label>
            <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700">
              <option value="">All Sentiments</option>
              {SENTIMENTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setStatusFilter(''); setCategoryFilter(''); setSentimentFilter(''); setSearchQuery(''); setQuickFilter('ALL'); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-sm font-black uppercase tracking-widest">Reset</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {[
          { id: 'ALL', label: 'All Complaints', icon: <Icons.List className="w-3 h-3" /> },
          { id: 'URGENT', label: 'Urgent', icon: <Icons.AlertTriangle className="w-3 h-3" /> },
          { id: 'TOP_VOTED', label: 'Top Voted', icon: <Icons.ThumbsUp className="w-3 h-3" /> },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setQuickFilter(filter.id as any)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
              quickFilter === filter.id 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 px-2 pb-1">
            <div className="flex items-center gap-8">
              {['FOR_YOU', 'LATEST', 'MY_POSTS'].map(id => (
                <button 
                  key={id} 
                  onClick={() => setActiveTab(id as any)}
                  className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${
                    activeTab === id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {id.replace('_', ' ')}
                  {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-xl">
               <button onClick={() => setSortBy('DATE')} className={`p-1.5 rounded-lg transition-all ${sortBy === 'DATE' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Date"><Icons.Clock className="w-4 h-4" /></button>
               <button onClick={() => setSortBy('UPVOTES')} className={`p-1.5 rounded-lg transition-all ${sortBy === 'UPVOTES' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Votes"><Icons.ThumbsUp className="w-4 h-4" /></button>
               <button onClick={() => setSortBy('COMMENTS')} className={`p-1.5 rounded-lg transition-all ${sortBy === 'COMMENTS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Comments"><Icons.MessageSquare className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(complaint => (
                <ComplaintCard key={complaint.id} complaint={complaint} onClick={() => setSelectedComplaintId(complaint.id)} />
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <Icons.FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No results found.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <Icons.Brain className="absolute top-0 right-0 p-4 opacity-10 w-32 h-32 text-white" />
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Neural Sync Active</h3>
              <p className="text-white text-lg font-bold leading-snug mb-6 tracking-tight">AI is analyzing 14 new patterns across {CATEGORIES.length} sectors.</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-5 text-white font-black text-sm">92% Precision Score</div>
            </div>
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
