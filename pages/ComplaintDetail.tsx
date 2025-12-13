import React, { useState, useRef, useMemo } from 'react';
import { Complaint, UserRole, ComplaintStatus, Comment } from '../types';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/Icons';
import { generateProfessionalResponse, analyzeSentiment, translateText } from '../services/geminiService';

interface Props {
  complaint: Complaint;
  onBack: () => void;
}

const MAX_COMMENT_LENGTH = 1000;
const EMOJIS = ['👍', '👎', '👏', '🙏', '😄', '😊', '😢', '😠', '❤️', '🎉', '🔥', '👀', '✅', '❌', '🤔', '👋', '🤝', '💼', '⭐', '✨'];

interface CommentNodeProps {
    comment: Comment;
    complaintId: string;
    depth?: number;
    topContributorId?: string | null;
    onReply: (comment: Comment) => void;
    blockedUsers: string[];
    onToggleBlock: (userId: string) => void;
}

// --- Helper Component for Recursive Comment Rendering ---
const CommentNode: React.FC<CommentNodeProps> = ({ 
    comment, 
    complaintId,
    depth = 0, 
    topContributorId,
    onReply,
    blockedUsers,
    onToggleBlock
}) => {
    const { currentUser, toggleCommentUpvote } = useApp();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [translation, setTranslation] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    
    // Toggle translation
    const handleTranslate = async () => {
        if (translation) {
            setTranslation(null);
            return;
        }
        setIsTranslating(true);
        // Defaulting to English for demo purposes, in real app would use user preference
        const result = await translateText(comment.content, "English");
        setTranslation(result);
        setIsTranslating(false);
    };

    const isTopContributor = topContributorId && comment.userId === topContributorId;
    const hasUpvoted = currentUser ? comment.upvotes.includes(currentUser.id) : false;
    const isBlocked = blockedUsers.includes(comment.userId);
    const isForeign = comment.language && comment.language !== 'English';

    if (isBlocked) {
        return (
            <div className={`flex flex-col ${depth > 0 ? 'mt-4' : ''}`}>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <Icons.Shield className="w-4 h-4 text-slate-400" />
                         <span>Content from <strong>{comment.userName}</strong> has been blocked.</span>
                    </div>
                    <button 
                        onClick={() => onToggleBlock(comment.userId)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline"
                    >
                        Unblock
                    </button>
                </div>
                {/* Render replies even if parent is blocked, to maintain thread continuity */}
                {comment.replies.length > 0 && (
                    <div className="ml-6 md:ml-12 border-l-2 border-slate-100 pl-4 md:pl-6">
                        {comment.replies.map(reply => (
                            <CommentNode 
                                key={reply.id} 
                                comment={reply} 
                                complaintId={complaintId}
                                depth={depth + 1} 
                                topContributorId={topContributorId}
                                onReply={onReply}
                                blockedUsers={blockedUsers}
                                onToggleBlock={onToggleBlock}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${depth > 0 ? 'mt-4' : ''}`}>
            <div 
                className={`p-6 rounded-2xl border shadow-sm transition-all relative group ${
                    comment.isOfficialResponse 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white border-slate-200'
                }`}
            >
                {/* Menu Dropdown */}
                <div className="absolute top-4 right-4">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-slate-600 p-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-10 animate-fade-in">
                            <button 
                                onClick={() => { setIsMenuOpen(false); alert(`Reported comment by ${comment.userName}. We will review it shortly.`); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                                <Icons.AlertTriangle className="w-4 h-4 mr-2" />
                                Report Content
                            </button>
                            <button 
                                onClick={() => { setIsMenuOpen(false); onToggleBlock(comment.userId); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                            >
                                <Icons.Shield className="w-4 h-4 mr-2" />
                                Block User
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 relative">
                        <img 
                            src={comment.userAvatar} 
                            alt={comment.userName} 
                            className={`w-10 h-10 rounded-full border-2 object-cover ${
                                comment.isOfficialResponse ? 'border-blue-200 ring-2 ring-blue-50' : 
                                isTopContributor ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-slate-100'
                            }`} 
                        />
                        {isTopContributor && !comment.isOfficialResponse && (
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 border-2 border-white" title="Top Contributor">
                                <Icons.Star className="w-3 h-3 fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2 pr-8">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-bold text-sm ${comment.isOfficialResponse ? 'text-blue-900' : 'text-slate-900'}`}>
                                    {comment.userName}
                                </span>
                                {comment.isOfficialResponse && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                                        <Icons.CheckCircle className="w-3 h-3" />
                                        Official
                                    </span>
                                )}
                                {isTopContributor && !comment.isOfficialResponse && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wide">
                                        Top Contributor
                                    </span>
                                )}
                                <span className="text-xs text-slate-400 font-medium">
                                    • {new Date(comment.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {/* Comment Content */}
                        <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {translation || comment.content}
                        </div>
                        
                        {/* Sentiment & Translation Badges */}
                        <div className="mt-2 flex gap-2">
                             {comment.sentiment && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                                    comment.sentiment.label === 'Negative' ? 'bg-red-50 border-red-100 text-red-600' : 
                                    comment.sentiment.label === 'Positive' ? 'bg-green-50 border-green-100 text-green-600' :
                                    comment.sentiment.label === 'Urgent' ? 'bg-red-100 border-red-200 text-red-700 font-bold' :
                                    'bg-slate-50 border-slate-100 text-slate-500'
                                }`}>
                                    {comment.sentiment.label === 'Urgent' && <Icons.AlertTriangle className="w-2.5 h-2.5" />}
                                    {comment.sentiment.label}
                                </span>
                             )}
                             {translation && (
                                 <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center gap-1">
                                     <Icons.Globe className="w-3 h-3" /> Translated
                                 </span>
                             )}
                        </div>

                        {/* Attachment */}
                        {comment.attachmentUrl && (
                            <div className="mt-3">
                                <img 
                                    src={comment.attachmentUrl} 
                                    alt="Attachment" 
                                    className="max-h-64 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:opacity-95"
                                    onClick={() => window.open(comment.attachmentUrl, '_blank')}
                                />
                            </div>
                        )}

                        {/* Actions Footer */}
                        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                             <button 
                                onClick={() => toggleCommentUpvote(complaintId, comment.id)}
                                className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${hasUpvoted ? 'text-indigo-600' : ''}`}
                             >
                                 <Icons.ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
                                 {comment.upvotes.length || 'Helpful'}
                             </button>
                             <button 
                                onClick={() => onReply(comment)}
                                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                             >
                                 <Icons.MessageSquare className="w-3.5 h-3.5" />
                                 Reply
                             </button>
                             {/* Show translate if foreign or we don't know the language, but always keep the option available */}
                             <button 
                                onClick={handleTranslate}
                                className={`flex items-center gap-1 transition-colors ${isForeign ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'}`}
                             >
                                 <Icons.Globe className="w-3.5 h-3.5" />
                                 {isTranslating ? 'Translating...' : translation ? 'Show Original' : (isForeign ? `Translate from ${comment.language}` : 'Translate')}
                             </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Nested Replies */}
            {comment.replies.length > 0 && (
                <div className="ml-6 md:ml-12 border-l-2 border-slate-100 pl-4 md:pl-6">
                    {comment.replies.map(reply => (
                        <CommentNode 
                            key={reply.id} 
                            comment={reply} 
                            complaintId={complaintId}
                            depth={depth + 1} 
                            topContributorId={topContributorId}
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
  const { currentUser, addComment, updateStatus, updateComplaint, complaints } = useApp();
  const [newComment, setNewComment] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  
  // New State variables for requested features
  const [manualSummary, setManualSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Feature Logic: Related Complaints ---
  const relatedComplaints = useMemo(() => {
    // Split current title into keywords (simple space split)
    const keywords = complaint.title.toLowerCase().split(' ').filter(word => word.length > 3);
    
    return complaints.filter(c => {
        if (c.id === complaint.id) return false;
        const targetText = (c.title + ' ' + c.description).toLowerCase();
        // Check if any keyword matches
        return keywords.some(keyword => targetText.includes(keyword));
    }).slice(0, 3); // Limit to 3
  }, [complaint, complaints]);

  // --- Feature Logic: Summary ---
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const sentiment = await analyzeSentiment(complaint.description);
    setManualSummary(sentiment.summary);
    // Persist this via updateComplaint if desired, but for now just local state for the button feedback
    await updateComplaint(complaint.id, { sentiment });
    setIsGeneratingSummary(false);
  };

  // --- Feature Logic: Translation ---
  const handleTranslateDescription = async () => {
    if (translatedDesc) {
        setTranslatedDesc(null);
        return;
    }
    setIsTranslatingDesc(true);
    const result = await translateText(complaint.description, "Spanish");
    setTranslatedDesc(result);
    setIsTranslatingDesc(false);
  };

  // --- Feature Logic: Tags ---
  const handleAddTag = async () => {
      if (!tagInput.trim()) return;
      const newTag = tagInput.trim().toLowerCase();
      if (!complaint.tags.includes(newTag)) {
          const updatedTags = [...(complaint.tags || []), newTag];
          await updateComplaint(complaint.id, { tags: updatedTags });
      }
      setTagInput('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
      const updatedTags = complaint.tags.filter(t => t !== tagToRemove);
      await updateComplaint(complaint.id, { tags: updatedTags });
  };


  // Calculate Top Contributor
  const topContributorId = useMemo(() => {
      const userScores: Record<string, number> = {};
      
      const traverse = (comments: Comment[]) => {
          comments.forEach(c => {
              if (!c.isOfficialResponse) {
                  userScores[c.userId] = (userScores[c.userId] || 0) + c.upvotes.length;
              }
              if (c.replies.length > 0) traverse(c.replies);
          });
      };
      
      traverse(complaint.comments);
      
      let maxScore = -1;
      let topUser: string | null = null;
      for (const [userId, score] of Object.entries(userScores)) {
          if (score > maxScore && score > 0) {
              maxScore = score;
              topUser = userId;
          }
      }
      return topUser;
  }, [complaint.comments]);

  const handleToggleBlock = (userId: string) => {
    if (blockedUsers.includes(userId)) {
        setBlockedUsers(prev => prev.filter(id => id !== userId));
    } else {
        if (window.confirm("Are you sure you want to block this user? Their comments will be hidden from your view.")) {
            setBlockedUsers(prev => [...prev, userId]);
        }
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !attachedImage) return;
    
    setIsPosting(true);

    let commentSentiment = undefined;
    if (newComment.trim()) {
        try {
            commentSentiment = await analyzeSentiment(newComment);
        } catch (err) {
            console.warn("Failed to analyze comment sentiment");
        }
    }

    addComment(
        complaint.id, 
        newComment, 
        attachedImage || undefined, 
        replyingTo?.id,
        commentSentiment
    );
    
    setNewComment('');
    setAttachedImage(null);
    setShowEmojiPicker(false);
    setReplyingTo(null);
    setIsPosting(false);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_COMMENT_LENGTH) {
      setNewComment(text);
    }
  };

  const handleAiDraft = async () => {
    if (!currentUser?.companyName) return;
    setIsDrafting(true);
    const draft = await generateProfessionalResponse(complaint.description, currentUser.companyName);
    setNewComment(draft.slice(0, MAX_COMMENT_LENGTH));
    setIsDrafting(false);
  };

  // Rich Text Helpers
  const insertFormatting = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = newComment;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${prefix}${selection}${suffix}${after}`;
    if (newText.length <= MAX_COMMENT_LENGTH) {
        setNewComment(newText);
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) {
      insertFormatting('[', `](${url})`);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = newComment;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = `${before}${emoji}${after}`;
    if (newText.length <= MAX_COMMENT_LENGTH) {
        setNewComment(newText);
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setAttachedImage(url);
      }
  };

  const isBusinessOwner = currentUser?.role === UserRole.BUSINESS && currentUser.companyName === complaint.companyName;
  const charsRemaining = MAX_COMMENT_LENGTH - newComment.length;
  const isNearLimit = charsRemaining <= 50;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-slate-300 shadow-sm">
             <Icons.LogOut className="w-4 h-4 rotate-180" /> 
        </div>
        Back to Community Feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Complaint Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Section */}
            <div className="p-8 border-b border-slate-100">
               <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-white rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl ring-4 ring-slate-50 shadow-sm">
                            {complaint.authorName.charAt(0)}
                        </div>
                        {complaint.sentiment?.label === 'Urgent' && (
                            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-white" title="Urgent">
                                <Icons.AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{complaint.title}</h1>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                            <span className="font-semibold text-slate-900">{complaint.authorName}</span>
                            <span className="mx-2 text-slate-300">•</span>
                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2 text-slate-300">•</span>
                            <span className="text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                                {complaint.category}
                            </span>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* New Header Buttons Row */}
               <div className="flex items-center gap-2 mt-4">
                   <button 
                     onClick={handleGenerateSummary}
                     disabled={isGeneratingSummary}
                     className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-100 transition-colors flex items-center border border-purple-100"
                   >
                       {isGeneratingSummary ? <Icons.Activity className="w-3 h-3 animate-spin mr-1"/> : <Icons.Activity className="w-3 h-3 mr-1"/>}
                       AI Summary
                   </button>
                   <button 
                     onClick={handleTranslateDescription}
                     disabled={isTranslatingDesc}
                     className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition-colors flex items-center border border-indigo-100"
                   >
                       {isTranslatingDesc ? <Icons.Activity className="w-3 h-3 animate-spin mr-1"/> : <Icons.Globe className="w-3 h-3 mr-1"/>}
                       {translatedDesc ? 'Show Original' : 'Translate'}
                   </button>
               </div>

               {/* AI Summary Section */}
               {(manualSummary || complaint.sentiment?.summary) && (
                   <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100 text-sm text-slate-700 flex gap-3 animate-fade-in">
                       <div className="mt-0.5"><Icons.Activity className="w-4 h-4 text-purple-600" /></div>
                       <p><strong>Summary:</strong> {manualSummary || complaint.sentiment?.summary}</p>
                   </div>
               )}
            </div>
            
            {/* Body Section */}
            <div className="p-8">
              <div className="prose prose-slate max-w-none mb-6 text-lg text-slate-700 leading-relaxed">
                 {translatedDesc || complaint.description}
              </div>

              {/* Tags Section */}
              <div className="mb-6">
                 <div className="flex flex-wrap items-center gap-2">
                     {(complaint.tags || []).map(tag => (
                         <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 flex items-center">
                             #{tag}
                             {(currentUser?.id === complaint.authorId || currentUser?.role === UserRole.ADMIN) && (
                                 <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500">×</button>
                             )}
                         </span>
                     ))}
                     
                     {(currentUser?.id === complaint.authorId || currentUser?.role === UserRole.ADMIN) && (
                         <div className="flex items-center">
                             <input 
                               type="text" 
                               value={tagInput}
                               onChange={(e) => setTagInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                               placeholder="+ Tag"
                               className="px-3 py-1 text-xs border border-slate-300 rounded-l-full w-20 focus:w-32 transition-all outline-none focus:border-indigo-500"
                             />
                             <button 
                               onClick={handleAddTag} 
                               className="px-2 py-1 bg-slate-100 border-y border-r border-slate-300 rounded-r-full text-xs hover:bg-slate-200"
                             >
                                 +
                             </button>
                         </div>
                     )}
                 </div>
              </div>

              {complaint.sentiment && (
                  <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-100 flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${complaint.sentiment.label === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          <Icons.Activity className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                              AI Analysis: {complaint.sentiment.label}
                          </h4>
                          <p className="text-sm text-slate-600 italic leading-relaxed">
                              "{complaint.sentiment.summary}"
                          </p>
                      </div>
                  </div>
              )}
            </div>
          </div>
          
           {/* Related Complaints Section */}
           {relatedComplaints.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Related Complaints</h3>
                 <div className="grid gap-4">
                    {relatedComplaints.map(related => (
                        <div key={related.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">{related.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{related.description}</p>
                            <div className="mt-2 text-xs font-medium text-indigo-600">{related.companyName}</div>
                        </div>
                    ))}
                 </div>
              </div>
           )}

          {/* Discussion Section */}
          <div className="bg-transparent space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                   Discussion
                   <span className="ml-3 bg-white text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                      {complaint.comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}
                   </span>
                </h3>
             </div>
            
            <div className="space-y-6">
              {complaint.comments.map(comment => (
                  <CommentNode 
                    key={comment.id} 
                    comment={comment} 
                    complaintId={complaint.id}
                    topContributorId={topContributorId}
                    onReply={(c) => {
                        setReplyingTo(c);
                        setTimeout(() => textareaRef.current?.focus(), 100);
                    }}
                    blockedUsers={blockedUsers}
                    onToggleBlock={handleToggleBlock}
                  />
              ))}
              
              {complaint.comments.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-slate-900 font-medium mb-1">No comments yet</h4>
                    <p className="text-slate-500 text-sm">Be the first to join the discussion.</p>
                </div>
              )}
            </div>

            {/* Rich Text Comment Composer */}
            <div className="p-1 bg-transparent sticky bottom-6 z-30">
               {replyingTo && (
                   <div className="mb-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-between shadow-lg">
                       <span className="font-medium">Replying to {replyingTo.userName}...</span>
                       <button onClick={() => setReplyingTo(null)} className="hover:text-indigo-200"><Icons.LogOut className="w-4 h-4" /></button>
                   </div>
               )}

               {isBusinessOwner && !newComment && !replyingTo && (
                   <button 
                      onClick={handleAiDraft}
                      disabled={isDrafting}
                      className="mb-6 group flex items-center gap-3 w-full p-4 bg-white border border-indigo-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left"
                   >
                       <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           <Icons.Activity className={`w-5 h-5 ${isDrafting ? 'animate-spin' : ''}`} />
                       </div>
                       <div>
                           <div className="font-semibold text-slate-900 text-sm">
                               {isDrafting ? 'Generating...' : 'Generate Professional Response'}
                           </div>
                           <div className="text-xs text-slate-500">
                               Use AI to draft a polite and effective reply based on the complaint context.
                           </div>
                       </div>
                   </button>
               )}
              
              <div className={`rounded-xl shadow-lg bg-white ring-1 transition-all duration-300 ${
                  isNearLimit 
                      ? 'ring-2 ring-red-500' 
                      : 'ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-500'
              }`}>
                 {/* Formatting Toolbar */}
                 <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/30 rounded-t-xl overflow-x-auto">
                    <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Bold">
                        <Icons.Bold className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Italic">
                        <Icons.Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button type="button" onClick={handleInsertLink} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Link">
                        <Icons.Link className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('- ', '')} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Bulleted List">
                        <Icons.List className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Insert Image">
                        <Icons.Image className="w-4 h-4" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                    />
                 </div>

                 <textarea 
                   ref={textareaRef}
                   value={newComment}
                   onChange={handleCommentChange}
                   placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Write a thoughtful comment..."}
                   className="block w-full border-0 bg-transparent py-4 pl-4 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 min-h-[120px] resize-y"
                 />
                 
                 {/* Image Preview Area */}
                 {attachedImage && (
                     <div className="px-4 pb-4">
                         <div className="relative inline-block">
                             <img src={attachedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm" />
                             <button 
                                onClick={() => setAttachedImage(null)}
                                className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-sm"
                             >
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                         </div>
                     </div>
                 )}

                 <div className={`flex items-center justify-between py-2 pl-3 pr-2 border-t rounded-b-xl ${
                      isNearLimit ? 'bg-red-50 border-red-100' : 'bg-slate-50/50 border-slate-100'
                  }`}>
                      <div className="flex items-center gap-4">
                          <div className={`text-xs font-medium transition-colors flex items-center gap-2 ${
                            isNearLimit ? 'text-red-600' : 'text-slate-400'
                          }`}>
                            {isNearLimit && <Icons.AlertTriangle className="w-3.5 h-3.5" />}
                            {charsRemaining} characters left
                          </div>
                      </div>

                      <div className="flex items-center gap-2 relative">
                        {/* Additional Action Buttons */}
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Attach File">
                            <Icons.Paperclip className="w-4 h-4" />
                        </button>
                        
                        <div className="relative">
                            <button 
                                type="button" 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors" 
                                title="Insert Emoji"
                            >
                                <Icons.Smile className="w-4 h-4" />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-lg shadow-xl border border-slate-200 grid grid-cols-5 gap-2 z-20 w-64 animate-fade-in-up">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="p-2 hover:bg-slate-100 rounded text-xl flex items-center justify-center transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button 
                          onClick={handlePostComment}
                          disabled={(!newComment.trim() && !attachedImage) || isPosting}
                          className="ml-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {isPosting ? <Icons.Activity className="w-4 h-4 animate-spin" /> : <Icons.MessageSquare className="w-4 h-4" />}
                          {replyingTo ? 'Reply' : 'Post'}
                        </button>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Details</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     complaint.status === ComplaintStatus.OPEN ? 'bg-yellow-100 text-yellow-800' :
                     complaint.status === ComplaintStatus.RESOLVED ? 'bg-green-100 text-green-800' :
                     'bg-blue-100 text-blue-800'
                 }`}>
                     {complaint.status}
                 </span>
             </div>
             
             <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                   <div className="mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm text-slate-600">
                        <Icons.Briefcase className="w-5 h-5" />
                   </div>
                   <div>
                       <span className="text-xs font-semibold text-slate-500 uppercase">Company</span>
                       <div className="font-bold text-slate-900 text-lg">{complaint.companyName}</div>
                   </div>
               </div>
               
               <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                   <div className="mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm text-slate-600">
                        <Icons.Shield className="w-5 h-5" />
                   </div>
                   <div>
                       <span className="text-xs font-semibold text-slate-500 uppercase">Industry</span>
                       <div className="font-medium text-slate-900">{complaint.category}</div>
                   </div>
               </div>

               {/* History Section */}
               {(complaint.history || []).length > 0 && (
                   <div className="p-4 bg-slate-50 rounded-xl">
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                           <Icons.Activity className="w-3 h-3 mr-1" /> History
                       </h4>
                       <div className="space-y-3 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                           {complaint.history.map((h, idx) => (
                               <div key={idx} className="relative pl-5">
                                   <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-white border-2 border-slate-300 rounded-full"></div>
                                   <div className="text-xs font-semibold text-slate-800">{h.status.replace('_', ' ')}</div>
                                   <div className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleString()}</div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
             </div>

             {/* Business Actions */}
             {isBusinessOwner && (
               <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Manage Ticket</h3>
                  <div className="space-y-3">
                     {complaint.status !== ComplaintStatus.RESOLVED && (
                        <button 
                           onClick={() => updateStatus(complaint.id, ComplaintStatus.RESOLVED)}
                           className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-md shadow-green-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Icons.CheckCircle className="w-4 h-4" />
                            Mark as Resolved
                        </button>
                     )}
                     {complaint.status === ComplaintStatus.OPEN && (
                        <button 
                           onClick={() => updateStatus(complaint.id, ComplaintStatus.IN_PROGRESS)}
                           className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Icons.Activity className="w-4 h-4" />
                            Mark In Progress
                        </button>
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};