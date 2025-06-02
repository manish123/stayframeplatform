// QuoteGenerator.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ThemeSelector } from '@/components/quote/ThemeSelector';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTemplateStore } from '@/store/templateStore';
import { BaseTemplate, TextCanvasElement, AnyCanvasElement } from '@/types/templates';
import { getRandomMessage } from '@/lib/utils/funMessages';
import Alert from '@/components/feedback/Alert';
import { ResponsiveSidebar } from '@/components/layout/ResponsiveSidebar';
import { FlattenedQuote } from '@/types/quotes';
import mockTemplates from '@/data/mockTemplates';
import { LayoutTemplate, Image as ImageIcon, Check, Eye, Plus, ChevronRight, Menu, SlidersHorizontal } from 'lucide-react';
import { ImageSelectionModal } from '@/components/quote/ImageSelectionModal';
import { QuoteSelectionModal } from '@/components/quote/QuoteSelectionModal';
import { TemplateSelectionModal } from '@/components/quote/TemplateSelectionModal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Palette } from 'lucide-react';
import { useTrackTemplate } from '@/hooks/useTrackTemplate';

const CanvasDisplay = dynamic(() => import('@/components/creator/CanvasDisplay'), { ssr: false });
const ElementInspector = dynamic(() => import('@/components/creator/ElementInspector'), { ssr: false });
const PreviewModal = dynamic(() => import('@/components/creator/PreviewModal'), { ssr: false });

const DEFAULT_CANVAS_SIZE = 800;

const defaultQuoteTemplate: BaseTemplate = {
  id: 'default-quote-template',
  name: 'Default Quote Template',
  type: 'static',
  appType: 'quote',
  category: 'quote',
  aspectRatio: '1:1',
  canvasDimensions: { width: DEFAULT_CANVAS_SIZE, height: DEFAULT_CANVAS_SIZE },
  canvasBackgroundColor: '#FFFFFF',
  supportedFeatures: {
    supportsImages: true,
    supportsText: true,
    maxTextElements: 1,
  },
  elements: [
    {
      id: 'quote-text',
      name: 'Quote Text',
      type: 'text',
      x: 50,
      y: 50,
      width: 700,
      height: 700,
      content: 'Your quote will appear here',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 28,
      color: '#000000',
      textAlign: 'center',
      opacity: 1,
    },
  ],
  createdBy: 'system',
  version: 1,
};

const MIN_SWIPE_DISTANCE = 50;

