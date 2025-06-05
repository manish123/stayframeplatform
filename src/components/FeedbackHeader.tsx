'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface FeedbackHeaderProps {
  user: User | null;
}

export function FeedbackHeader({ user }: FeedbackHeaderProps) {
  const pathname = usePathname();
  const isFeedbackDetail = pathname.startsWith('/feedback/') && pathname !== '/feedback';

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link 
            href="/feedback" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="inline-block font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Stayframe Feedback
            </span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/feedback"
              className={`transition-colors hover:text-primary ${pathname === '/feedback' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isFeedbackDetail && (
            <Link 
              href="/feedback" 
              className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              Back to feedback
            </Link>
          )}
          {user && (
            <div className="flex items-center">
              <UserMenu user={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
