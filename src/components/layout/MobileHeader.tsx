// src/components/layout/MobileHeader.tsx
'use client';

import { Menu, X, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MobileHeaderProps {
  onLeftMenuClick: () => void;
  onRightMenuClick: () => void;
  leftMenuOpen: boolean;
  rightMenuOpen: boolean;
  title: string;
}

export function MobileHeader({
  onLeftMenuClick,
  onRightMenuClick,
  leftMenuOpen,
  rightMenuOpen,
  title,
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLeftMenuClick}
          aria-label={leftMenuOpen ? 'Close Tools & Templates' : 'Open Tools & Templates'}
          className={leftMenuOpen ? 'text-blue-500' : ''}
        >
          {leftMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h1>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onRightMenuClick}
          aria-label={rightMenuOpen ? 'Close Element Inspector' : 'Open Element Inspector'}
          className={rightMenuOpen ? 'text-blue-500' : ''}
        >
          {rightMenuOpen ? <X className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}