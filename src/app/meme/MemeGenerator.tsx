// Update the imports
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTrackTemplate } from '@/hooks/useTrackTemplate';
import { useTemplateStore } from '@/store/templateStore';
import { BaseTemplate, AnyCanvasElement, TextCanvasElement } from '@/types/templates';
import { getRandomMessage } from '@/lib/utils/funMessages';
import Alert from '@/components/feedback/Alert';
import { ResponsiveSidebar } from '@/components/layout/ResponsiveSidebar';
import mockTemplates from '@/data/mockTemplates';
import { LayoutTemplate, Image as ImageIcon, Eye, Menu, SlidersHorizontal, Pencil } from 'lucide-react';
import { ImageSelectionModal } from '@/components/quote/ImageSelectionModal';
import { TemplateSelectionModal } from '@/components/meme/TemplateSelectionModal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CanvasDisplay = dynamic(() => import('@/components/creator/CanvasDisplay'), { ssr: false });
const ElementInspector = dynamic(() => import('@/components/creator/ElementInspector'), { ssr: false });
const PreviewModal = dynamic(() => import('@/components/creator/PreviewModal'), { ssr: false });

const DEFAULT_CANVAS_SIZE = 800;

const defaultMemeTemplate: BaseTemplate = {
  id: 'default-meme-template',
  name: 'Default Meme Template',
  type: 'static',
  appType: 'meme',
  category: 'meme',
  aspectRatio: '1:1',
  canvasDimensions: { width: DEFAULT_CANVAS_SIZE, height: DEFAULT_CANVAS_SIZE },
  canvasBackgroundColor: '#FFFFFF',
  supportedFeatures: {
    supportsImages: true,
    supportsText: true,
    maxTextElements: 5, // Maximum number of text elements allowed in this template
  },
  elements: [
    {
      id: 'meme-image',
      type: 'image',
      name: 'Meme Image',
      x: 0,
      y: 0,
      width: DEFAULT_CANVAS_SIZE,
      height: DEFAULT_CANVAS_SIZE,
      src: 'https://picsum.photos/seed/meme1img/800/600',
      objectFit: 'cover',
      opacity: 1,
      rotation: 0,
    } as const,
    {
      id: 'top-text',
      type: 'text',
      name: 'Top Text',
      content: 'TOP TEXT',
      x: 40,
      y: 20,
      width: 720,
      height: 100,
      fontFamily: 'Impact, Arial, sans-serif',
      fontSize: 60,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      textTransform: 'uppercase',
      opacity: 1,
      rotation: 0,
    } as const,
    {
      id: 'bottom-text',
      type: 'text',
      name: 'Bottom Text',
      content: 'BOTTOM TEXT',
      x: 40,
      y: 480,
      width: 720,
      height: 100,
      fontFamily: 'Impact, Arial, sans-serif',
      fontSize: 60,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      textTransform: 'uppercase',
      opacity: 1,
      rotation: 0,
    } as const,
    {
      id: 'watermark',
      type: 'watermark',
      name: 'Watermark',
      content: 'Powered by StayFrame.fyi',
      x: 600,
      y: 550,
      width: 180,
      height: 30,
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.4)',
      opacity: 0.7,
      rotation: 0,
      textAlign: 'right',
      locked: true,
    } as const,
  ],
  createdBy: 'system',
  version: 1,
};

interface MemeGeneratorProps {
  showTemplateModal?: boolean;
  onTemplateModalClose?: () => void;
}

