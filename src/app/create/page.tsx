'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import mockTemplates from '@/data/mockTemplates';
import { BaseTemplate, CanvasDimensions } from '@/types/templates';
import { useTemplateStore } from '@/store/templateStore';
import { trackTemplateClick } from '@/lib/tracking';
import ElementInspector from '@/components/creator/ElementInspector';
import { canvasPresets, CanvasPreset, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '@/config/canvasPresets';
import PreviewModal from '@/components/creator/PreviewModal';
import DevProModeToggle from '@/components/developer/DevProModeToggle';

const CanvasDisplay = dynamic(() => import('@/components/creator/CanvasDisplay'), {
  ssr: false,
});

// Placeholder for a more sophisticated Combobox or template browser later
const SimpleTemplateList = ({ templates, onSelectTemplate }: {
  templates: BaseTemplate[];
  onSelectTemplate: (template: BaseTemplate) => void;
}) => {
  if (!templates || templates.length === 0) {
    return <p>No templates available.</p>;
  }
  return (
    <ul className="space-y-2">
      {templates.map((template) => (
        <li key={template.id}>
          <button 
            onClick={() => onSelectTemplate(template)}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-accent focus:bg-accent focus:outline-none transition-colors border border-border"
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-xs text-muted-foreground">{template.type} - {template.aspectRatio}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default function CreatePage() {
  const [templatesToDisplay, setTemplatesToDisplay] = useState<BaseTemplate[]>([]);
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const setSelectedTemplateInStore = useTemplateStore((state) => state.setSelectedTemplate);
  const setCanvasDimensionsInStore = useTemplateStore((state) => state.setCanvasDimensions);

  const [selectedPresetName, setSelectedPresetName] = useState<string>(canvasPresets[0].name); 
  const [currentCanvasWidth, setCurrentCanvasWidth] = useState<number>(DEFAULT_CANVAS_WIDTH);
  const [currentCanvasHeight, setCurrentCanvasHeight] = useState<number>(DEFAULT_CANVAS_HEIGHT);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTemplate) {
      setCurrentCanvasWidth(selectedTemplate.canvasDimensions.width);
      setCurrentCanvasHeight(selectedTemplate.canvasDimensions.height);
    } else {
      setCurrentCanvasWidth(DEFAULT_CANVAS_WIDTH);
      setCurrentCanvasHeight(DEFAULT_CANVAS_HEIGHT);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    setTemplatesToDisplay(mockTemplates);
  }, []);

  const handleSelectTemplate = (template: BaseTemplate) => {
    // Track the template selection
    trackTemplateClick({
      type: 'quote', // Default to 'quote' for now, adjust based on your app's structure
      templateId: template.id,
      templateName: template.name
    });
    
    // Update the selected template and canvas dimensions
    setSelectedTemplateInStore(template);
    setCanvasDimensionsInStore(template.canvasDimensions);
    setCurrentCanvasWidth(template.canvasDimensions.width);
    setCurrentCanvasHeight(template.canvasDimensions.height);
  };

  const handlePresetChange = (newPresetName: string) => {
    setSelectedPresetName(newPresetName);
    const preset = canvasPresets.find(p => p.name === newPresetName);

    if (preset && selectedTemplate) { 
      if (preset.name !== 'Custom Dimensions') {
        setCanvasDimensionsInStore({ width: preset.width, height: preset.height });
      } else {
        setCanvasDimensionsInStore({ 
          width: selectedTemplate.canvasDimensions.width, 
          height: selectedTemplate.canvasDimensions.height 
        });
      }
    } else if (preset && !selectedTemplate && preset.name !== 'Custom Dimensions'){
        setCurrentCanvasWidth(preset.width);
        setCurrentCanvasHeight(preset.height);
    } else if (preset && !selectedTemplate && preset.name === 'Custom Dimensions') {
        setCurrentCanvasWidth(DEFAULT_CANVAS_WIDTH);
        setCurrentCanvasHeight(DEFAULT_CANVAS_HEIGHT);
    }
  };

  const handleCustomDimensionChange = () => {
    if (selectedPresetName === 'Custom Dimensions' && selectedTemplate) {
      const newWidth = Math.max(1, Number(currentCanvasWidth) || selectedTemplate.canvasDimensions.width);
      const newHeight = Math.max(1, Number(currentCanvasHeight) || selectedTemplate.canvasDimensions.height);
      setCanvasDimensionsInStore({ width: newWidth, height: newHeight });
    }
  };
  
  const debouncedCustomDimensionChange = useCallback(
    debounce(handleCustomDimensionChange, 500),
    [selectedPresetName, selectedTemplate, currentCanvasWidth, currentCanvasHeight] 
  );

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    setCurrentCanvasWidth(newWidth > 0 ? newWidth : 0);
    if (selectedPresetName === 'Custom Dimensions') {
        debouncedCustomDimensionChange();
    }
  };

  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    setCurrentCanvasHeight(newHeight > 0 ? newHeight : 0);
    if (selectedPresetName === 'Custom Dimensions') {
        debouncedCustomDimensionChange();
    }
  };

  function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  }

  return (
    <div className={`container mx-auto p-4 min-h-screen flex flex-col md:flex-row gap-6 ${selectedTemplate ? 'md:grid md:grid-cols-[minmax(200px,1fr)_3fr_minmax(250px,1.5fr)]' : 'md:flex'}`}>
      {/* Left Sidebar: Template Selection */}
      <aside className="border border-border rounded-lg p-4 shadow-sm bg-card overflow-y-auto overflow-x-hidden">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Select a Template</h2>
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
          <SimpleTemplateList 
            templates={templatesToDisplay} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </div>
      </aside>

      {/* Main Area: Canvas */}
      <main className="border border-border rounded-lg shadow-sm bg-card flex flex-col p-0 md:p-6">
        {selectedTemplate ? (
          <>
            {/* Header section for template name, presets */}
            <div className="mb-4 px-6 md:px-0 pt-6 md:pt-0 flex-shrink-0"> 
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{selectedTemplate.name}</h1>
                <div className="flex items-center space-x-4"> 
                  {/* Preset Selector Dropdown */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="canvas-preset-selector" className="text-sm font-medium text-muted-foreground">Canvas Size:</label>
                    <select 
                      id="canvas-preset-selector"
                      value={selectedPresetName}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="p-2 border border-border rounded-md text-sm bg-background focus:ring-primary focus:border-primary max-w-[200px]"
                    >
                      {canvasPresets.map(preset => (
                        <option key={preset.name} value={preset.name}>
                          {preset.name} {preset.width > 0 ? `(${preset.width}x${preset.height})` : ''}
                        </option>
                      ))}
                    </select>
                    {selectedPresetName === 'Custom Dimensions' && (
                      <div className="flex items-center space-x-1">
                        <input 
                          type="number" 
                          aria-label="Custom Width"
                          value={currentCanvasWidth}
                          onChange={handleCustomWidthChange}
                          onBlur={handleCustomDimensionChange} 
                          className="w-20 p-2 border border-border rounded-md text-sm bg-background focus:ring-primary focus:border-primary"
                          placeholder="W"
                        />
                        <span className="text-sm text-muted-foreground">x</span>
                        <input 
                          type="number" 
                          aria-label="Custom Height"
                          value={currentCanvasHeight}
                          onChange={handleCustomHeightChange}
                          onBlur={handleCustomDimensionChange} 
                          className="w-20 p-2 border border-border rounded-md text-sm bg-background focus:ring-primary focus:border-primary"
                          placeholder="H"
                        />
                      </div>
                    )}
                  </div>
                  {/* Preview Button */}
                  <button 
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground px-6 md:px-0"> 
                Type: {selectedTemplate.type} | 
                Canvas: {selectedTemplate.canvasDimensions.width}x{selectedTemplate.canvasDimensions.height}px
                {selectedPresetName !== 'Custom Dimensions' && ` (Preset: ${selectedPresetName})`}
              </p>
            </div>
            {/* Canvas container */}
            <div className="flex-grow min-h-0 w-full h-full relative mt-4"> 
              {selectedTemplate && currentCanvasWidth > 0 && currentCanvasHeight > 0 && (
                <>

                  <div 
                    className="main-canvas-area flex-grow flex items-center justify-center p-4 rounded-md relative"
                  >
                    <CanvasDisplay 
                      template={selectedTemplate} 
                      outputWidth={currentCanvasWidth} 
                      outputHeight={currentCanvasHeight}
                      sourceWidth={currentCanvasWidth} 
                      sourceHeight={currentCanvasHeight} 
                      uiScale={1} 
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-xl text-muted-foreground">Select a template from the left to start creating.</p>
          </div>
        )}
      </main>

      {/* Right Sidebar: Element Inspector */}
      <aside className={`border border-border rounded-lg p-4 shadow-sm bg-card overflow-y-auto overflow-x-hidden ${selectedTemplate ? 'block' : 'hidden'}`}> 
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">Inspect Element</h2>
        {selectedTemplate && (
          <ElementInspector />
        )}
      </aside>

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && currentCanvasWidth > 0 && currentCanvasHeight > 0 && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          template={selectedTemplate}
          editorCanvasWidth={currentCanvasWidth} 
          editorCanvasHeight={currentCanvasHeight} 
        />
      )}
      
      {/* Development Only: Pro Mode Toggle */}
      {process.env.NODE_ENV === 'development' && (
        <DevProModeToggle 
          isDevelopmentProModeActive={false} 
          onToggle={() => {}} 
        />
      )}
    </div>
  );
}
