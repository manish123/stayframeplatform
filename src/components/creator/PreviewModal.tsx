// PreviewModal.tsx
'use client';

// src/components/creator/PreviewModal.tsx
import { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Loader2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useTemplateStore } from '@/store/templateStore';
import CanvasDisplay from './CanvasDisplay';

type PreviewType = 'image' | 'video';

import { BaseTemplate } from '@/types/templates';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: PreviewType;
  template?: BaseTemplate;
  editorCanvasWidth?: number;
  editorCanvasHeight?: number;
}

export const PreviewModal = ({
  isOpen,
  onClose,
  type = 'image' as const,
  template: templateProp,
  editorCanvasWidth,
  editorCanvasHeight
}: PreviewModalProps) => {
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasDisplayRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [isExporting, setIsExporting] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const { selectedTemplate: storeSelectedTemplate } = useTemplateStore();
  
  // Use the template from props if provided, otherwise fall back to the store
  const template = templateProp || storeSelectedTemplate;

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Generate a unique key for the canvas to force remount when template changes
  const canvasKey = `canvas-${template?.id || 'default'}-${containerReady ? 'ready' : 'loading'}`;

  // Reset container ready state when modal opens/closes or template changes
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, initializing canvas...');
      setContainerReady(false);
      // Give the canvas time to render
      const timer = setTimeout(() => {
        console.log('Setting container ready');
        setContainerReady(true);
        
        // Log canvas state after a short delay
        setTimeout(async () => {
          try {
            const canvas = await getCanvas();
            console.log('Canvas state after initialization:', {
              canvasExists: !!canvas,
              dimensions: canvas ? `${canvas.width}x${canvas.height}` : 'N/A'
            });
          } catch (error) {
            console.error('Error getting canvas for logging:', error);
          }
        }, 100);
        
      }, 200);
      return () => clearTimeout(timer);
    } else {
      console.log('Modal closed, resetting canvas state');
      setContainerReady(false);
    }
  }, [isOpen, template?.id]);
  
  // Log canvas state for debugging
  useEffect(() => {
    if (containerReady) {
      console.log('Canvas container is ready');
      const logCanvasDimensions = async () => {
        try {
          const canvas = await getCanvas();
          if (canvas) {
            console.log('Canvas element dimensions:', `${canvas.width}x${canvas.height}`);
          } else {
            console.log('Canvas element not available');
          }
        } catch (error) {
          console.error('Error getting canvas:', error);
        }
      };
      logCanvasDimensions();
    }
  }, [containerReady]);

  // Show loading state only when needed
  if (!isMounted || !isOpen) {
    return null;
  }

  if (!template) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex items-center justify-center h-40">
          <div className="text-center">
            <p className="text-muted-foreground">No template selected</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    try {
      if (!template) {
        console.error('No template selected');
        return null;
      }

      // Use the canvas renderer service
      const { createCanvasFromTemplate } = await import('@/lib/services/canvasRenderer');
      
      const canvas = await createCanvasFromTemplate(template, {
        width: template.canvasDimensions?.width || 1920,
        height: template.canvasDimensions?.height || 1080,
        scale: 1, // Always export at full resolution
        backgroundColor: template.canvasBackgroundColor || '#ffffff',
        format: 'png',
        quality: 0.95, // Slightly reduce quality for smaller file size
        // Add new optimization options for file size control
        maxDimension: 2048, // Limit max dimension for reasonable file sizes
        pixelRatio: 1, // Use standard pixel ratio for exports
        compression: true // Enable compression optimizations
      });

      console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);
      return canvas;
    } catch (error) {
      console.error('Error creating canvas:', error);
      return null;
    }
  };

  const handleExport = async (exportFormat: 'png' | 'jpeg' | 'webp' | 'mp4' = 'png') => {
    console.log('Export requested, format:', exportFormat);
    
    if (exportFormat === 'mp4' || type === 'video') {
      toast({
        title: 'Video export disabled',
        description: 'Video export functionality is currently disabled. Please export as an image instead.',
        variant: 'default',
      });
      return;
    }
    
    if (isExporting) {
      console.warn('Export already in progress');
      toast({
        title: 'Warning',
        description: 'Export already in progress',
        variant: 'default',
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Get the canvas element from the canvas display component
      const canvas = await getCanvas();
      if (!canvas) {
        console.error('Canvas not found for export');
        toast({
          title: 'Error',
          description: 'Canvas not ready for export. Please wait a moment and try again.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Canvas created for export with dimensions:', canvas.width, 'x', canvas.height);
      
      // Force a reflow to ensure canvas is rendered
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      console.log('Exporting canvas with dimensions:', canvas.width, 'x', canvas.height);
      
      // Only handle image exports
      let quality = 0.95;
      let mimeType = `image/${exportFormat}`;
      
      // Adjust quality based on format for optimal file size
      if (exportFormat === 'jpeg') {
        quality = 0.9; // JPEG can be more compressed
        mimeType = 'image/jpeg';
      } else if (exportFormat === 'webp') {
        quality = 0.85; // WebP offers better compression
      }
      
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `export-${Date.now()}.${exportFormat}`;
      a.click();
      
      toast({
        title: 'Export successful',
        description: `Your ${exportFormat.toUpperCase()} has been downloaded`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred during export',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    console.log('Copy to clipboard requested');
    
    if (isExporting) {
      console.warn('Export already in progress');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const canvas = await getCanvas();
      if (!canvas) {
        toast({
          title: 'Error',
          description: 'Failed to generate image.',
          variant: 'destructive',
        });
        return;
      }
      
      // Convert canvas to blob with optimized quality
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 0.95);
      });
      
      if (!blob) throw new Error('Failed to create image blob');
      
      // Try modern Clipboard API first
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } catch (error) {
        console.warn('Modern Clipboard API failed, falling back to execCommand');
        // Fallback for browsers that don't support ClipboardItem
        const item = new ClipboardItem({ 'image/png': blob });
        const items = [item];
        const clipboard = (navigator as any).clipboard;
        
        if (clipboard && typeof clipboard.write === 'function') {
          await clipboard.write(items);
        } else {
          throw new Error('Clipboard API not supported');
        }
      }
      
      toast({
        title: 'Success!',
        description: 'Image copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard. Please try again or use the download option.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const zoomIn = () => setScale((prev: number) => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setScale((prev: number) => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(0.8);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Preview
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Zoom Controls */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetZoom}
                className="h-8 px-3"
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 1.5}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              {!containerReady ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div 
                  ref={previewAreaRef}
                  className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                  }}
                >
                  <div className="w-full h-full">
                    <div ref={canvasDisplayRef} className="w-full h-full">
                      <CanvasDisplay
                        key={canvasKey}
                        template={template}
                        sourceWidth={1920}
                        sourceHeight={1080}
                        uiScale={scale}
                        className="w-full h-full canvas-display-area"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {type === 'image' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                disabled={isExporting}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExport(type === 'video' ? 'mp4' : 'png')}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;