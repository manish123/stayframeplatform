'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { QuoteSearch } from './QuoteSearch';
import { FlattenedQuote } from '@/types/quotes';
import { cn } from '@/lib/utils';

interface QuoteSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (quote: FlattenedQuote) => void;
  theme?: string;
}

export function QuoteSelectionModal({
  isOpen,
  onClose,
  onSelect,
  theme = '',
}: QuoteSelectionModalProps) {
  const handleQuoteSelect = (quote: FlattenedQuote) => {
    onSelect(quote);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Select a Quote</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <DialogPrimitive.Close>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4">
          <QuoteSearch
            theme={theme}
            onQuoteSelect={handleQuoteSelect}
            className="p-1"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