const MemeGenerator = ({ 
  showTemplateModal,
  onTemplateModalClose
}: MemeGeneratorProps) => {
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(showTemplateModal ?? false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertState, setAlertState] = useState<{
    show: boolean;
    message: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    variant: 'default',
  });

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Get templates from mock data and filter by appType 'meme'
  const templates = useMemo(() => 
    mockTemplates
      .filter(template => template.appType === 'meme')
      .map(template => ({
        ...template,
        // Ensure previewImageUrl is set, fallback to a placeholder
        previewImageUrl: template.previewImageUrl || 'https://placehold.co/300x250/F7FAFC/1A202C?text=Meme+Template'
      })),
    []
  );

  // Get template store methods
  const {
    selectedTemplate,
    setSelectedTemplate,
    selectedElement,
    setSelectedElement,
    updateElementProperty,
  } = useTemplateStore();

  // Initialize template when component mounts or templates change
  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates]);

  // Sync template modal state with prop
  useEffect(() => {
    if (showTemplateModal !== undefined) {
      setIsTemplateModalOpen(showTemplateModal);
    }
  }, [showTemplateModal]);

  // Clean up debug effects that were only used for logging
  useEffect(() => {
    // This effect is intentionally left empty
    // It was previously used for debugging image modal state
  }, [isImageModalOpen]);

  useEffect(() => {
    // This effect is intentionally left empty
    // It was previously used for debugging selected element
  }, [selectedElement]);

  useEffect(() => {
    // Removed empty effect
  }, []);

  // Handle element click on canvas
  const handleElementClick = useCallback((element: AnyCanvasElement | null) => {
    setSelectedElement(element);
    if (element && !isDesktop) {
      setIsMobileRightOpen(true);
    }
  }, [isDesktop, setSelectedElement]);

  // Handle element update
  const handleElementUpdate = useCallback((updates: Partial<TextCanvasElement>) => {
    if (!selectedElement?.id) return;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateElementProperty(selectedElement.id, key, value);
      }
    });
  }, [selectedElement, updateElementProperty]);

  // Initialize tracking hook
  const { track } = useTrackTemplate();

  // Handle template selection
  const handleSelectTemplate = useCallback((template: BaseTemplate) => {
    // Close the template modal first
    setIsTemplateModalOpen(false);
    onTemplateModalClose?.();
    
    // Update the template
    setSelectedTemplate(template);
    
    // Track template usage
    track('meme', template.id, template.name);
    
    // Show success message
    setAlertState({
      show: true,
      message: `"${template.name}" template selected`,
      variant: 'success',
    });

    // Check for image elements that need an image
    const imageElement = template.elements?.find((el: AnyCanvasElement) => el.type === 'image');
    
    if (imageElement) {
      // Set the selected element first
      setSelectedElement(imageElement);
      
      // Use a small delay to ensure state updates before opening the modal
      const openImageModal = () => {
        setIsImageModalOpen(true);
      };
      
      // Use requestAnimationFrame to ensure the modal opens after state updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          openImageModal();
        });
      });
    } else {
      setSelectedElement(null);
    }
  }, [setSelectedTemplate, setSelectedElement, onTemplateModalClose]);

  // Handle image selection
  const handleSelectImage = useCallback((imageUrl: string) => {
    if (!selectedElement?.id) return;
    
    updateElementProperty(selectedElement.id, 'src', imageUrl);
    setIsImageModalOpen(false);
    
    setAlertState({
      show: true,
      message: 'Image updated successfully',
      variant: 'success',
    });
  }, [selectedElement, updateElementProperty]);

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

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = (sidebarType: 'left' | 'right') => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const MIN_SWIPE_DISTANCE = 50;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (sidebarType === 'left' && isRightSwipe) {
      setIsMobileLeftOpen(false);
    } else if (sidebarType === 'right' && isLeftSwipe) {
      setIsMobileRightOpen(false);
    }
  };

  const toggleLeftMenu = useCallback(() => {
    setIsMobileLeftOpen(prev => !prev);
  }, []);

  const toggleRightMenu = useCallback(() => {
    setIsMobileRightOpen(prev => !prev);
  }, []);

  // Sidebar props
  const leftSidebarProps = useMemo(() => ({
    isOpen: isMobileLeftOpen || isDesktop,
    onMobileClose: () => setIsMobileLeftOpen(false),
    position: 'left' as const,
    title: 'Design Tools',
    className: 'lg:border-r border-border bg-background text-foreground',
    onTouchStart,
    onTouchMove,
    onTouchEnd: () => onTouchEnd('left'),
    mobileWidth: 'w-72 max-w-[85vw]',
    desktopWidth: 'w-75',
  }), [isMobileLeftOpen, isDesktop]);

  const rightSidebarProps = useMemo(() => ({
    isOpen: (isMobileRightOpen || isDesktop) && !!selectedElement,
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
  }), [isMobileRightOpen, isDesktop, selectedElement, setSelectedElement]);

  // Handle element selection from canvas
  const handleElementSelect = useCallback((element: AnyCanvasElement | null) => {
    setSelectedElement(element);
    if (element && !isDesktop) {
      setIsMobileRightOpen(true);
    }
  }, [isDesktop, setSelectedElement]);

  // Alert effect
  useEffect(() => {
    if (alertState.show) {
      const timer = setTimeout(() => {
        setAlertState(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertState.show]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Alert */}
      {alertState.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert
            variant={alertState.variant}
            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
            message={alertState.message}
          />
        </div>
      )}

      {/* Header */}
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
            <h1 className="text-lg font-semibold">MemeForge</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Create viral memes in seconds</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
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
                  </div>
                </div>
              </ResponsiveSidebar>

              <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-background">
                <div ref={canvasContainerRef} className="relative w-full h-full max-w-4xl mx-auto flex items-center">
                  <CanvasDisplay
                    template={selectedTemplate}
                    sourceWidth={selectedTemplate.canvasDimensions?.width || DEFAULT_CANVAS_SIZE}
                    sourceHeight={selectedTemplate.canvasDimensions?.height || DEFAULT_CANVAS_SIZE}
                    uiScale={1}
                    selectedElementId={selectedElement?.id || null}
                    onSelectElement={handleElementSelect}
                    className="w-full h-full"
                  />
                </div>
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
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">No template selected</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleSelectTemplate}
        templates={templates}
      />

      <ImageSelectionModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleSelectImage}
        searchTerm={searchTerm}
      />

      {selectedTemplate && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          template={selectedTemplate}
          editorCanvasWidth={selectedTemplate.canvasDimensions.width}
          editorCanvasHeight={selectedTemplate.canvasDimensions.height}
        />
      )}
    </div>
  );
};

export default MemeGenerator;