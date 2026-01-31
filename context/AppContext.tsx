
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Complaint, User, UserRole, ComplaintStatus, Comment, UserSettings, SentimentData, Priority } from '../types';
import { analyzeSentiment } from '../services/geminiService';

export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'PROFILE' | 'MESSAGES' | 'FORUMS' | 'FRIENDS' | 'MANAGER';

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
  addComplaint: (title: string, description: string, category: string, company: string, privateDetails?: Record<string, string>, attachment?: string) => Promise<void>;
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
  view: AppView;
  setView: (view: AppView) => void;
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
    id: 'admin_sys', 
    name: 'Platform Admin', 
    email: 'admin@kwibl.com', 
    password: 'password123',
    role: UserRole.ADMIN, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    bio: 'System Administrator.',
    settings: DEFAULT_SETTINGS
  },
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
    name: 'Support Agent', 
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
    taskKey: 'KB-1',
    title: 'Internet speed is consistently slow',
    description: 'I have been paying for 1GB speed but only getting 50mbps for the last week. Support keeps hanging up on me.',
    category: 'Telecommunications',
    companyName: 'TechCorp',
    status: ComplaintStatus.OPEN,
    priority: Priority.HIGH,
    authorId: 'u1',
    authorName: 'Alice Johnson',
    authorAvatar: 'https://picsum.photos/seed/alice/100/100',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotedBy: ['u2', 'u3', 'u4', 'u5', 'u6'],
    downvotedBy: [],
    comments: [],
    sentiment: { score: -0.8, label: 'Negative', summary: 'Customer receiving 5% of paid speed, support unresponsive.', language: 'English' },
    tags: ['internet', 'speed', 'support'],
    history: [{ status: ComplaintStatus.OPEN, timestamp: new Date(Date.now() - 86400000).toISOString() }],
    views: 124,
    impactScore: 85
  },
  {
    id: 'c2',
    taskKey: 'KB-2',
    title: 'Unexpected billing charge on renewal',
    description: 'My subscription was renewed at double the price without any prior notification. I want a refund.',
    category: 'Finance',
    companyName: 'TechCorp',
    status: ComplaintStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assigneeId: 'b1',
    assigneeName: 'Support Agent',
    authorId: 'u2',
    authorName: 'Bob Smith',
    authorAvatar: 'https://picsum.photos/seed/bob/100/100',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    upvotedBy: ['u1'],
    downvotedBy: [],
    comments: [],
    sentiment: { score: -0.4, label: 'Neutral', summary: 'Billing dispute regarding renewal notification.', language: 'English' },
    tags: ['billing', 'refund', 'subscription'],
    history: [
      { status: ComplaintStatus.OPEN, timestamp: new Date(Date.now() - 43200000).toISOString() },
      { status: ComplaintStatus.IN_PROGRESS, timestamp: new Date(Date.now() - 3600000).toISOString() }
    ],
    views: 56,
    impactScore: 50
  }
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('kwibl_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('kwibl_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kwibl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<AppView>(() => {
    const savedUser = localStorage.getItem('kwibl_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      if (user.role === UserRole.BUSINESS) return 'MANAGER';
      return 'DASHBOARD';
    }
    return 'LANDING';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('kwibl_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('kwibl_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kwibl_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kwibl_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    setIsLoading(false);
    if (user) {
      setCurrentUser(user);
      if (user.role === UserRole.BUSINESS) {
        setView('MANAGER');
      } else {
        setView('DASHBOARD');
      }
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        setIsLoading(false);
        throw new Error('User already exists');
    }

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
    if (newUser.role === UserRole.BUSINESS) {
      setView('MANAGER');
    } else {
      setView('DASHBOARD');
    }
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

  const addComplaint = async (title: string, description: string, category: string, company: string, privateDetails?: Record<string, string>, attachment?: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    const sentiment = await analyzeSentiment(description);
    const now = new Date().toISOString();
    const taskNumber = complaints.length + 1;
    const newComplaint: Complaint = {
      id: `c${Date.now()}`,
      taskKey: `KB-${taskNumber}`,
      title,
      description,
      category,
      companyName: company,
      status: ComplaintStatus.OPEN,
      priority: Priority.MEDIUM,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: now,
      upvotedBy: [],
      downvotedBy: [],
      comments: [],
      sentiment,
      language: sentiment.language,
      tags: [],
      history: [{ status: ComplaintStatus.OPEN, timestamp: now }],
      views: 0,
      privateDetails,
      attachment,
      impactScore: Math.floor(Math.random() * 100)
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

  const updateStatus = (complaintId: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId && c.status !== status) {
        const newHistory = [...(c.history || []), { status, timestamp: new Date().toISOString() }];
        return { 
          ...c, 
          status, 
          history: newHistory,
          // If moving to in progress, assign to current business user if applicable
          assigneeId: (status === ComplaintStatus.IN_PROGRESS && currentUser?.role === UserRole.BUSINESS) ? currentUser.id : c.assigneeId,
          assigneeName: (status === ComplaintStatus.IN_PROGRESS && currentUser?.role === UserRole.BUSINESS) ? currentUser.name : c.assigneeName,
        };
      }
      return c;
    }));
  };

  // Remaining methods (toggleUpvote, etc.) same as original
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
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, comments: markReported(c.comments) } : c));
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