export default function QuoteGenerator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [templatesToDisplay, setTemplatesToDisplay] = useState<BaseTemplate[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('inspiration');
  const [availableThemes, setAvailableThemes] = useState<string[]>(['inspiration', 'motivation', 'success', 'wisdom', 'funny']);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [alertState, setAlertState] = useState<{
    show: boolean;
    message: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    icon?: string;
    action?: string;
    onAction?: () => void;
  }>({
    show: false,
    message: '',
    variant: 'default',
  });

  const showAlert = (
    message: string,
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default',
    options: {
      icon?: string;
      action?: string;
      onAction?: () => void;
      duration?: number;
    } = {}
  ) => {
    setAlertState({
      show: true,
      message,
      variant,
      icon: options.icon,
      action: options.action,
      onAction: options.onAction,
    });

    const duration = options.duration || (variant === 'destructive' || variant === 'warning' ? 5000 : 3000);
    setTimeout(() => {
      setAlertState((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const showError = (message: string, options?: { action?: string; onAction?: () => void; duration?: number }) => {
    showAlert(message, 'destructive', {
      icon: 'alert-circle',
      ...options,
    });
  };

  const showSuccess = (message: string, options?: { action?: string; onAction?: () => void; duration?: number }) => {
    showAlert(message, 'success', {
      icon: 'check-circle',
      ...options,
    });
  };

  const showInfo = (message: string, options?: { action?: string; onAction?: () => void; duration?: number }) => {
    showAlert(message, 'info', options);
  };

  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(true);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { selectedTemplate, setSelectedTemplate, selectedElement, setSelectedElement, updateElementProperty } =
    useTemplateStore();
  const template = selectedTemplate || defaultQuoteTemplate;
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const quoteTemplates = mockTemplates.filter((template) => template.appType === 'quote');
    setTemplatesToDisplay(quoteTemplates);

    if (!selectedTemplate || !quoteTemplates.some((t) => t.id === selectedTemplate.id)) {
      setSelectedTemplate(quoteTemplates[0] || defaultQuoteTemplate);
      setIsTemplateModalOpen(true);
    }
  }, [selectedTemplate, setSelectedTemplate]);

  const { track, isTracking: isTrackingTemplate } = useTrackTemplate();

  useEffect(() => {
    // If no theme is selected, set the default theme
    if (!selectedTheme && availableThemes.length > 0) {
      const defaultTheme = availableThemes[0];
      setSelectedTheme(defaultTheme);
      // Track default theme selection
      track({
        type: 'quote',
        templateId: 'default-theme',
        templateName: 'Default Theme',
      }).catch(console.error);
    }
  }, [availableThemes, track]);

  const handleTemplateSelect = useCallback(
    (template: { id: string; name: string }) => {
      // Prepare the selected template first
      const selected = mockTemplates.find((t) => t.id === template.id) || {
        ...defaultQuoteTemplate,
        id: template.id,
        name: template.name,
      };
      
      // Update UI immediately for better UX
      setSelectedTemplate(selected);
      setIsTemplateModalOpen(false);
      setIsThemeModalOpen(true);
      setTouchEnd(null);
      setTouchStart(null);
      
      // Track the template selection (fire and forget)
      track('quote', template.id, template.name);
    },
    [setSelectedTemplate, track, defaultQuoteTemplate]
  );

  const handleThemeChange = useCallback(
    (theme: string) => {
      setSelectedTheme(theme);
      setSearchTerm(theme);
      setIsThemeModalOpen(false);
      setIsImageModalOpen(true);
    },
    [setSelectedTheme, setSearchTerm]
  );

  const handleImageSelect = useCallback(
    (imageUrl: string) => {
      if (!template) return;

      if (!template.supportedFeatures?.supportsImages) {
        const randomMessage = getRandomMessage('noImage');
        const message = typeof randomMessage === 'object' ? randomMessage.message : String(randomMessage);
        showInfo(message, {
          ...(randomMessage?.action && {
            action: String(randomMessage.action),
            onAction: randomMessage.actionVariant === 'outline' ? () => {} : undefined,
          }),
        });
        setIsImageModalOpen(false);
        setIsQuoteModalOpen(true);
        return;
      }

      const imageElement = template.elements.find((el) => el.type === 'image');
      if (imageElement) {
        updateElementProperty(imageElement.id, 'src', imageUrl);
        showSuccess('Image updated successfully!');
      } else {
        console.warn('No image element found in the template');
        showError("This template doesn't support images.");
      }
      setIsImageModalOpen(false);
      setIsQuoteModalOpen(true);
    },
    [template, updateElementProperty, showSuccess, showError]
  );

  const handleQuoteSelect = useCallback(
    (quote: FlattenedQuote) => {
      if (!template) {
        setIsQuoteModalOpen(false);
        return;
      }

      let targetTextElement = template.elements.find((el): el is TextCanvasElement => el.type === 'text' && el.id === 'quote-text');
      if (!targetTextElement) {
        targetTextElement = template.elements.find((el): el is TextCanvasElement => el.type === 'text');
      }

      if (targetTextElement) {
        updateElementProperty(targetTextElement.id, 'content', quote.quote);
        setIsQuoteModalOpen(false);
        setSelectedElement(targetTextElement);
      } else {
        setIsQuoteModalOpen(false);
      }
    },
    [template, updateElementProperty, setSelectedElement]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = (sidebarType: 'left' | 'right') => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (sidebarType === 'left' && isRightSwipe) {
      setIsMobileLeftOpen(false);
    } else if (sidebarType === 'right' && isLeftSwipe) {
      setIsMobileRightOpen(false);
    }
  };

  const toggleLeftMenu = useCallback(() => {
    setIsMobileLeftOpen((prev) => !prev);
  }, []);

  const toggleRightMenu = useCallback(() => {
    setIsMobileRightOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (selectedElement && !isDesktop) {
      setIsMobileRightOpen(true);
    } else if (!selectedElement && isMobileRightOpen && !isDesktop) {
      setIsMobileRightOpen(false);
    }
  }, [selectedElement, isDesktop, isMobileRightOpen]);

  // Add event listener for opening the image modal from ElementInspector
  useEffect(() => {
    const handleOpenImageModal = () => {
      setIsImageModalOpen(true);
    };

    window.addEventListener('openImageModal', handleOpenImageModal);
    return () => {
      window.removeEventListener('openImageModal', handleOpenImageModal);
    };
  }, []);

  const leftSidebarProps = useMemo(
    () => ({
      isOpen: isMobileLeftOpen,
      onMobileClose: () => setIsMobileLeftOpen(false),
      position: 'left' as const,
      title: 'Design Tools',
      className: 'lg:border-r border-border bg-background text-foreground',
      onTouchStart,
      onTouchMove,
      onTouchEnd: () => onTouchEnd('left'),
      mobileWidth: 'w-72 max-w-[85vw]',
      desktopWidth: 'w-75',
    }),
    [isMobileLeftOpen]
  );

  const rightSidebarProps = useMemo(
    () => ({
      isOpen: isMobileRightOpen || isDesktop,
      onMobileClose: () => {
        setIsMobileRightOpen(false);
        setSelectedElement(null);
      },
      position: 'right' as const,
      title: 'Element Inspector',
      className: 'lg:border-l border-border bg-background text-foreground',
      onTouchStart,
      onTouchMove,
      onTouchEnd: () => onTouchEnd('right'),
      mobileWidth: 'w-72 max-w-[85vw]',
      desktopWidth: 'w-75',
    }),
    [isMobileRightOpen, isDesktop, setSelectedElement]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {!isDesktop && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLeftMenu}
                aria-label="Open design tools"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">QuoteForge</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Your words, perfectly framed.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            {!isDesktop && selectedElement && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRightMenu}
                aria-label="Open element inspector"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row w-full container mx-auto px-4">
          {selectedTemplate ? (
            <>
              <ResponsiveSidebar {...leftSidebarProps}>
                <div className="w-full lg:w-64 xl:w-72 border-r border-border bg-background overflow-y-auto">
                  <div className="space-y-4 p-3 h-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center">
                          <LayoutTemplate className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Template</span>
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setIsTemplateModalOpen(true)}
                          title="Change Template"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-md border border-border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {selectedTemplate?.name || 'None selected'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {selectedTemplate?.features?.[0] || 'Select a template'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-border">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Design</h3>
                      <div className="space-y-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8 text-sm"
                          onClick={() => setIsThemeModalOpen(true)}
                        >
                          <Palette className="h-3.5 w-3.5" />
                          <span>Theme</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8 text-sm"
                          onClick={() => setIsImageModalOpen(true)}
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Background</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8 text-sm"
                          onClick={() => setIsQuoteModalOpen(true)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Quote</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ResponsiveSidebar>

              <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-background">
                {template ? (
                  <div ref={canvasContainerRef} className="relative w-full h-full max-w-4xl mx-auto flex items-center">
                    <CanvasDisplay
                      template={template}
                      sourceWidth={template.canvasDimensions?.width || DEFAULT_CANVAS_SIZE}
                      sourceHeight={template.canvasDimensions?.height || DEFAULT_CANVAS_SIZE}
                      uiScale={1}
                      selectedElementId={selectedElement?.id || null}
                      onSelectElement={setSelectedElement}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No template selected</p>
                )}
              </div>

              <ResponsiveSidebar {...rightSidebarProps}>
                <div className="w-full lg:w-64 xl:w-72 border-l border-border bg-background overflow-y-auto">
                  <div className="p-3 h-full">
                    {selectedElement ? (
                      <ElementInspector />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ResponsiveSidebar>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Start with a Template</h2>
                <p className="text-muted-foreground mb-8">Choose a template to get started with your design.</p>
                <Button size="lg" onClick={() => setIsTemplateModalOpen(true)} className="mx-auto">
                  Browse Templates
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Alert
        message={alertState.message}
        variant={alertState.variant}
        icon={alertState.icon}
        action={alertState.action}
        onAction={alertState.onAction}
        onClose={() => setAlertState((prev) => ({ ...prev, show: false }))}
        show={alertState.show}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
      />

      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          if (selectedTemplate) {
            setIsTemplateModalOpen(false);
          }
        }}
        onSelect={handleTemplateSelect}
        templates={templatesToDisplay.map((t) => ({
          id: t.id,
          name: t.name,
          previewImageUrl: (t as any).previewImageUrl || '',
          description: (t as any).description || '',
        }))}
      />

      <ThemeSelectionModal
        isOpen={isThemeModalOpen}
        onClose={() => {
          setIsThemeModalOpen(false);
          setIsImageModalOpen(true);
        }}
        onSelect={handleThemeChange}
        selectedTheme={selectedTheme}
      />

      {template && (
        <>
          <PreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            template={template}
            editorCanvasWidth={template.canvasDimensions?.width || DEFAULT_CANVAS_SIZE}
            editorCanvasHeight={template.canvasDimensions?.height || DEFAULT_CANVAS_SIZE}
          />
          <ImageSelectionModal
            isOpen={isImageModalOpen}
            onClose={() => {
              setIsImageModalOpen(false);
              setIsQuoteModalOpen(true);
            }}
            onSelect={handleImageSelect}
            searchTerm={searchTerm}
            supportsImages={template?.supportedFeatures?.supportsImages ?? false}
          />
          <QuoteSelectionModal
            isOpen={isQuoteModalOpen}
            onClose={() => {
              setIsQuoteModalOpen(false);
            }}
            onSelect={handleQuoteSelect}
            theme={selectedTheme}
          />
        </>
      )}
    </div>
  );
}

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (theme: string) => void;
  selectedTheme: string;
}

function ThemeSelectionModal({ isOpen, onClose, onSelect, selectedTheme }: ThemeSelectionModalProps) {
  const [internalSelectedTheme, setInternalSelectedTheme] = useState(selectedTheme);

  useEffect(() => {
    if (isOpen) {
      setInternalSelectedTheme(selectedTheme);
    }
  }, [selectedTheme, isOpen]);

  const handleApply = () => {
    onSelect(internalSelectedTheme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg">Select a Theme</DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6">
          <ThemeSelector onThemeChange={setInternalSelectedTheme} value={internalSelectedTheme} className="w-full" />
        </div>
        <div className="flex justify-end p-4 border-t border-border">
          <Button onClick={handleApply}>
            Apply Theme
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}