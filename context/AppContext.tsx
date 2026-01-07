
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint, User, UserRole, ComplaintStatus, Comment, UserSettings, SentimentData } from '../types';
import { analyzeSentiment } from '../services/geminiService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userId: string, data: Partial<User>) => Promise<void>;
  complaints: Complaint[];
  addComplaint: (title: string, description: string, category: string, company: string, privateDetails?: Record<string, string>) => Promise<void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  deleteComplaint: (id: string) => void;
  addComment: (complaintId: string, content: string, attachmentUrl?: string, parentId?: string, sentiment?: SentimentData) => void;
  updateStatus: (complaintId: string, status: ComplaintStatus) => void;
  toggleUpvote: (complaintId: string) => void;
  toggleDownvote: (complaintId: string) => void;
  submitFeedback: (complaintId: string, rating: number, feedback: string) => void;
  toggleCommentUpvote: (complaintId: string, commentId: string) => void;
  reportComment: (complaintId: string, commentId: string) => void;
  isLoading: boolean;
  view: 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE';
  setView: (view: 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  publicProfile: true,
};

const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    password: 'password123',
    role: UserRole.CUSTOMER, 
    avatar: 'https://picsum.photos/seed/alice/100/100',
    bio: 'Avid online shopper and tech enthusiast.',
    settings: DEFAULT_SETTINGS
  },
  { 
    id: 'b1', 
    name: 'TechCorp Support', 
    email: 'support@techcorp.com', 
    password: 'password123',
    role: UserRole.BUSINESS, 
    avatar: 'https://picsum.photos/seed/techcorp/100/100', 
    companyName: 'TechCorp',
    bio: 'Official support channel for TechCorp Inc.',
    settings: DEFAULT_SETTINGS
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    title: 'Internet speed is consistently slow',
    description: 'I have been paying for 1GB speed but only getting 50mbps for the last week. Support keeps hanging up on me.',
    category: 'Telecommunications',
    companyName: 'TechCorp',
    status: ComplaintStatus.OPEN,
    authorId: 'u1',
    authorName: 'Alice Johnson',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotedBy: ['u2', 'u3', 'u4', 'u5', 'u6'],
    downvotedBy: [],
    comments: [],
    sentiment: { score: -0.8, label: 'Negative', summary: 'Customer receiving 5% of paid speed, support unresponsive.', language: 'English' },
    tags: ['internet', 'speed', 'support'],
    history: [{ status: ComplaintStatus.OPEN, timestamp: new Date(Date.now() - 86400000).toISOString() }],
    views: 124
  }
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE'>('LANDING');

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    setIsLoading(false);
    if (user) {
      setCurrentUser(user);
      setView('DASHBOARD');
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      companyName: data.companyName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`,
      settings: DEFAULT_SETTINGS
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setView('DASHBOARD');
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setView('LANDING');
  };

  const updateProfile = async (userId: string, data: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...data };
        if (currentUser?.id === userId) setCurrentUser(updated);
        return updated;
      }
      return u;
    }));
    setIsLoading(false);
  };

  const addComplaint = async (title: string, description: string, category: string, company: string, privateDetails?: Record<string, string>) => {
    if (!currentUser) return;
    setIsLoading(true);
    const sentiment = await analyzeSentiment(description);
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      id: `c${Date.now()}`,
      title,
      description,
      category,
      companyName: company,
      status: ComplaintStatus.OPEN,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: now,
      upvotedBy: [],
      downvotedBy: [],
      comments: [],
      sentiment,
      language: sentiment.language,
      tags: [],
      history: [{ status: ComplaintStatus.OPEN, timestamp: now }],
      views: 0,
      privateDetails
    };
    setComplaints(prev => [newComplaint, ...prev]);
    setIsLoading(false);
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const addComment = (complaintId: string, content: string, attachmentUrl?: string, parentId?: string, sentiment?: SentimentData) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `m${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      isOfficialResponse: currentUser.role === UserRole.BUSINESS,
      attachmentUrl,
      replies: [],
      upvotes: [],
      sentiment,
      language: sentiment?.language,
    };

    const addReplyToComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === parentId) return { ...c, replies: [...c.replies, newComment] };
        if (c.replies.length > 0) return { ...c, replies: addReplyToComments(c.replies) };
        return c;
      });
    };

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        if (parentId) return { ...c, comments: addReplyToComments(c.comments) };
        return { ...c, comments: [...c.comments, newComment] };
      }
      return c;
    }));
  };

  const reportComment = (complaintId: string, commentId: string) => {
    if (!currentUser) return;
    const markReported = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          const reports = c.reportedBy || [];
          if (!reports.includes(currentUser.id)) {
            return { ...c, reportedBy: [...reports, currentUser.id] };
          }
          return c;
        }
        if (c.replies.length > 0) return { ...c, replies: markReported(c.replies) };
        return c;
      });
    };

    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { ...c, comments: markReported(c.comments) } : c
    ));
  };

  const toggleCommentUpvote = (complaintId: string, commentId: string) => {
    if (!currentUser) return;
    const updateCommentVotes = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
            if (c.id === commentId) {
                const hasUpvoted = c.upvotes.includes(currentUser.id);
                return {
                    ...c,
                    upvotes: hasUpvoted ? c.upvotes.filter(id => id !== currentUser.id) : [...c.upvotes, currentUser.id]
                };
            }
            if (c.replies.length > 0) return { ...c, replies: updateCommentVotes(c.replies) };
            return c;
        });
    };
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, comments: updateCommentVotes(c.comments) } : c));
  };

  const updateStatus = (complaintId: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId && c.status !== status) {
        const newHistory = [...(c.history || []), { status, timestamp: new Date().toISOString() }];
        return { ...c, status, history: newHistory };
      }
      return c;
    }));
  };

  const toggleUpvote = (complaintId: string) => {
    if (!currentUser) return;
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const isUpvoted = c.upvotedBy.includes(currentUser.id);
        let newUp = isUpvoted ? c.upvotedBy.filter(id => id !== currentUser.id) : [...c.upvotedBy, currentUser.id];
        let newDown = c.downvotedBy.filter(id => id !== currentUser.id);
        return { ...c, upvotedBy: newUp, downvotedBy: newDown };
      }
      return c;
    }));
  };

  const toggleDownvote = (complaintId: string) => {
    if (!currentUser) return;
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const isDown = c.downvotedBy.includes(currentUser.id);
        let newDown = isDown ? c.downvotedBy.filter(id => id !== currentUser.id) : [...c.downvotedBy, currentUser.id];
        let newUp = c.upvotedBy.filter(id => id !== currentUser.id);
        return { ...c, upvotedBy: newUp, downvotedBy: newDown };
      }
      return c;
    }));
  };

  const submitFeedback = (complaintId: string, rating: number, feedback: string) => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, rating, feedback } : c));
  };

  return (
    <AppContext.Provider value={{ currentUser, users, login, register, logout, updateProfile, complaints, addComplaint, updateComplaint, deleteComplaint, addComment, updateStatus, toggleUpvote, toggleDownvote, submitFeedback, toggleCommentUpvote, reportComment, isLoading, view, setView }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
