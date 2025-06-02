'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Palette, Grid, Image, Edit3, Eye, Download, Menu, X, Layers, Search, ChevronDown, Monitor, Smartphone, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseTemplate } from '@/types/templates';
import { FlattenedQuote } from '@/types/quotes';
import { useTemplateStore } from '@/store/templateStore';
import mockTemplates from '@/data/mockTemplates';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';


// Default canvas settings
const DEFAULT_CANVAS_SIZE = 800;
const DEFAULT_CANVAS_BG = '#ffffff';

// Canvas presets for different aspect ratios
const canvasPresets = [
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'Portrait', width: 1080, height: 1350 },
  { name: 'Landscape', width: 1200, height: 630 },
  { name: 'Story', width: 1080, height: 1920 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Meme', width: 800, height: 600 },
  { name: 'Custom', width: 0, height: 0 }
];

// Dynamically import components with SSR disabled
const CanvasDisplay = dynamic(
  () => import('@/components/creator/CanvasDisplay').then(mod => mod.default),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Loading canvas...</div> }
);

const ElementInspector = dynamic(
  () => import('@/components/creator/ElementInspector').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading inspector...</div> }
);

const PreviewModal = dynamic(
  () => import('@/components/creator/PreviewModal').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading preview...</div> }
);

// Define the ThemeSelector props interface
interface ThemeSelectorProps {
  onThemeChange: (theme: string) => void;
  className?: string;
  value: string;
  defaultTheme?: string;
}

const ThemeSelector = dynamic<ThemeSelectorProps>(
  () => import('@/components/quote/ThemeSelector').then(mod => {
    const WrappedThemeSelector: React.FC<ThemeSelectorProps> = (props) => (
      <mod.ThemeSelector 
        {...props} 
        value={props.value || props.defaultTheme || 'inspiration'} 
        defaultTheme={props.defaultTheme || 'inspiration'}
      />
    );
    WrappedThemeSelector.displayName = 'WrappedThemeSelector';
    return WrappedThemeSelector;
  }),
  { 
    ssr: false, 
    loading: () => <div>Loading themes...</div> 
  }
);
const ImageSearch = dynamic<{
  onImageSelect: (url: string) => void;
  supportsImages: boolean;
}>(
  () => import('@/components/quote/ImageSearch').then(mod => mod.ImageSearch),
  { ssr: false, loading: () => <div>Loading image search...</div> }
);

const QuoteSearch = dynamic<{
  theme?: string;
  onQuoteSelect: (quote: FlattenedQuote) => void;
  className?: string;
}>(
  () => import('@/components/quote/QuoteSearch').then(mod => mod.QuoteSearch),
  { ssr: false, loading: () => <div>Loading quotes...</div> }
);

const tools = [
  { id: 'template', label: 'Templates', icon: Palette, color: 'text-purple-600' },
  { id: 'theme', label: 'Themes', icon: Grid, color: 'text-blue-600' },
  { id: 'image', label: 'Images', icon: Image, color: 'text-green-600' },
  { id: 'edit', label: 'Edit', icon: Edit3, color: 'text-orange-600' }
];

type ViewMode = 'desktop' | 'mobile';

