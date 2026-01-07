import React from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { Icons } from '../Icons';

interface Props {
  complaint: Complaint;
  onBack: () => void;
  onUpdateStatus: (status: ComplaintStatus) => void;
}

export const AdminComplaintDetail: React.FC<Props> = ({ complaint, onBack, onUpdateStatus }) => {
  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <Icons.LogOut className="w-4 h-4 mr-2 rotate-180" />
          Back to list
        </button>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex items-center">
              <Icons.CheckCircle className="w-3 h-3 mr-1" /> Published
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase">{complaint.title}</h1>
            <p className="text-xs text-slate-400 mb-8">Submitted {new Date(complaint.createdAt).toLocaleDateString()}</p>
            
            <div className="prose prose-slate max-w-none pb-8 border-b border-slate-100">
               <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>

            <div className="flex items-center gap-6 mt-6 text-slate-400 text-sm font-medium">
               <span className="flex items-center gap-1"><Icons.ThumbsUp className="w-4 h-4" /> {complaint.upvotedBy.length} votes</span>
               <span className="flex items-center gap-1"><Icons.MessageSquare className="w-4 h-4" /> {complaint.comments.length} comments</span>
               <span className="flex items-center gap-1"><Icons.Activity className="w-4 h-4" /> {complaint.views || 0} views</span>
            </div>
          </div>

          {/* Supporting Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 relative">
             <div className="absolute top-8 right-8 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
               Admin Only
             </div>
             <div className="flex items-center gap-3 mb-6">
                <Icons.FileText className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-bold text-orange-900">Supporting Information</h3>
             </div>
             <p className="text-orange-700 text-sm italic">No supporting information was collected for this complaint.</p>
          </div>

          {/* Comments Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
               <Icons.MessageSquare className="w-6 h-6 text-slate-400" />
               <h3 className="text-lg font-bold text-slate-900">Comments ({complaint.comments.length})</h3>
            </div>
            {complaint.comments.length === 0 ? (
               <p className="text-slate-400 text-sm text-center py-10">No comments yet.</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h4 className="font-bold text-slate-900 mb-4">Status Actions</h4>
             <button 
               onClick={() => onUpdateStatus(ComplaintStatus.RESOLVED)}
               className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
             >
                <Icons.CheckCircle className="w-5 h-5" />
                Mark as Resolved
             </button>
          </div>

          {/* Info Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h4 className="font-bold text-slate-900 mb-6">Complaint Info</h4>
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Submitted By</label>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                         {complaint.authorName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{complaint.authorName}</span>
                   </div>
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                   <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">{complaint.category}</span>
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Business (Manual)</label>
                   <span className="font-bold text-slate-800 text-sm">{complaint.companyName}</span>
                </div>
                <div className="pt-4 border-t border-slate-50 space-y-3">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Created</label>
                      <span className="text-xs text-slate-700">{new Date(complaint.createdAt).toLocaleString()}</span>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Published</label>
                      <span className="text-xs text-slate-700">{new Date(complaint.createdAt).toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
