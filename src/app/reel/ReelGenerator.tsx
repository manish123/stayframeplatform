import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTemplateStore } from '@/store/templateStore';
import { BaseTemplate, AnyCanvasElement, TextCanvasElement, VideoCanvasElement } from '@/types/templates';
import { getRandomMessage } from '@/lib/utils/funMessages';
import Alert from '@/components/feedback/Alert';
import { ResponsiveSidebar } from '@/components/layout/ResponsiveSidebar';
import mockTemplates from '@/data/mockTemplates';
import { LayoutTemplate, Video, Eye, Menu, SlidersHorizontal, Pencil } from 'lucide-react';
import { TemplateSelectionModal } from '@/components/reel/TemplateSelectionModal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { VideoSelectionModal } from '../../components/reel/VideoSelectionModal';
import PreviewModal from '@/components/creator/PreviewModal';
import { useTrackTemplate } from '@/hooks/useTrackTemplate';

const CanvasDisplay = dynamic(() => import('@/components/creator/CanvasDisplay'), { ssr: false });
const ElementInspector = dynamic(() => import('@/components/creator/ElementInspector'), { ssr: false });

const DEFAULT_CANVAS_SIZE = 1080; // Common size for reels (1080x1920)

const DEFAULT_REEL_ASPECT_RATIO = '9:16';

const defaultReelTemplate: BaseTemplate = {
  id: 'default-reel-template',
  name: 'Default Reel Template',
  type: 'animated',
  appType: 'reel',
  category: 'reel',
  aspectRatio: DEFAULT_REEL_ASPECT_RATIO,
  canvasDimensions: { 
    width: 1080, 
    height: 1920,
  },
  canvasBackgroundColor: '#000000',
  supportedFeatures: {
    supportsVideos: true,
    supportsText: true,
    maxTextElements: 3,
  },
  elements: [
    {
      id: 'reel-video',
      type: 'video',
      name: 'Reel Video',
      x: 0,
      y: 0,
      width: 1080,
      height: 1920,
      src: '/videos/default-reel.mp4', // Default video source
      objectFit: 'cover',
      autoplay: true,
      loop: true,
      muted: true,
      controls: false,
      opacity: 1,
      rotation: 0,
    } as const,
    {
      id: 'caption',
      type: 'text',
      name: 'Caption',
      content: 'Add your caption here',
      x: 80,
      y: 1600,
      width: 920,
      height: 200,
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'left',
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
      opacity: 1,
      rotation: 0,
    } as const,
  ],
  createdBy: 'system',
  version: 1,
};

interface ReelGeneratorProps {
  showTemplateModal?: boolean;
  onTemplateModalClose?: () => void;
}

