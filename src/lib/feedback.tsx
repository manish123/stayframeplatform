import { FeedbackStatus, FeedbackType, FeedbackPriority } from '@/types/feedback';
import React from 'react';

// Map status to display text and color
interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

export const statusConfig: Record<FeedbackStatus, StatusConfig> = {
  'In Progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    icon: (
      <svg
        className="h-4 w-4 animate-spin text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
  },
  Open: {
    label: 'Open',
    color: 'bg-yellow-100 text-yellow-800',
    icon: (
      <svg
        className="h-4 w-4 text-yellow-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  Resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800',
    icon: (
      <svg
        className="h-4 w-4 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  Parked: {
    label: 'Parked',
    color: 'bg-purple-100 text-purple-800',
    icon: (
      <svg
        className="h-4 w-4 text-purple-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  Closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800',
    icon: (
      <svg
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
};

// Map type to display text and icon
export const typeConfig: Record<FeedbackType, { label: string; icon: React.ReactNode }> = {
  bug: {
    label: 'Bug',
    icon: (
      <svg
        className="h-4 w-4 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  feature: {
    label: 'Feature',
    icon: (
      <svg
        className="h-4 w-4 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  general: {
    label: 'General',
    icon: (
      <svg
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
};

// Map priority to display text and color
export const priorityConfig: Record<FeedbackPriority, { label: string; color: string }> = {
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
  },
  high: {
    label: 'High',
    color: 'bg-red-100 text-red-800',
  },
};

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'Just now';
};

// Truncate text with ellipsis
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Format file size to human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Validate email address
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Get user initials
export const getUserInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  if (email) {
    return email[0].toUpperCase();
  }
  
  return 'U';
};

// Check if user has permission to perform an action
export const hasPermission = (
  userRole: string | undefined,
  requiredRole: string,
  isOwner: boolean = false
): boolean => {
  if (isOwner) return true;
  
  const roleHierarchy: Record<string, number> = {
    admin: 3,
    editor: 2,
    viewer: 1,
  };
  
  if (!userRole) return false;
  
  return (roleHierarchy[userRole.toLowerCase()] || 0) >= (roleHierarchy[requiredRole.toLowerCase()] || 0);
};

// Format feedback status for display
export const formatFeedbackStatus = (status: FeedbackStatus): string => {
  return statusConfig[status]?.label || status;
};

// Format feedback type for display
export const formatFeedbackType = (type: FeedbackType): string => {
  return typeConfig[type]?.label || type;
};

// Format feedback priority for display
export const formatFeedbackPriority = (priority: FeedbackPriority): string => {
  return priorityConfig[priority]?.label || priority;
};
