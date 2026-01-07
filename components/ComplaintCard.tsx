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

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[3rem] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.04)] border border-white overflow-hidden group hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer"
    >
      <div className="p-10 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-50 shadow-lg">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${complaint.authorName}`} className="w-full h-full object-cover" alt="Author" />
             </div>
             <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">{complaint.authorName}</h4>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                   {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.category}
                </div>
             </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors p-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
          </button>
        </div>

        <div className="space-y-6">
           <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed tracking-tight">
             <span className="font-black text-slate-900 block mb-2">{complaint.title}</span>
             {complaint.description.slice(0, 240)}...
           </p>
           
           {/* Mock Image Grid Style from UI image */}
           <div className="grid grid-cols-2 gap-4 h-64">
              <div className="rounded-[2rem] bg-slate-100 overflow-hidden shadow-xl border-4 border-white">
                 <img src={`https://picsum.photos/seed/${complaint.id}1/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Evidence" />
              </div>
              <div className="rounded-[2rem] bg-slate-100 overflow-hidden shadow-xl border-4 border-white">
                 <img src={`https://picsum.photos/seed/${complaint.id}2/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Context" />
              </div>
           </div>

           <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-10">
                 <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all ${isUpvoted ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
                 >
                   <Icons.ThumbsUp className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} />
                   {complaint.upvotedBy.length}
                 </button>
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <Icons.MessageSquare className="w-5 h-5" />
                    {complaint.comments.length}
                 </div>
              </div>
              
              <div className="flex -space-x-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={`https://picsum.photos/seed/${i + 50}/100/100`} className="w-full h-full object-cover" />
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 text-[10px] font-black text-white flex items-center justify-center shadow-md">
                    +
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};