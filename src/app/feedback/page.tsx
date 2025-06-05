"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
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
  ON_HOLD: 'on_hold',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

type FeedbackStatus = typeof FeedbackStatus[keyof typeof FeedbackStatus];

// Helper function to check if a string is a valid FeedbackStatus
const isFeedbackStatus = (status: string): status is FeedbackStatus => {
  return Object.values(FeedbackStatus).includes(status as FeedbackStatus);
};

// Define the FeedbackPriority enum
const FeedbackPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

type FeedbackPriority = typeof FeedbackPriority[keyof typeof FeedbackPriority];

// Define the FeedbackType enum
const FeedbackType = {
  BUG: 'bug',
  FEATURE: 'feature',
  SUGGESTION: 'suggestion',
  OTHER: 'other',
} as const;

type FeedbackType = typeof FeedbackType[keyof typeof FeedbackType];

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
  [FeedbackStatus.OPEN]: <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />,
  [FeedbackStatus.IN_PROGRESS]: <Loader2 className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400" />,
  [FeedbackStatus.ON_HOLD]: <PauseCircle className="h-4 w-4 text-orange-500 dark:text-orange-400" />,
  [FeedbackStatus.RESOLVED]: <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />,
  [FeedbackStatus.CLOSED]: <XCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
};

const priorityIcons = {
  high: <ArrowUp className="h-4 w-4 text-red-500 dark:text-red-400" />,
  medium: <Equal className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />,
  low: <ArrowDown className="h-4 w-4 text-green-500 dark:text-green-400" />
};

const typeIcons = {
  bug: <Bug className="h-4 w-4 text-red-500 dark:text-red-400" />,
  feature: <Zap className="h-4 w-4 text-blue-500 dark:text-blue-400" />,
  suggestion: <MessageSquare className="h-4 w-4 text-purple-500 dark:text-purple-400" />,
  other: <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FeedbackHeader user={session?.user || null} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
              <p className="text-muted-foreground">
                View and manage user feedback
              </p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search feedback..."
                    className={cn(
                      'pl-10 w-full',
                      'bg-white dark:bg-gray-800',
                      'border border-gray-200 dark:border-gray-700',
                      'text-gray-900 dark:text-white',
                      'placeholder-gray-400 dark:placeholder-gray-500',
                      'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      'transition-colors duration-200',
                      'hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value: string) => setStatusFilter(value as FeedbackStatus | 'all')}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Filter className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Status: </span>
                      <SelectValue placeholder="All Statuses" className="text-left" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={FeedbackStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={FeedbackStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={FeedbackStatus.ON_HOLD}>On Hold</SelectItem>
                      <SelectItem value={FeedbackStatus.RESOLVED}>Resolved</SelectItem>
                      <SelectItem value={FeedbackStatus.CLOSED}>Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={(value: string) => setPriorityFilter(value as FeedbackPriority | 'all')}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Filter className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Priority: </span>
                      <SelectValue placeholder="All Priorities" className="text-left" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value={FeedbackPriority.HIGH}>High</SelectItem>
                      <SelectItem value={FeedbackPriority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={FeedbackPriority.LOW}>Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={typeFilter}
                    onValueChange={(value: string) => setTypeFilter(value as FeedbackType | 'all')}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Filter className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Type: </span>
                      <SelectValue placeholder="All Types" className="text-left" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={FeedbackType.BUG}>Bug</SelectItem>
                      <SelectItem value={FeedbackType.FEATURE}>Feature</SelectItem>
                      <SelectItem value={FeedbackType.SUGGESTION}>Suggestion</SelectItem>
                      <SelectItem value={FeedbackType.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-card rounded-lg border overflow-hidden mt-6">
              <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                  <div className="p-8 text-center rounded-lg border-2 border-dashed border-muted">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No feedback found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                        ? 'Try adjusting your filters or search query.'
                        : 'No feedback has been submitted yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredFeedbacks.map((feedback) => (
                      <div 
                        key={feedback.id}
                        className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 hover:border-primary/20"
                      >
                        <Link 
                          href={`/feedback/${feedback.id}`}
                          className="block h-full p-4"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                {typeIcons[feedback.type] || typeIcons.other}
                                <h3 className="font-medium text-foreground line-clamp-1">
                                  {feedback.title}
                                </h3>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    feedback.priority === 'high' ? 'border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/30' :
                                    feedback.priority === 'medium' ? 'border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30' :
                                    'border-green-200 dark:border-green-900 text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-900/30'
                                  }`}
                                >
                                  {feedback.priority}
                                </Badge>
                                <div className="flex items-center">
                                  {statusIcons[feedback.status]}
                                  <span className="ml-1 text-xs text-muted-foreground capitalize">
                                    {feedback.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {feedback.description && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {feedback.description}
                              </p>
                            )}
                            
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center">
                                {feedback.user?.image ? (
                                  <img
                                    src={feedback.user.image}
                                    alt={feedback.user.name || 'User'}
                                    className="h-5 w-5 rounded-full mr-2"
                                  />
                                ) : (
                                  <UserIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                )}
                                <span className="text-foreground">{feedback.user?.name || 'Anonymous'}</span>
                              </div>
                              <span>{formatDateRelative(feedback.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 bg-gray-50 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
                            <Select
                              value={feedback.status}
                              onValueChange={(value) => handleStatusUpdate(feedback.id, value)}
                            >
                              <SelectTrigger className="h-8 text-xs px-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <SelectValue className="text-xs" />
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
                              <SelectTrigger className="h-8 text-xs px-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <SelectValue className="text-xs" />
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
