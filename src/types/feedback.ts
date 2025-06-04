// Feedback types that match our Prisma schema
export type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved' | 'Parked' | 'Closed';
export type FeedbackType = 'bug' | 'feature' | 'general';
export type FeedbackPriority = 'low' | 'medium' | 'high';
export type ProgressLogType = 'Update' | 'Comment' | 'Decision';

// Interface for Feedback model
export interface Feedback {
  id: number;
  type: FeedbackType;
  title: string;
  description: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  screenshot?: string | null;
  metadata?: Record<string, any> | null;
  userId?: string | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  progressLogs?: ProgressLog[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for ProgressLog model
export interface ProgressLog {
  id: number;
  feedbackId: number;
  noteType: ProgressLogType;
  comment: string;
  createdBy?: string | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  createdAt: Date;
}

// Form data for submitting feedback
export interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  priority: FeedbackPriority;
  screenshot?: string | null;
  consent: boolean;
  metadata?: Record<string, any>;
}

// Form data for adding a progress log
export interface ProgressLogFormData {
  noteType: ProgressLogType;
  comment: string;
}

// Filter options for feedback list
export interface FeedbackFilters {
  status?: FeedbackStatus | 'all';
  type?: FeedbackType | 'all';
  priority?: FeedbackPriority | 'all';
  search?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
