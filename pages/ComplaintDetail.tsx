
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
  parentAuthorName?: string;
}

const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  complaintId,
  depth = 0,
  onReply,
  blockedUsers,
  onToggleBlock,
  parentAuthorName,
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
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-300 hover:text-slate-500">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-3xl shadow-2xl border border-slate-50 py-3 z-50 animate-fade-in overflow-hidden">
                <button onClick={() => { onToggleBlock(comment.userId); setIsMenuOpen(false); }} className="w-full text-left px-6 py-3 text-xs font-black uppercase text-slate-600 hover:bg-slate-50">Block User</button>
                <button onClick={() => { reportComment(complaintId, comment.id); setIsMenuOpen(false); }} className="w-full text-left px-6 py-3 text-xs font-black uppercase text-red-600 hover:bg-red-50">Report Post</button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6 md:gap-8">
          <img src={comment.userAvatar} className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] border-4 border-white shadow-2xl object-cover" alt="" />
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="font-black text-slate-900 tracking-tighter text-xl">{comment.userName}</span>
              {comment.isOfficialResponse && <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.3em]">Official</span>}
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(comment.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="text-slate-600 leading-relaxed font-medium text-lg">{translation || comment.content}</div>
            <div className="mt-8 flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <button onClick={() => toggleCommentUpvote(complaintId, comment.id)} className={`flex items-center gap-2.5 ${hasUpvoted ? 'text-indigo-600' : 'hover:text-indigo-600'}`}><Icons.ThumbsUp className="w-4 h-4" />{comment.upvotes.length || 'Relevant'}</button>
              <button onClick={() => onReply(comment)} className="flex items-center gap-2.5 hover:text-indigo-600"><Icons.MessageSquare className="w-4 h-4" /> Reply</button>
            </div>
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="ml-8 md:ml-16 border-l-2 border-indigo-500/10 pl-6 md:pl-12 mt-4">
          {comment.replies.map(reply => (
            <CommentNode key={reply.id} comment={reply} complaintId={complaintId} onReply={onReply} depth={depth + 1} blockedUsers={blockedUsers} onToggleBlock={onToggleBlock} parentAuthorName={comment.userName} />
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
  const [aiSummary, setAiSummary] = useState<string | null>(complaint.sentiment?.summary || null);
  const [sidebarTab, setSidebarTab] = useState<'INSIGHTS' | 'HISTORY'>('INSIGHTS');
  const [mainTab, setMainTab] = useState<'DISCUSSION' | 'HISTORY'>('DISCUSSION');
  
  const isBusinessOwner = currentUser?.role === UserRole.BUSINESS && currentUser?.companyName === complaint.companyName;

  const handleAIDraft = async () => {
    if (!complaint.description) return;
    setIsProcessing(true);
    try {
      const draft = await generateProfessionalResponse(complaint.description, complaint.companyName);
      setCommentText(draft);
    } catch (error) {
      console.error("AI Draft failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsProcessing(true);
    const sentiment = await analyzeSentiment(commentText);
    addComment(complaint.id, commentText, undefined, replyTo?.id, sentiment);
    setCommentText('');
    setReplyTo(null);
    setIsProcessing(false);
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.OPEN: return 'bg-blue-500';
      case ComplaintStatus.IN_PROGRESS: return 'bg-amber-500';
      case ComplaintStatus.RESOLVED: return 'bg-emerald-500';
      case ComplaintStatus.ESCALATED: return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="animate-fade-in max-w-[1440px] mx-auto pb-48 px-6 md:px-12 bg-slate-50 min-h-screen">
      <button onClick={onBack} className="group mb-12 flex items-center gap-5 text-slate-400 hover:text-indigo-600 transition-all font-black uppercase text-[11px] tracking-[0.5em]">
        <div className="w-14 h-14 rounded-[1.8rem] bg-white border-2 border-slate-50 flex items-center justify-center shadow-xl group-hover:bg-indigo-50"><Icons.LogOut className="w-6 h-6 rotate-180" /></div>
        Return to Feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-12 items-start">
        <div className="space-y-12">
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] border border-white p-10 md:p-20">
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <div className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">{complaint.category}</div>
              <div className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.5em] ml-4">{complaint.taskKey}</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8">{complaint.title}</h1>
            {aiSummary && <div className="mb-12 p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl"><p className="text-indigo-900 font-bold text-lg leading-snug">"{aiSummary}"</p></div>}
            <p className="text-slate-600 text-xl md:text-3xl font-medium leading-[1.5] whitespace-pre-wrap tracking-tight">{complaint.description}</p>
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-8 px-6">
              <button onClick={() => setMainTab('DISCUSSION')} className={`text-2xl font-black tracking-tighter transition-all relative pb-2 ${mainTab === 'DISCUSSION' ? 'text-slate-900' : 'text-slate-300'}`}>Discussion {mainTab === 'DISCUSSION' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}</button>
              <button onClick={() => setMainTab('HISTORY')} className={`text-2xl font-black tracking-tighter transition-all relative pb-2 ${mainTab === 'HISTORY' ? 'text-slate-900' : 'text-slate-300'}`}>History {mainTab === 'HISTORY' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}</button>
            </div>
            {mainTab === 'DISCUSSION' ? (
              <div className="space-y-4">
                {complaint.comments.map(comment => (
                  <CommentNode key={comment.id} comment={comment} complaintId={complaint.id} onReply={setReplyTo} depth={0} blockedUsers={blockedUsers} onToggleBlock={u => setBlockedUsers(p => p.includes(u) ? p.filter(x => x !== u) : [...p, u])} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-white">
                <div className="relative pl-12 border-l-4 border-slate-100 space-y-12">
                  {complaint.history.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[62px] top-1.5 w-10 h-10 rounded-[1.4rem] border-[6px] border-white shadow-xl ${getStatusColor(entry.status)}`} />
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{entry.status.replace('_', ' ')}</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12 sticky top-12">
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.04)] border border-white p-10">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Partner Health</h3>
            <div className="text-5xl font-black uppercase tracking-tighter leading-none text-indigo-600 mb-10">{complaint.status.replace('_', ' ')}</div>
            {isBusinessOwner && complaint.status !== ComplaintStatus.RESOLVED && (
              <button onClick={() => { if(confirm('Mark as resolved?')) updateStatus(complaint.id, ComplaintStatus.RESOLVED); }} className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Verify Resolution</button>
            )}
          </div>
          <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white shadow-2xl">
            <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-400 mb-10">Neural Sync Intelligence</h4>
            <p className="text-white text-3xl font-black italic leading-[1.2]">"{aiSummary || 'Scanning patterns...'}"</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-16 pointer-events-none">
        <div className="max-w-5xl mx-auto w-full pointer-events-auto bg-white/90 backdrop-blur-3xl rounded-[3.5rem] border border-white shadow-2xl overflow-hidden p-4 md:p-6">
          <div className="flex items-center gap-4">
            <textarea 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-black placeholder:text-slate-300 resize-none h-16" 
              placeholder={replyTo ? `Replying to ${replyTo.userName}...` : "Share an update..."} 
            />
            <div className="flex items-center gap-2">
              {isBusinessOwner && (
                <button 
                  onClick={handleAIDraft}
                  disabled={isProcessing}
                  className="bg-indigo-50 text-indigo-600 px-6 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-100 transition-all flex items-center gap-2"
                  title="AI Draft Response"
                >
                  <Icons.Brain className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
                  <span className="hidden md:inline">AI Draft</span>
                </button>
              )}
              <button 
                onClick={handlePostComment} 
                disabled={!commentText.trim() || isProcessing} 
                className="bg-slate-950 text-white px-12 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-black disabled:opacity-30 active:scale-95 transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
