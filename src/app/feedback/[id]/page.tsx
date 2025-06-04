"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Loader2, 
  MessageSquare, 
  Bug, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  PauseCircle, 
  XCircle,
  Clock,
  User as UserIcon,
  Mail,
  Calendar,
  AlertTriangle,
  Check as CheckIcon,
  X as XIcon,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";

import { toast } from "sonner";
import Image from "next/image";
import { FeedbackHeader } from "@/components/FeedbackHeader";

// Extend the NextAuth session user type to include the role property
declare module "next-auth" {
  interface User {
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

type FeedbackStatus = 'Open' | 'In Progress' | 'Resolved' | 'Parked' | 'Closed';
type FeedbackPriority = 'low' | 'medium' | 'high';
type FeedbackType = 'bug' | 'feature' | 'general';
type NoteType = 'Update' | 'Comment' | 'Decision';

interface FeedbackUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProgressLog {
  id: number;
  noteType: NoteType;
  comment: string;
  createdAt: string;
  user?: FeedbackUser;
}

interface FeedbackMetadata {
  browser?: string;
  os?: string;
  url?: string;
  timestamp?: string;
}

interface Feedback {
  id: number;
  type: FeedbackType;
  title: string;
  description: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  screenshot: string | null;
  metadata: FeedbackMetadata;
  createdAt: string;
  updatedAt: string;
  user?: FeedbackUser;
  progressLogs: ProgressLog[];
}

const statusIcons: Record<FeedbackStatus, React.ReactNode> = {
  'Open': <AlertCircle className="h-4 w-4 text-yellow-500" />,
  'In Progress': <Loader2 className="h-4 w-4 text-blue-500" />,
  'Resolved': <CheckCircle className="h-4 w-4 text-green-500" />,
  'Parked': <PauseCircle className="h-4 w-4 text-purple-500" />,
  'Closed': <XCircle className="h-4 w-4 text-gray-500" />,
};

const statusOptions: { value: FeedbackStatus; label: string }[] = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Parked', label: 'Parked' },
  { value: 'Closed', label: 'Closed' },
];

const priorityColors: Record<FeedbackPriority, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
} as const;

const typeIcons: Record<FeedbackType, React.ReactNode> = {
  bug: <Bug className="h-4 w-4" />,
  feature: <Zap className="h-4 w-4" />,
  general: <MessageSquare className="h-4 w-4" />,
} as const;

