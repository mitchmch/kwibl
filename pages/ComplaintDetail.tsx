
import React, { useState, useRef, useEffect } from 'react';
import { Complaint, UserRole, ComplaintStatus, Comment } from '../types';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';
import { generateProfessionalResponse, analyzeSentiment, translateText } from '../services/geminiService';

interface Props {
  complaint: Complaint;
  onBack: () => void;
}

const MAX_COMMENT_LENGTH = 1000;
const COMMON_EMOJIS = ['😊', '🙏', '👍', '😕', '📢', '✅', '📦', '⚠️', '💡', '💯'];

interface CommentNodeProps {
  comment: Comment;
  complaintId: string;
  depth?: number;
  onReply: (comment: Comment) => void;
  blockedUsers: string[];
  onToggleBlock: (userId: string) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  complaintId,
  depth = 0,
  onReply,
  blockedUsers,
  onToggleBlock,
}) => {
  const { currentUser, toggleCommentUpvote, reportComment } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (translation) {
      setTranslation(null);
      return;
    }
    setIsTranslating(true);
    const result = await translateText(comment.content, "English");
    setTranslation(result);
    setIsTranslating(false);
  };

  const hasUpvoted = currentUser ? comment.upvotes.includes(currentUser.id) : false;
  const isBlocked = blockedUsers.includes(comment.userId);
  const isUrgent = comment.sentiment?.label === 'Urgent' || comment.sentiment?.label === 'Negative';

  if (isBlocked) {
    return (
      <div className="mt-4 opacity-50 bg-slate-100/30 p-4 rounded-3xl border border-dashed border-slate-200 text-xs text-slate-400 flex justify-between items-center italic">
        <span>Content from blocked user hidden</span>
        <button onClick={() => onToggleBlock(comment.userId)} className="not-italic font-black text-indigo-600 uppercase tracking-widest text-[9px]">Unblock</button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${depth > 0 ? 'mt-4' : 'mt-10'}`}>
      <div className={`p-8 md:p-10 rounded-[2.5rem] transition-all relative border-2 ${
        comment.isOfficialResponse 
        ? 'bg-indigo-50/40 border-indigo-100 shadow-[0_30px_60px_-20px_rgba(79,70,229,0.1)]' 
        : 'bg-white border-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.05)]'
      }`}>
        
        <div className={`absolute top-10 bottom-10 left-0 w-1.5 rounded-r-full ${
          isUrgent ? 'bg-red-500' : comment.isOfficialResponse ? 'bg-indigo-600' : 'bg-slate-200'
        }`} />

        <div className="absolute top-10 right-10 flex items-center gap-3">
          {comment.reportedBy && comment.reportedBy.length > 0 && (
            <Icons.AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          )}
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-50 py-3 z-50 animate-fade-in overflow-hidden">
                <button onClick={() => { onToggleBlock(comment.userId); setIsMenuOpen(false); }} className="w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                  <Icons.Shield className="w-4 h-4 opacity-40" /> Block User
                </button>
                <button onClick={() => { reportComment(complaintId, comment.id); setIsMenuOpen(false); }} className="w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-3">
                  <Icons.Flag className="w-4 h-4 opacity-60" /> Report Post
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 md:gap-8">
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
            </div>
            {comment.isOfficialResponse && (
               <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                  <Icons.CheckCircle className="w-4 h-4" />
               </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">{comment.userName}</span>
              {comment.isOfficialResponse && (
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-indigo-100">
                  Business Lead
                </span>
              )}
              <span className="text-xs text-slate-300 font-bold uppercase tracking-widest ml-2">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>

            <div className={`text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium tracking-tight ${translation ? 'italic text-indigo-900/60' : ''}`}>
              {translation || comment.content}
            </div>

            {comment.sentiment?.summary && (
              <div className={`mt-6 p-6 rounded-[2rem] border flex items-start gap-5 transition-all ${
                isUrgent ? 'bg-red-50/50 border-red-100 text-red-700' : 'bg-slate-50/80 border-slate-100 text-slate-500'
              }`}>
                <Icons.Brain className={`w-5 h-5 mt-1 flex-shrink-0 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} />
                <div className="text-[11px] font-bold leading-tight">
                  <span className="uppercase tracking-[0.3em] block mb-1.5 opacity-40 text-[9px]">Neural Summary</span>
                  {comment.sentiment.summary}
                </div>
              </div>
            )}
            
            <div className="mt-10 flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <button onClick={() => toggleCommentUpvote(complaintId, comment.id)} className={`flex items-center gap-2.5 transition-all ${hasUpvoted ? 'text-indigo-600 scale-105' : 'hover:text-indigo-600 hover:-translate-y-0.5'}`}>
                <Icons.ThumbsUp className={`w-5 h-5 ${hasUpvoted ? 'fill-current' : ''}`} />
                {comment.upvotes.length || 'Relevant'}
              </button>
              <button onClick={() => onReply(comment)} className="flex items-center gap-2.5 hover:text-indigo-600 transition-all hover:-translate-y-0.5">
                <Icons.MessageSquare className="w-5 h-5" /> Reply
              </button>
              {(comment.language && comment.language !== 'English') && (
                <button onClick={handleTranslate} className="flex items-center gap-2.5 text-indigo-500 transition-all hover:opacity-70">
                  <Icons.Globe className={`w-5 h-5 ${isTranslating ? 'animate-spin' : ''}`} />
                  {translation ? 'Original' : 'Auto-Translate'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-12 md:ml-24 border-l-4 border-slate-100/50 pl-10 md:pl-20 relative">
           <div className="absolute top-0 left-[-4px] h-14 w-1 bg-indigo-500/10 rounded-full" />
          {comment.replies.map(reply => (
            <CommentNode 
              key={reply.id} 
              comment={reply} 
              complaintId={complaintId} 
              onReply={onReply} 
              blockedUsers={blockedUsers} 
              onToggleBlock={onToggleBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ComplaintDetail: React.FC<Props> = ({ complaint, onBack }) => {
  const { currentUser, updateStatus, addComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'INSIGHTS' | 'HISTORY'>('INSIGHTS');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusinessOwner = currentUser?.role === UserRole.BUSINESS && currentUser?.companyName === complaint.companyName;
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isAssigned = complaint.status !== ComplaintStatus.OPEN;

  const handleRichText = (tag: 'B' | 'I' | 'L') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = commentText.substring(start, end);
    let updated = '';
    if (tag === 'B') updated = `**${selected}**`;
    else if (tag === 'I') updated = `*${selected}*`;
    else if (tag === 'L') updated = `\n- ${selected}`;
    setCommentText(commentText.substring(0, start) + updated + commentText.substring(end));
    textareaRef.current.focus();
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsProcessing(true);
    const sentiment = await analyzeSentiment(commentText);
    addComment(complaint.id, commentText, attachment || undefined, replyTo?.id, sentiment);
    setCommentText('');
    setReplyTo(null);
    setAttachment(null);
    setIsProcessing(false);
  };

  const charPercent = (commentText.length / MAX_COMMENT_LENGTH) * 100;

  return (
    <div className="animate-fade-in max-w-[1440px] mx-auto pb-48 lg:pt-8 px-6 md:px-12 bg-slate-50 min-h-screen">
      
      <button onClick={onBack} className="group mb-12 flex items-center gap-5 text-slate-400 hover:text-indigo-600 transition-all font-black uppercase text-[11px] tracking-[0.5em]">
        <div className="w-14 h-14 rounded-[1.8rem] bg-white border-2 border-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all shadow-xl">
          <Icons.LogOut className="w-6 h-6 rotate-180" />
        </div>
        Return to Feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-12 items-start">
        
        <div className="space-y-12">
          
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] border border-white overflow-hidden">
            <div className="p-10 md:p-20">
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <div className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                  {complaint.category}
                </div>
                <div className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] ml-4">
                   Ticket Ref: {complaint.id.slice(1, 9)}
                </div>
                {complaint.sentiment?.label === 'Urgent' && (
                  <div className="ml-auto px-6 py-2.5 rounded-2xl bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                    Urgent Response Needed
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-12">
                {complaint.title}
              </h1>

              <div className="relative mb-16">
                <div className="absolute -left-12 top-0 bottom-0 w-2.5 bg-indigo-500/10 rounded-full" />
                <p className="text-slate-600 text-xl md:text-3xl font-medium leading-[1.5] whitespace-pre-wrap max-w-5xl tracking-tight">
                  {complaint.description}
                </p>
              </div>

              {/* Private / Required Information Section (Admin & Assigned Business Only) */}
              {(isAdmin || (isBusinessOwner && isAssigned)) && complaint.privateDetails && Object.keys(complaint.privateDetails).length > 0 && (
                <div className="mb-16 p-10 bg-indigo-950 rounded-[3rem] text-white shadow-2xl animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Icons.Shield className="w-40 h-40" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                         <Icons.List className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-widest">Required Information</h3>
                    </div>
                    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] mb-8">
                       <p className="text-sm font-bold text-indigo-200 flex items-center gap-3">
                         <Icons.AlertCircle className="w-5 h-5 flex-shrink-0" />
                         Notice: The information shared in this section is only visible to the admin and business and would not be shared on the frontend feed.
                       </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {Object.entries(complaint.privateDetails).map(([key, value]) => (
                         <div key={key} className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{key}</label>
                           <div className="text-lg font-bold">{value}</div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 shadow-inner">
                <div className="w-16 h-16 rounded-[1.8rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl">
                   <Icons.Activity className="w-8 h-8" />
                </div>
                <div>
                   <div className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Collaborative Status</div>
                   <div className="text-sm font-bold text-slate-400">Public resolution path is active with community oversight</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between px-6">
               <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                 Community Feed <span className="text-indigo-100 text-2xl font-black tracking-widest">/ {complaint.comments.length}</span>
               </h3>
               <div className="hidden md:flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronized</span>
               </div>
            </div>

            {complaint.comments.length === 0 ? (
               <div className="bg-white rounded-[3.5rem] p-32 text-center border-2 border-dashed border-slate-100 flex flex-col items-center">
                  <div className="bg-indigo-50/50 w-28 h-28 rounded-[2rem] flex items-center justify-center mb-8">
                     <Icons.MessageSquare className="w-12 h-12 text-indigo-200" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">Start the conversation</h4>
                  <p className="text-slate-400 text-base mt-3 font-bold max-w-sm">Help the community by providing your insight or asking for clarification.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {complaint.comments.map(comment => (
                  <CommentNode 
                    key={comment.id} 
                    comment={comment} 
                    complaintId={complaint.id} 
                    onReply={setReplyTo} 
                    blockedUsers={blockedUsers} 
                    onToggleBlock={u => setBlockedUsers(p => p.includes(u) ? p.filter(x => x !== u) : [...p, u])}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12 sticky top-12">
          
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.04)] border border-white overflow-hidden">
            <div className="flex p-4 bg-slate-50/50 border-b border-slate-100 gap-3">
              <button onClick={() => setSidebarTab('INSIGHTS')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.8rem] transition-all ${sidebarTab === 'INSIGHTS' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Insights</button>
              <button onClick={() => setSidebarTab('HISTORY')} className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.8rem] transition-all ${sidebarTab === 'HISTORY' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Timeline</button>
            </div>

            <div className="p-10">
              {sidebarTab === 'INSIGHTS' ? (
                <div className="space-y-12 animate-fade-in">
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Target Brand</span>
                    <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-16 h-16 rounded-[1.8rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl transition-all group-hover:scale-110 duration-500">
                         <Icons.Briefcase className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{complaint.companyName}</div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Partner Network</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-10 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Platform Health</span>
                    <div className={`text-5xl font-black uppercase tracking-tighter leading-none ${
                      complaint.status === ComplaintStatus.RESOLVED ? 'text-emerald-500' : 'text-indigo-600'
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </div>
                  </div>

                  {isBusinessOwner && (
                    <div className="pt-10 border-t border-slate-100 grid grid-cols-1 gap-4">
                      <button onClick={() => updateStatus(complaint.id, ComplaintStatus.IN_PROGRESS)} className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Escalate Tier</button>
                      <button onClick={() => updateStatus(complaint.id, ComplaintStatus.RESOLVED)} className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-200 active:scale-95 transition-all">Verify Resolution</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-14 animate-fade-in relative pl-10 border-l-4 border-slate-100 py-6 ml-4">
                   {complaint.history.map((entry, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[54px] top-1.5 w-8 h-8 rounded-[1.3rem] border-[6px] border-white bg-indigo-600 shadow-2xl group-hover:scale-125 transition-transform z-10" />
                      <div className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-1">{entry.status.replace('_', ' ')}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 p-4 opacity-10 group-hover:opacity-20 transition-all duration-[2000ms]">
               <Icons.Brain className="w-80 h-80 rotate-12" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20">
                     <Icons.Zap className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-400">Neural Sync</h4>
               </div>
               <p className="text-white text-3xl font-black italic leading-[1.2] mb-12 tracking-tight">
                 "{complaint.sentiment?.summary || 'Scanning linguistic patterns...'}"
               </p>
               <div className="flex items-center justify-between pt-10 border-t border-white/10">
                  <div className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-300/60">kwibl Engine 3.1-PRO</div>
                  <Icons.Shield className="w-6 h-6 text-white/20" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-10 md:pb-16 pointer-events-none">
        <div className="max-w-5xl mx-auto w-full pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-3xl rounded-[3.5rem] border border-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] overflow-hidden transition-all hover:shadow-[0_70px_130px_-35px_rgba(0,0,0,0.35)] ring-1 ring-slate-200/50">
            {replyTo && (
              <div className="flex items-center justify-between bg-indigo-600 px-10 py-5 text-white animate-fade-in shadow-xl">
                <div className="flex items-center gap-5">
                  <img src={replyTo.userAvatar} className="w-10 h-10 rounded-[1.3rem] border-2 border-white/20 object-cover shadow-2xl" alt="Avatar" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Replying to {replyTo.userName}</span>
                </div>
                <button onClick={() => setReplyTo(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"><Icons.LogOut className="w-5 h-5 rotate-45" /></button>
              </div>
            )}
            
            <div className="p-4 px-10 border-b border-slate-100 flex items-center gap-3 bg-slate-50/30">
              <button onClick={() => handleRichText('B')} className="p-4 hover:bg-white rounded-2xl hover:shadow-2xl transition-all text-slate-400 hover:text-indigo-600"><Icons.Bold className="w-5 h-5" /></button>
              <button onClick={() => handleRichText('I')} className="p-4 hover:bg-white rounded-2xl hover:shadow-2xl transition-all text-slate-400 hover:text-indigo-600"><Icons.Italic className="w-5 h-5" /></button>
              <button onClick={() => handleRichText('L')} className="p-4 hover:bg-white rounded-2xl hover:shadow-2xl transition-all text-slate-400 hover:text-indigo-600"><Icons.List className="w-5 h-5" /></button>
              <div className="w-px h-8 bg-slate-200/50 mx-3" />
              <div className="relative">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-4 hover:bg-white rounded-2xl hover:shadow-2xl transition-all text-slate-400 hover:text-indigo-600"><Icons.Smile className="w-5 h-5" /></button>
                {showEmojiPicker && (
                  <div className="absolute bottom-24 left-0 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-8 grid grid-cols-5 gap-5 z-50 border border-slate-50 animate-fade-in">
                    {COMMON_EMOJIS.map(e => (
                      <button key={e} onClick={() => { setCommentText(prev => prev + e); setShowEmojiPicker(false); }} className="hover:scale-125 transition-transform p-1 text-3xl">{e}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="p-4 hover:bg-white rounded-2xl hover:shadow-2xl transition-all text-slate-400 hover:text-indigo-600"><Icons.Image className="w-5 h-5" /></button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => { if(e.target.files?.[0]) { const r = new FileReader(); r.onloadend = () => setAttachment(r.result as string); r.readAsDataURL(e.target.files[0]); }}} />
              
              {isBusinessOwner && (
                <button onClick={async () => { setIsProcessing(true); setCommentText(await generateProfessionalResponse(complaint.description, complaint.companyName)); setIsProcessing(false); }} className="ml-auto text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-3 bg-indigo-50/80 px-6 py-3 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all shadow-lg">
                  <Icons.Brain className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} /> AI Smart Draft
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full px-10 py-10 md:py-12 bg-transparent border-none focus:ring-0 transition-all resize-none text-slate-900 font-black placeholder:text-slate-300 min-h-[160px] text-xl md:text-3xl tracking-tighter leading-tight"
                placeholder={replyTo ? `Draft response...` : "Update the community..."}
                maxLength={MAX_COMMENT_LENGTH}
              />
              
              <div className="absolute bottom-10 right-10 flex items-center gap-10">
                <div className="flex flex-col items-end gap-2">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full transition-all duration-500 ${charPercent > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${charPercent}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={handlePostComment}
                  disabled={!commentText.trim() || isProcessing}
                  className="bg-slate-950 text-white px-12 md:px-16 py-5 md:py-6 rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] hover:bg-black disabled:opacity-30 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] active:scale-95 flex items-center gap-4 group"
                >
                  {isProcessing ? <Icons.Activity className="w-6 h-6 animate-spin" /> : (replyTo ? 'Reply Post' : 'Share Post')}
                  {!isProcessing && <Icons.Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
