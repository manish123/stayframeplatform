// src/components/layout/ResponsiveSidebar.tsx

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Assuming you have this Button component
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // Shadcn Sheet component
import { X } from 'lucide-react'; // For the close icon
import { cn } from '@/lib/utils'; // For utility classes

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onMobileClose: () => void; // This is the prop to call when closing
  position: 'left' | 'right';
  title: string;
  children: React.ReactNode;
  className?: string;
  mobileWidth?: string;
  desktopWidth?: string;
  // Touch event props
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export function ResponsiveSidebar({
  isOpen,
  onMobileClose,
  position,
  title,
  children,
  className,
  mobileWidth = 'w-64',
  desktopWidth = 'w-80',
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: ResponsiveSidebarProps) {
  // Use a media query for desktop vs mobile (or similar logic as in QuoteGeneratorNewV2)
  // For simplicity, let's assume `isOpen` handles desktop visibility correctly now.
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 1024; // Example, match your breakpoint

  // If it's a desktop view, just render the div directly
  if (!isMobileView) {
    return (
      <div
        className={cn(
          'hidden lg:flex flex-col border-border bg-background transition-all duration-300 ease-in-out',
          desktopWidth,
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          {/* No close button on desktop sidebar unless explicitly needed */}
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // For mobile view, use the Shadcn Sheet component
  return (
    <Sheet open={isOpen} onOpenChange={onMobileClose}> {/* CRITICAL: onOpenChange calls onMobileClose */}
      <SheetContent
        side={position}
        className={cn(
          'flex flex-col',
          mobileWidth,
          className
        )}
        onPointerDownOutside={(e) => {
          // This prevents closing the sheet when interacting with certain elements inside it
          // You might need to refine this based on specific UI elements in your inspector
          if (e.target instanceof HTMLElement && e.target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault(); // Prevent closing when interacting with popovers/tooltips etc.
          }
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <SheetHeader className="pb-4"> {/* Added padding bottom */}
          <SheetTitle>{title}</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose} // CRITICAL: This is the close button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}