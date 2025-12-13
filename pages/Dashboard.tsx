import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCard } from '../components/ComplaintCard';
import { Complaint, UserRole, ComplaintStatus } from '../types';
import { Icons } from '../components/Icons';
import { ComplaintDetail } from './ComplaintDetail';
import { SelfServiceResources } from '../components/SelfServiceResources';
import { CustomerFeedbackModal } from '../components/CustomerFeedbackModal';
import { CreateComplaintFlow } from '../components/CreateComplaintFlow';

const INDUSTRIES = ['Retail', 'Telecommunications', 'Finance', 'Healthcare', 'Travel', 'Technology', 'Automotive', 'Utilities', 'General'];

type Tab = 'DASHBOARD' | 'FEED' | 'RESOURCES';

export const Dashboard = () => {
  const { currentUser, complaints, addComplaint, updateComplaint, deleteComplaint, submitFeedback } = useApp();
  // Changed to store ID so we can look up the fresh object from context on re-renders
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [showEditComplaintModal, setShowEditComplaintModal] = useState(false);
  
  // Feedback Modal State
  const [ratingModalComplaint, setRatingModalComplaint] = useState<Complaint | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [dashboardStatusFilter, setDashboardStatusFilter] = useState<'ALL' | ComplaintStatus>('ALL');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<Tab>(currentUser?.role === UserRole.CUSTOMER ? 'DASHBOARD' : 'FEED');

  // Form states (Edit Only now)
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(INDUSTRIES[0]);
  const [formCompany, setFormCompany] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Switch tab defaults based on role
  useEffect(() => {
    if (currentUser?.role === UserRole.CUSTOMER) {
      setActiveTab('DASHBOARD');
    } else {
      setActiveTab('FEED');
    }
  }, [currentUser?.role]);

  const handleRate = (complaint: Complaint) => {
    setRatingModalComplaint(complaint);
  };

  const handleEdit = (complaint: Complaint) => {
      setEditingId(complaint.id);
      setFormTitle(complaint.title);
      setFormCategory(complaint.category);
      setFormCompany(complaint.companyName);
      setFormDescription(complaint.description);
      setShowEditComplaintModal(true);
  };

  const handleDelete = (complaint: Complaint) => {
      if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
          deleteComplaint(complaint.id);
      }
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    if (ratingModalComplaint) {
      submitFeedback(ratingModalComplaint.id, rating, feedback);
      setRatingModalComplaint(null);
    }
  };

  // Derive the active complaint object from the ID and the live complaints list
  const selectedComplaint = selectedComplaintId 
    ? complaints.find(c => c.id === selectedComplaintId) 
    : null;

  const myComplaints = complaints.filter(c => c.authorId === currentUser?.id);
  const activeCount = myComplaints.filter(c => c.status === ComplaintStatus.OPEN || c.status === ComplaintStatus.IN_PROGRESS).length;
  const resolvedCount = myComplaints.filter(c => c.status === ComplaintStatus.RESOLVED).length;
  
  const filteredComplaints = complaints.filter(c => {
    // Basic search text
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.companyName.toLowerCase().includes(search.toLowerCase());
    
    // 1. Business Role Visibility
    if (currentUser?.role === UserRole.BUSINESS) {
      if (currentUser.companyName && c.companyName !== currentUser.companyName) return false;
    }

    // 2. Personal Dashboard (Customer) Logic
    if (activeTab === 'DASHBOARD' && currentUser?.role === UserRole.CUSTOMER) {
      // Must be my complaint
      if (c.authorId !== currentUser.id) return false;
      // Apply status filter
      if (dashboardStatusFilter !== 'ALL' && c.status !== dashboardStatusFilter) return false;
      
      return matchesSearch; // Use standard search on top of specific filters
    }

    // 3. Community Feed Logic
    // Specific filters for feed
    if (filter === 'MY_ISSUES' && currentUser?.role === UserRole.CUSTOMER) {
      return matchesSearch && c.authorId === currentUser.id;
    }

    if (filter === 'URGENT') {
       return matchesSearch && (c.sentiment?.label === 'Urgent' || c.sentiment?.label === 'Negative');
    }

    return matchesSearch;
  }).sort((a, b) => {
    if (filter === 'TOP_VOTED' && activeTab === 'FEED') {
      return b.upvotedBy.length - a.upvotedBy.length;
    }
    // Default sort by Date Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleFlowSubmit = async (data: { title: string; description: string; category: string; companyName: string; attachment?: string }) => {
    // Note: addComplaint in context currently doesn't support attachments in the main arg list, 
    // but for this demo we'll assume the description handles the text. 
    // Ideally update context to accept attachmentUrl, but sticking to existing interface for stability.
    await addComplaint(data.title, data.description, data.category, data.companyName);
    setShowNewComplaintModal(false);
    setActiveTab('DASHBOARD');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
          await updateComplaint(editingId, {
              title: formTitle,
              description: formDescription,
              category: formCategory,
              companyName: formCompany
          });
          setShowEditComplaintModal(false);
          resetForm();
      }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormCompany('');
    setEditingId(null);
  };

  if (selectedComplaint) {
    return <ComplaintDetail complaint={selectedComplaint} onBack={() => setSelectedComplaintId(null)} />;
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
             {activeTab === 'DASHBOARD' ? 'My Dashboard' : activeTab === 'RESOURCES' ? 'Help Center' : 'Community Feed'}
          </h2>
          <p className="text-slate-500">
             {activeTab === 'DASHBOARD' ? 'Track your active complaints and view status updates.' : 
              activeTab === 'RESOURCES' ? 'Find answers and troubleshooting guides.' : 
              'Browse recent discussions and find solutions.'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {currentUser?.role === UserRole.CUSTOMER && (
             <button 
              onClick={() => setShowNewComplaintModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-200"
            >
              <Icons.MessageSquare className="w-4 h-4 mr-2" />
              New Complaint
            </button>
          )}
        </div>
      </div>

      {/* Customer Tabs */}
      {currentUser?.role === UserRole.CUSTOMER && (
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'DASHBOARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            My Complaints
          </button>
          <button 
            onClick={() => setActiveTab('FEED')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'FEED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Community Feed
          </button>
          <button 
            onClick={() => setActiveTab('RESOURCES')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'RESOURCES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Resources & FAQs
          </button>
        </div>
      )}

      {/* Resources View */}
      {activeTab === 'RESOURCES' ? (
        <SelfServiceResources />
      ) : (
        <>
           {/* Personal Dashboard Metrics - Only for Customer Dashboard */}
           {activeTab === 'DASHBOARD' && currentUser?.role === UserRole.CUSTOMER && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-slate-500 text-sm font-medium mb-1">Total Active</p>
                       <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                       <Icons.Activity className="w-6 h-6" />
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-slate-500 text-sm font-medium mb-1">Resolved Issues</p>
                       <p className="text-3xl font-bold text-slate-900">{resolvedCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                       <Icons.CheckCircle className="w-6 h-6" />
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-slate-500 text-sm font-medium mb-1">Total Complaints</p>
                       <p className="text-3xl font-bold text-slate-900">{myComplaints.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                       <Icons.Briefcase className="w-6 h-6" />
                    </div>
                 </div>
              </div>
           )}

          {/* Unified Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Icons.Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'DASHBOARD' ? "Search my complaints..." : "Search complaints or companies..."}
                  className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {/* Specific Filters for Feed */}
                {activeTab === 'FEED' && (
                    <>
                        <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        All Issues
                        </button>
                        <button onClick={() => setFilter('TOP_VOTED')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center transition-colors ${filter === 'TOP_VOTED' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <Icons.ThumbsUp className="w-4 h-4 mr-2" />
                        Top Voted
                        </button>
                        <button onClick={() => setFilter('URGENT')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center transition-colors ${filter === 'URGENT' ? 'bg-red-600 text-white shadow-md shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <Icons.AlertTriangle className="w-4 h-4 mr-2" />
                        Urgent (AI)
                        </button>
                    </>
                )}
                
                {/* Specific Filters for Personal Dashboard */}
                {activeTab === 'DASHBOARD' && (
                    <>
                         <select 
                            value={dashboardStatusFilter} 
                            onChange={(e) => setDashboardStatusFilter(e.target.value as ComplaintStatus | 'ALL')}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-200"
                         >
                            <option value="ALL">All Statuses</option>
                            <option value={ComplaintStatus.OPEN}>Open</option>
                            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                         </select>
                    </>
                )}
              </div>
            </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map(complaint => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onClick={() => setSelectedComplaintId(complaint.id)} 
                onRate={handleRate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredComplaints.length === 0 && (
             <div className="text-center py-20 text-slate-400">
                 <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Icons.Search className="w-8 h-8 text-slate-300" />
                 </div>
                 <p className="text-lg font-medium text-slate-600">No complaints found</p>
                 <p className="text-sm">
                    {activeTab === 'DASHBOARD' ? "You haven't filed any complaints matching these filters." : "Try adjusting your filters or search terms."}
                 </p>
             </div>
          )}
        </>
      )}

      {/* New Complaint Flow Modal */}
      {showNewComplaintModal && (
        <CreateComplaintFlow 
          onClose={() => setShowNewComplaintModal(false)}
          onSubmit={handleFlowSubmit}
          industries={INDUSTRIES}
        />
      )}

      {/* Edit Complaint Modal (Legacy Simple Form) */}
      {showEditComplaintModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Edit Complaint</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required value={formCompany} onChange={e => setFormCompany(e.target.value)} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  {INDUSTRIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={4} className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowEditComplaintModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <CustomerFeedbackModal 
         isOpen={!!ratingModalComplaint}
         onClose={() => setRatingModalComplaint(null)}
         onSubmit={handleFeedbackSubmit}
         complaintTitle={ratingModalComplaint?.title || ''}
      />
    </div>
  );
};