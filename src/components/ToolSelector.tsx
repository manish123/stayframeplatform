'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Image, Film, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const tools = [
  {
    name: 'QuoteForge',
    href: '/quote',
    icon: <MessageSquare className="h-10 w-10 mb-3 text-primary" />,
    description: 'Craft beautiful, shareable quotes',
    color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30',
  },
  {
    name: 'MemeStorm',
    href: '/meme',
    icon: <Image className="h-10 w-10 mb-3 text-purple-500" />,
    description: 'Create viral memes in seconds',
    color: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30',
  },
  {
    name: 'ReelRush',
    href: '/reel',
    icon: <Film className="h-10 w-10 mb-3 text-pink-500" />,
    description: 'Make engaging video content',
    color: 'bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-800/30',
  },
];

interface ToolSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolSelector({ open, onOpenChange }: ToolSelectorProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto sm:rounded-lg">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <DialogHeader className="text-left pb-6">
          <DialogTitle className="text-2xl font-bold sm:text-3xl">
            Create Something Amazing
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2 sm:text-base">
            Choose a tool to get started
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="outline"
              className={`flex flex-col items-center justify-start h-auto min-h-[180px] p-6 text-center transition-all duration-200 ${tool.color}`}
              onClick={() => {
                router.push(tool.href);
                onOpenChange(false);
              }}
            >
              <div className="mb-4">
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{tool.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
