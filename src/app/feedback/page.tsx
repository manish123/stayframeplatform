"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { 
  Bug, 
  Zap, 
  MessageSquare, 
  Loader2, 
  Search, 
  Filter, 
  X, 
  Check, 
  Clock, 
  AlertCircle,
  CheckCircle,
  PauseCircle,
  XCircle,
  ChevronLeft,
  User as UserIcon,
  ArrowDown,
  ArrowUp,
  Equal
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { 
  Select as RadixSelect,
  SelectContent, 
  SelectItem as RadixSelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/Select";
import { FeedbackHeader } from "@/components/FeedbackHeader";

// Create a type-safe wrapper for Select
type SelectProps<T extends string> = Omit<React.ComponentProps<typeof RadixSelect>, 'onValueChange' | 'value'> & {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
};

const Select = <T extends string>({
  value,
  onValueChange,
  children,
  ...props
}: SelectProps<T>) => (
  <RadixSelect value={value} onValueChange={onValueChange} {...props}>
    {children}
  </RadixSelect>
);

// Create a type-safe wrapper for SelectItem
type SelectItemProps = {
  className?: string;
  value: string;
  children: React.ReactNode;
};

const SelectItem = ({
  className = '',
  children,
  value,
  ...props
}: SelectItemProps) => (
  <RadixSelectItem className={className} value={value} {...props}>
    {children}
  </RadixSelectItem>
);

// Format date with fallback
const formatDateRelative = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Define the FeedbackStatus enum
const FeedbackStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

type FeedbackStatus = typeof FeedbackStatus[keyof typeof FeedbackStatus];

// Helper function to check if a string is a valid FeedbackStatus
const isFeedbackStatus = (status: string): status is FeedbackStatus => {
  return Object.values(FeedbackStatus).includes(status as FeedbackStatus);
};

type FeedbackPriority = 'low' | 'medium' | 'high';
type FeedbackType = 'bug' | 'feature' | 'suggestion' | 'other';

// Define the base item type
interface BaseSelectItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

// Helper function to create select items with proper typing
const createSelectItems = <T extends string>(
  items: Record<T, Omit<BaseSelectItem, 'value'>>,
  allLabel: string
): BaseSelectItem[] => {
  const result: BaseSelectItem[] = [
    {
      value: 'all',
      label: allLabel,
    },
  ];

  for (const [value, item] of Object.entries(items)) {
    result.push({
      value,
      ...(item as Omit<BaseSelectItem, 'value'>)
    });
  }


  return result;
};

interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  description?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const statusIcons = {
  [FeedbackStatus.OPEN]: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  [FeedbackStatus.IN_PROGRESS]: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  [FeedbackStatus.RESOLVED]: <CheckCircle className="h-4 w-4 text-green-500" />,
  [FeedbackStatus.CLOSED]: <XCircle className="h-4 w-4 text-gray-500" />,
};

const priorityIcons = {
  low: <ArrowDown className="h-4 w-4 text-green-500" />,
  medium: <Equal className="h-4 w-4 text-yellow-500" />,
  high: <ArrowUp className="h-4 w-4 text-red-500" />,
};

const typeIcons = {
  bug: <Bug className="h-4 w-4 text-red-500" />,
  feature: <Zap className="h-4 w-4 text-blue-500" />,
  suggestion: <MessageSquare className="h-4 w-4 text-purple-500" />,
  other: <MessageSquare className="h-4 w-4 text-gray-500" />,
};

export default function FeedbackDashboard() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
    },
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchFeedbacks = useCallback(async () => {
    if (sessionStatus !== 'authenticated') return;
    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearchQuery) queryParams.append('search', debouncedSearchQuery);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'all') queryParams.append('priority', priorityFilter);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      
      const response = await fetch(`/api/feedback?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch feedbacks');
      }
      
      const data = await response.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [sessionStatus, debouncedSearchQuery, statusFilter, priorityFilter, typeFilter, router]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const searchLower = debouncedSearchQuery.toLowerCase();
    const matchesSearch = 
      feedback.title.toLowerCase().includes(searchLower) ||
      (feedback.description?.toLowerCase()?.includes(searchLower) ?? false);
    
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || feedback.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!status || !isFeedbackStatus(status)) {
      console.error('Invalid status:', status);
      toast.error('Invalid status value');
      return;
    }
    
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      await fetchFeedbacks();
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePriorityUpdate = async (feedbackId: string, priorityValue: string) => {
    if (!priorityValue || !['low', 'medium', 'high'].includes(priorityValue)) {
      console.error('Invalid priority:', priorityValue);
      toast.error('Invalid priority value');
      return;
    }
    
    setUpdatingId(feedbackId);
    
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ priority: priorityValue }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update priority');
      }
      
      await fetchFeedbacks();
      toast.success('Priority updated successfully');
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update priority');
    } finally {
      setUpdatingId('');
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedbackHeader user={session?.user || null} />
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex flex-col space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search feedback..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value: string) => setStatusFilter(value as FeedbackStatus | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Status: </span>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={FeedbackStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={FeedbackStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={FeedbackStatus.RESOLVED}>Resolved</SelectItem>
                      <SelectItem value={FeedbackStatus.CLOSED}>Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={(value: string) => setPriorityFilter(value as FeedbackPriority | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Priority: </span>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={typeFilter}
                    onValueChange={(value: string) => setTypeFilter(value as FeedbackType | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Type: </span>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                  <div className="p-8 text-center rounded-lg border-2 border-dashed border-gray-200">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No feedback found</h3>
                    <p className="text-gray-500">
                      {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                        ? 'Try adjusting your filters or search query.'
                        : 'No feedback has been submitted yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFeedbacks.map((feedback) => (
                      <div 
                        key={feedback.id}
                        className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        <Link 
                          href={`/feedback/${feedback.id}`} 
                          className="block p-4 pb-2 hover:bg-gray-50"
                        >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {typeIcons[feedback.type] || typeIcons.other}
                              <h3 className="font-medium text-gray-900 line-clamp-1">
                                {feedback.title}
                              </h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  feedback.priority === 'high' ? 'border-red-200 text-red-800 bg-red-50' :
                                  feedback.priority === 'medium' ? 'border-yellow-200 text-yellow-800 bg-yellow-50' :
                                  'border-green-200 text-green-800 bg-green-50'
                                }`}
                              >
                                {feedback.priority}
                              </Badge>
                              <div className="flex items-center">
                                {statusIcons[feedback.status]}
                                <span className="ml-1 text-xs text-gray-500 capitalize">
                                  {feedback.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {feedback.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {feedback.description}
                            </p>
                          )}
                          
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              {feedback.user?.image ? (
                                <img
                                  src={feedback.user.image}
                                  alt={feedback.user.name || 'User'}
                                  className="h-5 w-5 rounded-full mr-2"
                                />
                              ) : (
                                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                              )}
                              <span>{feedback.user?.name || 'Anonymous'}</span>
                            </div>
                            <span>{formatDateRelative(feedback.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex justify-between items-center">
                          <Select
                            value={feedback.status}
                            onValueChange={(value) => handleStatusUpdate(feedback.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs px-2 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={FeedbackStatus.OPEN}>Open</SelectItem>
                              <SelectItem value={FeedbackStatus.IN_PROGRESS}>In Progress</SelectItem>
                              <SelectItem value={FeedbackStatus.RESOLVED}>Resolved</SelectItem>
                              <SelectItem value={FeedbackStatus.CLOSED}>Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={feedback.priority}
                            onValueChange={(value) => handlePriorityUpdate(feedback.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs px-2 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </Link>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
