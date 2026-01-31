
import React from 'react';
import { Complaint } from '../types';
import { Icons } from './Icons';
import { useApp } from '../context/AppContext';

interface Props {
  complaint: Complaint;
  onClick: () => void;
}

export const ComplaintCard: React.FC<Props> = ({ complaint, onClick }) => {
  const { toggleUpvote, currentUser } = useApp();
  const isUpvoted = currentUser ? complaint.upvotedBy.includes(currentUser.id) : false;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(complaint.id);
  };

  const mainImage = complaint.attachment || `https://picsum.photos/seed/${complaint.id}/800/600`;
  
  const sentimentColor = complaint.sentiment 
    ? (complaint.sentiment.score > 0.2 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
       complaint.sentiment.score < -0.2 ? 'bg-red-100 text-red-700 border-red-200' : 
       'bg-slate-100 text-slate-600 border-slate-200')
    : 'bg-slate-100 text-slate-600 border-slate-200';

  const logoUrl = `https://logo.clearbit.com/${complaint.companyName.toLowerCase().replace(/\s/g, '')}.com`;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:border-indigo-300 transition-all duration-300 cursor-pointer"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white flex items-center justify-center p-1">
                <img 
                  src={logoUrl} 
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${complaint.companyName}`; }}
                  className="w-full h-full object-contain" 
                  alt={complaint.companyName} 
                />
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                  {complaint.companyName}
                  <Icons.CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                </h4>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                   {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.category}
                </div>
             </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
             Ref: {complaint.id.slice(1, 7)}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
           <div>
             <div className="flex items-start justify-between gap-4 mb-1">
               <span className="text-lg font-bold text-slate-900 block leading-snug">{complaint.title}</span>
               {complaint.sentiment && (
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${sentimentColor} flex-shrink-0 mt-1`}>
                    {complaint.sentiment.score > 0 ? '+' : ''}{complaint.sentiment.score.toFixed(1)} AI
                 </span>
               )}
             </div>
             <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">{complaint.description}</p>
             
             {/* Tags Visualization */}
             {complaint.tags && complaint.tags.length > 0 && (
               <div className="flex flex-wrap gap-1.5 mb-4">
                 {complaint.tags.map(tag => (
                   <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-tighter rounded-full border border-slate-100">
                     #{tag}
                   </span>
                 ))}
               </div>
             )}
           </div>
           
           {/* Visual Evidence */}
           <div className="rounded-xl bg-slate-100 overflow-hidden shadow-sm border border-slate-200 h-64 md:h-80 relative">
              <img src={mainImage} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" alt="Main Evidence" />
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest">
                Case Image
              </div>
           </div>

           {/* Actions bar */}
           <div className="pt-6 mt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 text-xs font-bold transition-all p-1 -m-1 rounded-lg hover:bg-slate-50 ${isUpvoted ? 'text-indigo-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                   <Icons.ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                   {complaint.upvotedBy.length || 'Upvote'}
                 </button>
                 <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all p-1 -m-1 rounded-lg hover:bg-slate-50">
                    <Icons.MessageSquare className="w-4 h-4" />
                    {complaint.comments.length || 'Discuss'}
                 </button>
                 <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all p-1 -m-1 rounded-lg hover:bg-slate-50">
                    <Icons.Paperclip className="w-4 h-4" />
                    Save
                 </button>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1, 2].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                         <img src={`https://picsum.photos/seed/${i + 80}/100/100`} className="w-full h-full object-cover" alt="user" />
                      </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                   {complaint.views || 0} views
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