export default function QuoteGeneratorSidebar() {
  // State from template store
  const { 
    selectedTemplate, 
    selectedElement, 
    setSelectedTemplate, 
    setSelectedElement,
    updateElementProperty,
    setCanvasDimensions
  } = useTemplateStore();

  // UI State
  const [activeTool, setActiveTool] = useState('template');
  const [selectedPresetName, setSelectedPresetName] = useState(canvasPresets[0].name);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  
  // Mobile menu state
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Toggle mobile left sidebar
  const toggleMobileLeft = useCallback(() => {
    setIsMobileLeftOpen(prev => !prev);
    if (isMobileRightOpen) setIsMobileRightOpen(false);
  }, [isMobileRightOpen]);

  // Toggle inspector panel
  const toggleInspector = () => {
    if (window.innerWidth < 768) {
      setShowInspector(!showInspector);
      setIsMobileRightOpen(!isMobileRightOpen);
    } else {
      setShowInspector(!showInspector);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileLeftOpen(false);
        setIsMobileRightOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter templates to only include quote templates
  const quoteTemplates = useMemo(() => 
    mockTemplates.filter(template => template.appType === 'quote'),
    []
  );

  // Set default template on mount
  useEffect(() => {
    if (quoteTemplates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(quoteTemplates[0]);
    }
  }, [quoteTemplates, selectedTemplate, setSelectedTemplate]);

  // Handle image selection
  const handleImageSelect = (imageUrl: string) => {
    if (!selectedTemplate) return;
    
    const imageElement = selectedTemplate.elements.find(el => el.type === 'image');
    if (imageElement) {
      updateElementProperty(imageElement.id, 'src', imageUrl);
    }
  };

  // Handle quote selection
  const handleQuoteSelect = (quote: FlattenedQuote) => {
    if (!selectedTemplate) return;
    
    const textElement = selectedTemplate.elements.find(el => el.type === 'text');
    if (textElement) {
      updateElementProperty(textElement.id, 'content', `"${quote.quote}"`);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: BaseTemplate) => {
    setSelectedTemplate(template);
    // Close mobile sidebar after selection on mobile
    if (window.innerWidth < 1024) {
      setIsMobileLeftOpen(false);
    }
  };

  // Render the active tool content
  const renderToolContent = () => {
    switch (activeTool) {
      case 'template':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Choose Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {quoteTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={cn(
                    "border-2 rounded-lg p-3 text-center cursor-pointer transition-colors",
                    selectedTemplate?.id === template.id 
                      ? "border-blue-400 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-400"
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                    {template.previewImageUrl ? (
                      <img 
                        src={template.previewImageUrl} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <LayoutGrid className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{template.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="space-y-4">
            <ThemeSelector 
              onThemeChange={setSelectedTheme} 
              className="w-full"
              value={selectedTheme}
              defaultTheme="inspiration"
            />
            <QuoteSearch 
              theme={selectedTheme}
              onQuoteSelect={handleQuoteSelect}
              className="mt-4"
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <ImageSearch 
              onImageSelect={handleImageSelect}
              supportsImages={selectedTemplate?.supportedFeatures?.supportsImages ?? false}
            />
          </div>
        );
      case 'edit':
        return <ElementInspector />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={toggleMobileLeft}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">Quote Generator</h1>
          <div className="flex space-x-2">
            <button 
              onClick={toggleInspector}
              className={`p-2 rounded-md ${showInspector ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              <Layers className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsPreviewModalOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
              disabled={!selectedTemplate}
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div 
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileLeftOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="font-bold text-xl text-gray-800">Quote Generator</h1>
          <button 
            onClick={toggleMobileLeft}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tool Navigation */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  'w-full flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  activeTool === tool.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                )}
              >
                <tool.icon className={tool.color} size={20} />
                <span className="font-medium">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderToolContent()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-14 lg:pt-0">
        {/* Desktop Toolbar */}
        <div className="hidden lg:flex bg-white border-b border-gray-200 p-2 items-center justify-between">
          <h2 className="font-semibold text-gray-800 ml-2">
            {selectedTemplate?.name || 'New Quote'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPresetName}
              onChange={(e) => setSelectedPresetName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              {canvasPresets.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Monitor size={18} />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Smartphone size={18} />
              </button>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => selectedTemplate && setSelectedTemplate({...selectedTemplate})}
              disabled={!selectedTemplate}
            >
              Reset
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewModalOpen(true)}
              disabled={!selectedTemplate}
            >
              Preview
            </Button>
            
            <Button 
              size="sm"
              disabled={!selectedTemplate}
            >
              Export
            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={toggleInspector}
              className={showInspector ? 'bg-gray-100' : ''}
            >
              <Layers size={18} className="mr-2" />
              Inspector
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center">
          <div className={cn(
            'bg-white shadow-lg',
            viewMode === 'mobile' ? 'w-full max-w-md' : 'w-full max-w-4xl'
          )}>
            {selectedTemplate && (
              <CanvasDisplay 
                template={selectedTemplate} 
                onSelectElement={setSelectedElement}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Inspector */}
      {showInspector && (
        <div className={cn(
          'bg-white border-l border-gray-200 w-80 flex flex-col',
          'md:relative fixed inset-y-0 right-0 z-30',
          isMobileRightOpen ? 'w-full md:w-80' : 'w-0'
        )}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold">Element Inspector</h3>
            <button 
              onClick={toggleInspector}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedElement ? (
              <ElementInspector />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Select an element to inspect its properties
              </p>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedTemplate && (
        <PreviewModal 
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          template={selectedTemplate}
          editorCanvasWidth={800}
          editorCanvasHeight={800}
        />
      )}
    </div>
  );
}
