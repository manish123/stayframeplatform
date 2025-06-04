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
  User as UserIcon
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
  <RadixSelect
    value={value}
    onValueChange={onValueChange as (value: string) => void}
    {...props}
  >
    {children}
  </RadixSelect>
);

// Create a type-safe wrapper for SelectItem
type SelectItemProps = React.ComponentProps<typeof RadixSelectItem> & {
  className?: string;
  value: string;
};

const SelectItem = ({
  className = '',
  children,
  value,
  ...props
}: SelectItemProps) => (
  <div className={className}>
    <RadixSelectItem value={value} {...props}>
      {children}
    </RadixSelectItem>
  </div>
);

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Format date with fallback
const formatDateRelative = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

// Define the FeedbackStatus enum if not already defined
const FeedbackStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  PARKED: 'parked',
  CLOSED: 'closed'
} as const;

type FeedbackStatus = typeof FeedbackStatus[keyof typeof FeedbackStatus];

// Helper function to check if a string is a valid FeedbackStatus
const isFeedbackStatus = (status: string): status is FeedbackStatus => {
  return Object.values(FeedbackStatus).includes(status as any);
};

type FeedbackPriority = 'low' | 'medium' | 'high';
type FeedbackType = 'bug' | 'feature' | 'general';

// Define the base item type
type BaseSelectItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
};

// Helper function to create select items with proper typing
function createSelectItems<T extends string>(
  items: Record<T, Omit<BaseSelectItem, 'value'>>,
  allLabel: string
): BaseSelectItem[] {
  // Create the 'all' item
  const allItem: BaseSelectItem = { 
    value: 'all',
    label: allLabel
  };

  // Create the item entries with proper typing
  const itemEntries = Object.entries<Omit<BaseSelectItem, 'value'>>(items).map(([value, item]) => ({
    ...item,
    value
  }));
  
  return [allItem, ...itemEntries];
}

type Feedback = {
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
};

const statusIcons = {
  open: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  in_progress: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  resolved: <CheckCircle className="h-4 w-4 text-green-500" />,
  parked: <PauseCircle className="h-4 w-4 text-purple-500" />,
  closed: <XCircle className="h-4 w-4 text-gray-500" />,
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const typeIcons = {
  bug: <Bug className="h-4 w-4" />,
  feature: <Zap className="h-4 w-4" />,
  general: <MessageSquare className="h-4 w-4" />,
};

export default function FeedbackDashboard() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
    },
  });

  console.log('Auth status:', sessionStatus);
  console.log('Session data:', session);
  
  if (sessionStatus === 'loading') {
    console.log('Auth is still loading...');
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    console.log('fetchFeedbacks called with sessionStatus:', sessionStatus);
    
    if (sessionStatus !== 'authenticated') {
      console.log('Not authenticated, skipping fetch');
      return;
    }
    
    console.log('Starting to fetch feedbacks...');
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearchQuery) queryParams.append('search', debouncedSearchQuery);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'all') queryParams.append('priority', priorityFilter);
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);
      
      const apiUrl = `/api/feedback?${queryParams.toString()}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          // If unauthorized, redirect to sign-in
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch feedbacks');
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
      const feedbacksData = Array.isArray(data) ? data : [];
      
      // Debug: Log each feedback item's ID and type
      feedbacksData.forEach((fb, index) => {
        console.log(`Feedback ${index}:`, {
          id: fb.id,
          idType: typeof fb.id,
          hasSlice: typeof fb.id === 'string' ? 'Yes' : 'No',
          fullFeedback: fb
        });
      });
      
      console.log('Setting feedbacks:', feedbacksData.length, 'items');
      
      // Ensure all feedback items have string IDs
      const validatedFeedbacks = feedbacksData.map(fb => ({
        ...fb,
        id: String(fb.id || '').trim() || `feedback-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      setFeedbacks(validatedFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3).join('\n')
        });
      }
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
    // Skip if status is empty
    if (!status) return;
    
    // Ensure the status is a valid FeedbackStatus
    if (!isFeedbackStatus(status)) {
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
          // If unauthorized, redirect to sign-in
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      // Refresh the feedback list
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
    // Skip if priority is empty (happens with 'All Priorities')
    if (!priorityValue) return;
    
    // Ensure the priority is a valid FeedbackPriority
    if (!['low', 'medium', 'high'].includes(priorityValue)) {
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
          // If unauthorized, redirect to sign-in
          router.push('/login?callbackUrl=' + encodeURIComponent('/feedback'));
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update priority');
      }
      
      // Refresh the feedback list
      await fetchFeedbacks();
      toast.success('Priority updated successfully');
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update priority');
    } finally {
      setUpdatingId('');
    }
  };

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
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search feedback..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="parked">Parked</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>


                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <div className="p-8 text-center rounded-lg border-2 border-dashed border-gray-200">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No feedback found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'Be the first to submit feedback!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feedbacks.map((feedback) => (
                    <div 
                      key={feedback.id}
                      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-2 pr-4">
                            {feedback.title}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            #{feedback.id.slice(-4)}
                          </span>
                        </div>

                        {feedback.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {feedback.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              feedback.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                              feedback.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              feedback.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusIcons[feedback.status as keyof typeof statusIcons]}
                            <span className="ml-1">
                              {feedback.status.replace('_', ' ')}
                            </span>
                          </span>
                          
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              feedback.priority === 'high' ? 'bg-red-100 text-red-800' :
                              feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {feedback.priority}
                          </span>
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {feedback.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <div className="flex items-center">
                            {feedback.user?.image ? (
                              <img 
                                src={feedback.user.image} 
                                alt={feedback.user?.name || 'User'} 
                                className="h-5 w-5 rounded-full mr-2"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                                <UserIcon className="h-3 w-3 text-gray-500" />
                              </div>
                            )}
                            <span>{feedback.user?.name || 'Anonymous'}</span>
                          </div>
                          <span>{formatDateRelative(feedback.createdAt)}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/feedback/${feedback.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={`View feedback: ${feedback.title}`}
                      />
                      
                      <div className="bg-gray-50 px-4 py-2 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="relative z-20 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            router.push(`/feedback/${feedback.id}`);
                          }}
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
