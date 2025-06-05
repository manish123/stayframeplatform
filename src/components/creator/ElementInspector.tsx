'use client';

import React from 'react';
import { useTemplateStore } from '@/store/templateStore';
import type { 
  AnyCanvasElement, 
  TextCanvasElement, 
  ImageCanvasElement, 
  VideoCanvasElement, 
  WatermarkCanvasElement 
} from '@/types/templates';
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  Droplet, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  X, 
  Minus, 
  Plus, 
  Move, 
  Lock as LockIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FontSelector } from '@/components/ui/FontSelector';
import { TextStyleControls } from './TextStyleControls';

interface ElementInspectorProps {}

export default function ElementInspector({}: ElementInspectorProps) {
  const { selectedElement, setSelectedElement, updateElementProperty } = useTemplateStore();
  const isDevelopmentProModeActive = useTemplateStore((state) => state.isDevelopmentProModeActive);

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <X className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Select an element to edit</p>
      </div>
    );
  }

  const isWatermark = selectedElement.type === 'watermark';
  const isFreeWatermark = isWatermark && !isDevelopmentProModeActive;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFreeWatermark) return;
    updateElementProperty(selectedElement.id, 'content', event.target.value);
  };

  const handleInputChange = (propertyName: string, value: unknown) => {
    if (isFreeWatermark) return;
    updateElementProperty(selectedElement.id, propertyName, value);
  };

  const handleNumberInput = (propertyName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFreeWatermark) return;
    const value = parseInt(e.target.value, 10) || 0;
    handleInputChange(propertyName, value);
  };

  const renderTextControls = () => {
    const textElement = selectedElement as TextCanvasElement;
    
    return (
      <div className="space-y-4">
        {/* Text Content */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              Text
            </h4>
          </div>
          <textarea
            value={textElement.content}
            onChange={handleTextChange}
            rows={2}
            className="w-full p-2 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>

        {/* Text Style Controls */}
        <TextStyleControls 
          element={textElement} 
          onUpdate={handleInputChange}
          disabled={isFreeWatermark}
        />

        {/* Font and Color */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Font Family</label>
            <FontSelector
              value={textElement.fontFamily || 'inter'}
              onChange={(value) => handleInputChange('fontFamily', value)}
              previewText="Sample"
              disabled={isFreeWatermark}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textElement.color || '#000000'}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-8 h-8 p-1 border border-input rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isFreeWatermark}
              />
              <input
                type="text"
                value={textElement.color || '#000000'}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="flex-1 p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isFreeWatermark}
              />
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Font Size</label>
            <span className="text-xs text-muted-foreground">
              {textElement.fontSize || 16}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleInputChange('fontSize', Math.max(8, (textElement.fontSize || 16) - 1))}
              disabled={isFreeWatermark}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <div className="flex-1">
              <input
                type="range"
                min="8"
                max="144"
                value={textElement.fontSize || 16}
                onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                disabled={isFreeWatermark}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleInputChange('fontSize', Math.min(144, (textElement.fontSize || 16) + 1))}
              disabled={isFreeWatermark}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Alignment</label>
          <div className="flex gap-1">
            <Button
              variant={textElement.textAlign === 'left' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 flex-1"
              onClick={() => handleInputChange('textAlign', 'left')}
              disabled={isFreeWatermark}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={textElement.textAlign === 'center' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 flex-1"
              onClick={() => handleInputChange('textAlign', 'center')}
              disabled={isFreeWatermark}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={textElement.textAlign === 'right' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 flex-1"
              onClick={() => handleInputChange('textAlign', 'right')}
              disabled={isFreeWatermark}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderImageControls = () => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          Image
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={(selectedElement as ImageCanvasElement).src || ''}
            readOnly
            placeholder="No image selected"
            className="flex-1 p-1.5 text-xs border border-input bg-muted/50 text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 h-9 px-2.5 text-xs whitespace-nowrap"
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent('openImageModal');
              window.dispatchEvent(event);
            }}
          >
            <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
            {(selectedElement as ImageCanvasElement).src ? 'Change' : 'Add Image'}
          </Button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Object Fit</label>
        <select
          value={(selectedElement as ImageCanvasElement).objectFit || 'cover'}
          onChange={(e) => handleInputChange('objectFit', e.target.value)}
          className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>
    </div>
  );

  const renderVideoControls = () => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5" />
          Video
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={(selectedElement as VideoCanvasElement).src || ''}
            readOnly
            placeholder="No video selected"
            className="flex-1 p-1.5 text-xs border border-input bg-muted/50 text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 h-9 px-2.5 text-xs whitespace-nowrap"
            onClick={() => {
              // Dispatch a custom event to open the video modal
              const event = new CustomEvent('openVideoModal');
              window.dispatchEvent(event);
            }}
          >
            <Video className="h-3.5 w-3.5 mr-1.5" />
            {(selectedElement as VideoCanvasElement).src ? 'Change' : 'Add Video'}
          </Button>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Object Fit</label>
        <select
          value={(selectedElement as VideoCanvasElement).objectFit || 'cover'}
          onChange={(e) => handleInputChange('objectFit', e.target.value)}
          className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>
    </div>
  );

  const renderPositionControls = () => (
    <div className="space-y-3 pt-3 border-t border-input">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Move className="h-3.5 w-3.5" />
          Position
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            X
            {isFreeWatermark && <LockIcon className="h-2.5 w-2.5" />}
          </label>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => handleNumberInput('x', e)}
            className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            Y
            {isFreeWatermark && <LockIcon className="h-2.5 w-2.5" />}
          </label>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => handleNumberInput('y', e)}
            className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Width</label>
          <input
            type="number"
            value={Math.round(selectedElement.width)}
            onChange={(e) => handleNumberInput('width', e)}
            className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Height</label>
          <input
            type="number"
            value={Math.round(selectedElement.height)}
            onChange={(e) => handleNumberInput('height', e)}
            className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground flex items-center gap-1">
          Rotation
          {isFreeWatermark && <LockIcon className="h-2.5 w-2.5" />}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation || 0}
            onChange={(e) => handleNumberInput('rotation', e)}
            className="flex-1 h-2 bg-input rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            disabled={isFreeWatermark}
          />
          <span className="text-xs w-8 text-center">{selectedElement.rotation || 0}°</span>
        </div>
      </div>
    </div>
  );

  const renderWatermarkNotice = () => (
    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
      <p className="font-medium">Watermark Notice</p>
      <p className="mt-1">Upgrade to Pro to customize or remove the watermark</p>
    </div>
  );

  return (
    <div className="p-3 space-y-4 h-full flex flex-col overflow-y-auto">
      <h3 className="text-sm font-medium flex items-center gap-2">
        {selectedElement?.type === 'text' && <Type className="h-4 w-4" />}
        {selectedElement?.type === 'image' && <ImageIcon className="h-4 w-4" />}
        {selectedElement?.type === 'video' && <Video className="h-4 w-4" />}
        {selectedElement?.type === 'watermark' && <Droplet className="h-4 w-4" />}
        <span className="truncate">{selectedElement?.name || 'Element'}</span>
      </h3>
      
      {isFreeWatermark && renderWatermarkNotice()}
      
      <div className="flex-1 space-y-4">
        {selectedElement.type === 'text' && renderTextControls()}
        {selectedElement.type === 'image' && renderImageControls()}
        {selectedElement.type === 'video' && renderVideoControls()}
        {renderPositionControls()}
      </div>
    </div>
  );
}
