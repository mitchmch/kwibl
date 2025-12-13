export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED'
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  publicProfile: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyName?: string; // Only for Business users
  password?: string; // Mock password for simulation
  bio?: string;
  settings: UserSettings;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isOfficialResponse: boolean;
  attachmentUrl?: string;
  replies: Comment[]; // Nested replies
  sentiment?: SentimentData; // AI Analysis of the comment
  upvotes: string[]; // For determining helpfulness
  language?: string; // Detected language
  translatedContent?: string; // Cached translation
  reportedBy?: string[]; // IDs of users who reported this
}

export interface SentimentData {
  score: number; // -1 to 1
  label: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
  summary: string;
  language?: string; // Detected language
}

export interface ComplaintHistory {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  companyName: string; // The company being complained about
  status: ComplaintStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  upvotedBy: string[]; // Track user IDs who upvoted
  downvotedBy: string[]; // Track user IDs who downvoted
  comments: Comment[];
  sentiment?: SentimentData; // AI Enriched
  language?: string;
  translatedDescription?: string; // AI Translated
  rating?: number; // 1-5 stars from customer
  feedback?: string; // Customer feedback text
  tags: string[];
  history: ComplaintHistory[];
}

export interface AnalyticsMetrics {
  totalComplaints: number;
  resolvedRate: number;
  avgResolutionTimeHours: number;
  customerSatisfactionScore: number;
}