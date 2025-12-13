import React, { useState } from 'react';
import { Icons } from './Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  complaintTitle: string;
}

export const CustomerFeedbackModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, complaintTitle }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, feedback);
    onClose();
    // Reset state
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <Icons.LogOut className="w-5 h-5" /> 
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Rate Your Experience</h3>
        <p className="text-slate-500 text-sm mb-6">How was the resolution for: <strong>{complaintTitle}</strong>?</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Icons.Star 
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-slate-300'
                  }`} 
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Feedback (Optional)</label>
            <textarea 
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              rows={3}
              placeholder="Tell us more about your experience..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button 
              type="submit" 
              disabled={rating === 0}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                rating === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};