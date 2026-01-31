
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

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
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
  taskKey: string; // Jira-style key (e.g., KB-123)
  title: string;
  description: string;
  category: string;
  companyName: string; // The company being complained about
  status: ComplaintStatus;
  priority: Priority;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  assigneeId?: string;
  assigneeName?: string;
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
  views: number; // For admin analytics
  privateDetails?: Record<string, string>; // Sensitive data only for Admin/Business
  attachment?: string; // Base64 encoded image string
  impactScore?: number; // AI calculated priority score
}

export interface AnalyticsMetrics {
  totalComplaints: number;
  resolvedRate: number;
  avgResolutionTimeHours: number;
  customerSatisfactionScore: number;
}

export type AdminViewType = 
  | 'OVERVIEW' 
  | 'MODERATION' 
  | 'CONTENT_REPORTS' 
  | 'POLICY_ANALYSIS' 
  | 'ALL_COMPLAINTS' 
  | 'USERS' 
  | 'INDUSTRIES' 
  | 'BUSINESSES' 
  | 'NEWS'
  | 'ANALYTICS'
  | 'SENTIMENT_INTEL'
  | 'ESCALATIONS'
  | 'COMPLIANCE'
  | 'SUBSCRIPTIONS'
  | 'SETTINGS_GENERAL'
  | 'SETTINGS_BRANDING'
  | 'SETTINGS_TECH_STACK'
  | 'COMPLAINT_DETAIL'
  | 'PRODUCT_DISCOVERY';

export type BusinessViewType = 
  | 'BOARD'
  | 'BACKLOG'
  | 'REPORTS'
  | 'COMPONENTS'
  | 'SETTINGS';
