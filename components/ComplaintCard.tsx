import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { Icons } from './Icons';
import { translateText } from '../services/geminiService';
import { useApp } from '../context/AppContext';

interface Props {
  complaint: Complaint;
  onClick: () => void;
  onRate?: (complaint: Complaint) => void;
  onEdit?: (complaint: Complaint) => void;
  onDelete?: (complaint: Complaint) => void;
}

const statusColors = {
  [ComplaintStatus.OPEN]: 'bg-yellow-100 text-yellow-800',
  [ComplaintStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ComplaintStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [ComplaintStatus.ESCALATED]: 'bg-red-100 text-red-800',
};

export const ComplaintCard: React.FC<Props> = ({ complaint, onClick, onRate, onEdit, onDelete }) => {
  const { currentUser, toggleUpvote, toggleDownvote } = useApp();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (translatedText) {
      setTranslatedText(null);
      return;
    }
    setIsTranslating(true);
    const result = await translateText(complaint.description, "Spanish"); // Default to Spanish for demo
    setTranslatedText(result);
    setIsTranslating(false);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(complaint.id);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDownvote(complaint.id);
  };

  const handleRateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRate) onRate(complaint);
  };

  const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(false);
      if (onEdit) onEdit(complaint);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(false);
      if (onDelete) onDelete(complaint);
  };

  const toggleMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
  };

  const sentiment = complaint.sentiment;
  const isUpvoted = currentUser ? complaint.upvotedBy.includes(currentUser.id) : false;
  const isDownvoted = currentUser ? complaint.downvotedBy.includes(currentUser.id) : false;
  const isMyComplaint = currentUser?.id === complaint.authorId;
  const canRate = isMyComplaint && complaint.status === ComplaintStatus.RESOLVED && !complaint.rating;
  const canEdit = isMyComplaint && complaint.status === ComplaintStatus.OPEN;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group hover:-translate-y-1 relative"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
              {complaint.status}
            </span>
            <span className="ml-2 text-xs text-slate-500">{complaint.category} • {complaint.companyName}</span>
          </div>
          
          <div className="flex items-center gap-2">
              {sentiment && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-bold ${
                  sentiment.label === 'Urgent' || sentiment.label === 'Negative' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  <Icons.Activity className="w-3 h-3" />
                  <span>AI {sentiment.label} ({Math.round(sentiment.score * 100)}%)</span>
                </div>
              )}

              {/* Author Actions Menu */}
              {canEdit && (
                  <div className="relative">
                      <button 
                        onClick={toggleMenu}
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                      </button>
                      {showMenu && (
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
                              <button onClick={handleEditClick} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                              <button onClick={handleDeleteClick} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                      )}
                  </div>
              )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{complaint.title}</h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {translatedText || complaint.description}
        </p>
        
        {sentiment && (
            <p className="text-xs text-slate-400 italic mb-4 border-l-2 border-indigo-200 pl-2">
                AI Summary: {sentiment.summary}
            </p>
        )}

        {/* Rating Display */}
        {complaint.rating && (
          <div className="mb-4 flex items-center bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
             <div className="flex mr-2">
               {[...Array(5)].map((_, i) => (
                 <Icons.Star key={i} className={`w-3.5 h-3.5 ${i < complaint.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
               ))}
             </div>
             <span className="text-xs text-yellow-700 font-medium">Customer Feedback</span>
          </div>
        )}

        {/* Action Button for Feedback */}
        {canRate && (
           <button 
             onClick={handleRateClick}
             className="w-full mb-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center transition-colors"
           >
              <Icons.Star className="w-4 h-4 mr-2" />
              Rate Experience
           </button>
        )}

        <div className="flex items-center justify-between text-slate-500 text-sm pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
              <button 
                onClick={handleUpvote}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-bold transition-all duration-200 transform active:scale-95 ${
                  isUpvoted 
                    ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Upvote"
              >
                <Icons.ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                <span>{complaint.upvotedBy.length}</span>
              </button>
              <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
              <button 
                onClick={handleDownvote}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-bold transition-all duration-200 transform active:scale-95 ${
                  isDownvoted 
                    ? 'bg-red-100 text-red-700 ring-1 ring-red-200' 
                    : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
                }`}
                title="Downvote"
              >
                <Icons.ThumbsDown className={`w-3.5 h-3.5 ${isDownvoted ? 'fill-current' : ''}`} />
                <span>{complaint.downvotedBy.length}</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
              <Icons.MessageSquare className="w-3.5 h-3.5" />
              <span>{complaint.comments.length}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <button 
                onClick={handleTranslate}
                className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded transition-colors"
             >
                 <Icons.Globe className="w-3 h-3" />
                 <span>{isTranslating ? '...' : translatedText ? 'Original' : 'Translate'}</span>
             </button>
             <span className="text-xs text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};