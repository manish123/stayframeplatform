// src/components/layout/MobileDrawer.tsx
'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  position = 'left',
  title,
  children,
  className,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: MobileDrawerProps) {
  console.log(`Rendering MobileDrawer: ${position}, isOpen: ${isOpen}`); // Debug

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Drawer */}
      <div
        className={cn(
          'fixed top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-xl z-[50] transition-transform duration-300 ease-in-out transform',
          position === 'left' ? 'left-0' : 'right-0',
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full',
          'w-72 max-w-[85vw] overflow-y-auto',
          'bg-red-500', // Temporary to make it obvious
          className
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}