export default function ReelGenerator({ 
  showTemplateModal = false,
  onTemplateModalClose,
}: ReelGeneratorProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(showTemplateModal);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [alertState, setAlertState] = useState<{
    show: boolean;
    message: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  }>({ show: false, message: '', variant: 'default' });
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Get templates from mock data and filter by appType 'reel'
  const templates = useMemo(() => 
    mockTemplates
      .filter(template => template.appType === 'reel')
      .map(template => ({
        ...template,
        // Ensure previewImageUrl is set, fallback to a placeholder
        previewImageUrl: template.previewImageUrl || 'https://placehold.co/300x533/F7FAFC/1A202C?text=Reel+Template'
      })),
    []
  );

  // Get template store state and actions
  const {
    selectedTemplate,
    selectedElement,
    setSelectedTemplate,
    setSelectedElement,
    updateElementProperty,
    isDevelopmentProModeActive,
  } = useTemplateStore();

  // Set default template if none selected
  useEffect(() => {
    if (!selectedTemplate || selectedTemplate.appType !== 'reel') {
      setSelectedTemplate(defaultReelTemplate);
    }
  }, [selectedTemplate, setSelectedTemplate]);

  // Sync template modal state with props
  useEffect(() => {
    if (showTemplateModal !== undefined) {
      setIsTemplateModalOpen(showTemplateModal);
    }
  }, [showTemplateModal]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (side: 'left' | 'right') => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && side === 'right') {
      setIsMobileRightOpen(false);
    } else if (isRightSwipe && side === 'left') {
      setIsMobileLeftOpen(false);
    }
  };

  // Toggle mobile sidebars
  const toggleLeftMenu = () => {
    setIsMobileLeftOpen(!isMobileLeftOpen);
    if (isMobileRightOpen) setIsMobileRightOpen(false);
  };

  const toggleRightMenu = () => {
    setIsMobileRightOpen(!isMobileRightOpen);
    if (isMobileLeftOpen) setIsMobileLeftOpen(false);
  };

  // Initialize tracking hook
  const { track } = useTrackTemplate();

  // Handle template selection
  const handleSelectTemplate = useCallback((template: BaseTemplate) => {
    // Close the template modal first
    setIsTemplateModalOpen(false);
    if (onTemplateModalClose) onTemplateModalClose();
    
    // Update the template and reset any selected element
    setSelectedTemplate(template);
    setSelectedElement(null);
    
    // Track template usage
    track('video', template.id, template.name);
    
    // Show success message
    setAlertState({
      show: true,
      message: `"${template.name}" template selected`,
      variant: 'success',
    });

    // Check for video elements that need media
    const videoElements = template.elements?.filter((el: AnyCanvasElement) => el.type === 'video');
    
    if (videoElements && videoElements.length > 0) {
      // If there are video elements, select the first one
      const firstVideo = videoElements[0];
      
      // Use a small delay to ensure state updates before opening the modal
      const openVideoModal = () => {
        setSelectedElement(firstVideo);
        setIsVideoModalOpen(true);
      };
      
      // Use requestAnimationFrame to ensure the modal opens after state updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          openVideoModal();
        });
      });
    }
  }, [setSelectedTemplate, setSelectedElement, onTemplateModalClose]);

  // Handle element selection from canvas
  const handleElementSelect = useCallback((element: AnyCanvasElement | null) => {
    setSelectedElement(element);
  }, [setSelectedElement]);

  // Handle video selection
  const handleVideoSelect = useCallback((videoUrl: string) => {
    if (!selectedElement?.id) return;
    
    updateElementProperty(selectedElement.id, 'src', videoUrl);
    setIsVideoModalOpen(false);
    
    setAlertState({
      show: true,
      message: 'Video updated successfully!',
      variant: 'success',
    });
  }, [selectedElement, updateElementProperty]);

  // Add event listener for opening the video modal from ElementInspector
  useEffect(() => {
    const handleOpenVideoModal = () => {
      setIsVideoModalOpen(true);
    };

    window.addEventListener('openVideoModal', handleOpenVideoModal);
    return () => {
      window.removeEventListener('openVideoModal', handleOpenVideoModal);
    };
  }, []);

  // Sidebar props for ResponsiveSidebar
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
    [isMobileLeftOpen, onTouchEnd]
  );

  const rightSidebarProps = useMemo(
    () => ({
      isOpen: isMobileRightOpen || !isMobile,
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
      desktopWidth: 'w-80',
    }),
    [isMobileRightOpen, isMobile, setSelectedElement]
  );

  // Check if we're on a mobile device
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Alert Messages */}
      {alertState.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert
            variant={alertState.variant}
            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
            message={alertState.message}
            className="mb-4"
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
            <h1 className="text-lg font-semibold">ReelForge</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Create engaging reels in seconds</p>
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
                              {selectedTemplate?.aspectRatio || 'Select a template'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ResponsiveSidebar>

              {/* Main Canvas Area */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-background">
                <div ref={canvasContainerRef} className="relative w-full h-full max-w-md mx-auto flex items-center">
                  <CanvasDisplay
                    template={selectedTemplate}
                    sourceWidth={selectedTemplate.canvasDimensions?.width || DEFAULT_CANVAS_SIZE}
                    sourceHeight={selectedTemplate.canvasDimensions?.height || DEFAULT_CANVAS_SIZE * 1.78} // 9:16 aspect ratio
                    uiScale={1}
                    selectedElementId={selectedElement?.id || null}
                    onSelectElement={handleElementSelect}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Right Sidebar - Element Inspector */}
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
        onClose={() => {
          setIsTemplateModalOpen(false);
          if (onTemplateModalClose) onTemplateModalClose();
        }}
        onSelect={handleSelectTemplate}
        templates={templates}
      />

      <VideoSelectionModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSelectVideo={handleVideoSelect}
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
}