export default function FeedbackDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  
  const { data: session, status: sessionStatus } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to sign-in page if not authenticated
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
    },
  });
  
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>('Open');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('Comment');
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add cache-busting to prevent stale data
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/api/feedback/${id}?_=${cacheBuster}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch feedback');
      }
      
      const data = await response.json();
      if (data) {
        setFeedback(data);
        setStatus(data.status);
        setPriority(data.priority);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Use a ref to prevent multiple simultaneous fetches
  const isFetching = React.useRef(false);
  
  useEffect(() => {
    if (sessionStatus === 'authenticated' && !isFetching.current) {
      isFetching.current = true;
      fetchFeedback().finally(() => {
        isFetching.current = false;
      });
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      isFetching.current = false;
    };
  }, [sessionStatus, fetchFeedback]);

  const handleStatusChange = async (newStatus: FeedbackStatus) => {
    if (!id) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status');
      }

      const { data: updatedFeedback } = await response.json() as { data: Feedback };
      setFeedback(updatedFeedback);
      setStatus(updatedFeedback.status);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: {
            content: note,
            type: noteType,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add note');
      }

      const { data: updatedFeedback } = await response.json() as { data: Feedback };
      setFeedback(updatedFeedback);
      setNote('');
      toast.success('Note added successfully');
      
      // Refresh the feedback to get the latest notes
      await fetchFeedback();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  if (sessionStatus === 'loading' || !feedback) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedbackHeader user={session?.user || null} />
      <main className="container mx-auto p-2 sm:p-4 pt-4 sm:pt-6">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/feedback')}
            className="mb-4 sm:mb-6 text-sm sm:text-base"
            size="sm"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to feedback</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          {feedback ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Feedback card */}
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-semibold">{feedback.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {typeIcons[feedback.type]}
                            <span className="ml-1.5">{feedback.type}</span>
                          </Badge>
                          <Badge variant="outline" className={priorityColors[feedback.priority]}>
                            {feedback.priority} Priority
                          </Badge>
                        </div>
                      </div>

                      {session?.user?.role === 'admin' && (
                        <div className="w-full sm:w-auto">
                          <Select
                            value={status}
                            onValueChange={handleStatusChange}
                            disabled={saving}
                          >
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <div className="flex items-center">
                                {saving ? (
                                  <>
                                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                    <span className="text-xs sm:text-sm">Updating...</span>
                                  </>
                                ) : (
                                  <>
                                    {statusIcons[status]}
                                    <span className="ml-2">{status}</span>
                                  </>
                                )}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center">
                                    {statusIcons[option.value]}
                                    <span className="ml-2">{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <h2 className="text-lg font-medium mb-3">Description</h2>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="whitespace-pre-line">{feedback.description}</p>
                      </div>
                    </div>

                    {/* Screenshot */}
                    {feedback.screenshot && (
                      <div className="mt-6">
                        <h2 className="text-lg font-medium mb-3">Screenshot</h2>
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src={feedback.screenshot}
                            alt="Screenshot"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            priority
                          />
                        </div>
                      </div>
                    )}

                    {/* Activity */}
                    <div className="mt-8 pt-6 border-t">
                      <h2 className="text-lg font-medium mb-4">Activity</h2>
                      
                      {feedback.progressLogs.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          No activity yet
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {feedback.progressLogs.map((log) => (
                            <div key={log.id} className="relative pb-6 last:pb-0">
                              <div className="relative flex items-start">
                                <div className="absolute left-0 top-0 h-full w-6 flex justify-center">
                                  <div className="h-full w-0.5 bg-border" />
                                </div>
                                <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-background">
                                  {log.user?.image ? (
                                    <img
                                      src={log.user.image}
                                      alt={log.user.name || 'User'}
                                      className="h-6 w-6 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                      <UserIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                      {log.user?.name || 'Anonymous User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-sm text-muted-foreground">{log.comment}</p>
                                  </div>
                                  <div className="mt-2">
                                    <Badge
                                      variant={log.noteType === 'Decision' ? 'default' : 'outline'}
                                      className={cn(
                                        'text-xs',
                                        log.noteType === 'Decision' ? 'bg-blue-100 text-blue-800' : '',
                                        log.noteType === 'Update' ? 'bg-purple-100 text-purple-800' : ''
                                      )}
                                    >
                                      {log.noteType}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add Note Form */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-medium mb-4">Add a Note</h2>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div>
                      <label htmlFor="note" className="block text-sm font-medium mb-1">
                        Your Note
                      </label>
                      <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note about this feedback..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <Select
                        value={noteType}
                        onValueChange={(value) => setNoteType(value as NoteType)}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Note type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Comment">Comment</SelectItem>
                          <SelectItem value="Update">Update</SelectItem>
                          {session?.user?.role === 'admin' && (
                            <SelectItem value="Decision">Decision</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button type="submit" disabled={!note.trim() || saving} className="w-full sm:w-auto">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Note'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Details Card */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-lg font-medium mb-4">Details</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="mt-1 flex items-center">
                        {statusIcons[status]}
                        <span className="ml-2">{status}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                      <div className="mt-1">
                        <Badge variant="outline" className={priorityColors[feedback.priority]}>
                          {feedback.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submitted By</h3>
                      <div className="mt-1 flex items-center">
                        {feedback.user?.image ? (
                          <img
                            src={feedback.user.image}
                            alt={feedback.user.name || 'User'}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm">{feedback.user?.name || 'Anonymous'}</p>
                          {feedback.user?.email && (
                            <p className="text-xs text-muted-foreground">{feedback.user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submitted On</h3>
                      <p className="text-sm mt-1">
                        {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p className="text-sm mt-1">
                        {format(new Date(feedback.updatedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata Card */}
                {feedback.metadata && (
                  <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-medium mb-4">System Information</h2>
                    <div className="space-y-3">
                      {feedback.metadata.browser && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Browser</h3>
                          <p className="text-sm">{feedback.metadata.browser}</p>
                        </div>
                      )}
                      {feedback.metadata.os && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Operating System</h3>
                          <p className="text-sm">{feedback.metadata.os}</p>
                        </div>
                      )}
                      {feedback.metadata.url && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Page URL</h3>
                          <a
                            href={feedback.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {new URL(feedback.metadata.url).pathname}
                          </a>
                        </div>
                      )}
                      {feedback.metadata.timestamp && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Reported At</h3>
                          <p className="text-sm">
                            {format(new Date(feedback.metadata.timestamp), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Danger Zone - Admin Only */}
                {session?.user?.role === 'admin' && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
                    <h2 className="text-lg font-medium text-destructive mb-3">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action cannot be undone. This will permanently delete this feedback.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
                          try {
                            setSaving(true);
                            const response = await fetch(`/api/feedback/${id}`, {
                              method: 'DELETE',
                            });

                            if (response.ok) {
                              toast.success('Feedback deleted successfully');
                              router.push('/feedback');
                            } else {
                              const errorData = await response.json().catch(() => ({}));
                              throw new Error(errorData.message || 'Failed to delete feedback');
                            }
                          } catch (error) {
                            console.error('Error deleting feedback:', error);
                            toast.error(
                              error instanceof Error ? error.message : 'Failed to delete feedback'
                            );
                          } finally {
                            setSaving(false);
                          }
                        }
                      }}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Feedback
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Feedback not found</h3>
              <p className="text-muted-foreground mt-2">
                The feedback you're looking for doesn't exist or has been deleted.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => router.push('/feedback')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to feedback
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
