'use client';

import React from 'react';
import { useTemplateStore } from '@/store/templateStore';
import { AnyCanvasElement, TextCanvasElement, ImageCanvasElement, VideoCanvasElement, WatermarkCanvasElement, ShapeCanvasElement } from '@/types/templates';
import { Type, Image as ImageIcon, Video, Droplet, Text, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Move, RotateCw, Layers, Lock, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FontSelector } from '@/components/ui/FontSelector';

interface ElementInspectorProps {
}

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

  const handleInputChange = (propertyName: string, value: any) => {
    if (isFreeWatermark) return;
    updateElementProperty(selectedElement.id, propertyName, value);
  };

  const handleNumberInput = (propertyName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFreeWatermark) return;
    const value = parseInt(e.target.value, 10) || 0;
    handleInputChange(propertyName, value);
  };

  const renderTextControls = () => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5" />
            Text
          </h4>
        </div>
        <textarea
          value={(selectedElement as TextCanvasElement).content}
          onChange={handleTextChange}
          rows={2}
          className="w-full p-2 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isFreeWatermark}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Text className="h-3.5 w-3.5" />
            Size
          </label>
          <input
            type="number"
            value={(selectedElement as TextCanvasElement).fontSize}
            onChange={(e) => handleNumberInput('fontSize', e)}
            className="w-full p-1.5 text-xs border border-input bg-background text-foreground rounded-md focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5" />
            Color
          </label>
          <input
            type="color"
            value={(selectedElement as TextCanvasElement).color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="w-full h-8 p-1 border border-input rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isFreeWatermark}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Font</label>
        <FontSelector
          value={(selectedElement as TextCanvasElement).fontFamily || 'inter'}
          onChange={(value) => handleInputChange('fontFamily', value)}
          previewText="Sample Text"
          disabled={isFreeWatermark}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Alignment</label>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1"
            onClick={() => handleInputChange('textAlign', 'left')}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1"
            onClick={() => handleInputChange('textAlign', 'center')}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1"
            onClick={() => handleInputChange('textAlign', 'right')}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );

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
            {isFreeWatermark && <Lock className="h-2.5 w-2.5" />}
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
            {isFreeWatermark && <Lock className="h-2.5 w-2.5" />}
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
          {isFreeWatermark && <Lock className="h-2.5 w-2.5" />}
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