import React from 'react';
import { BaseTemplate } from '@/types/templates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { LayoutTemplate, X } from 'lucide-react';

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
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center">
                <LayoutTemplate className="h-5 w-5 mr-2" />
                Choose a Video Meme Template
              </DialogTitle>
              <DialogDescription className="mt-1 text-muted-foreground">
                Select a template to start creating your video meme
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No video meme templates available.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later or create your own custom template.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="group rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-200 text-left bg-background"
                  aria-label={`Select ${template.name} template`}
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
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No preview</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                        Select Template
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground truncate">{template.name}</h3>
                    {template.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-border px-6 py-4 bg-muted/30 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
