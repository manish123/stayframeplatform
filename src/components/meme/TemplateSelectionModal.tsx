'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseTemplate } from '@/types/templates';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: BaseTemplate) => void;
  templates: BaseTemplate[];
}

export function TemplateSelectionModal({
  isOpen,
  onClose,
  onSelect,
  templates,
}: TemplateSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Choose a Meme Template</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Select a template to get started with your meme
              </DialogDescription>
            </div>
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
        <div className="flex-1 overflow-auto p-6">
          {templates.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No meme templates available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="group rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-200 text-left"
                >
                  <div className="aspect-video bg-muted relative">
                    {template.previewImageUrl ? (
                      <img
                        src={template.previewImageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x250/F7FAFC/1A202C?text=Preview+Not+Available';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No preview</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                        Select Template
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground">{template.name}</h3>
                    {template.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 3).map((tag: string) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
