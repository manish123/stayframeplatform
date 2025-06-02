// src/components/ui/FontSelector.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './Select';
import { fontCategories, getFontsByCategory, getFontById, type FontConfig } from '@/config/fonts';
import { cn } from '@/lib/utils';

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  previewText?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

export function FontSelector({
  value,
  onChange,
  className,
  previewText = 'Sample Text',
  showPreview = true,
  disabled = false,
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedFont = useMemo(() => getFontById(value), [value]);
  const fontsByCategory = useMemo(getFontsByCategory, []);

  const renderFontOption = (font: FontConfig) => {
    const fontFamily = font.family.startsWith('var(') 
      ? `var(${font.variable})` 
      : font.family;
      
    return (
      <SelectItem 
        key={font.id} 
        value={font.id}
        className="flex items-center justify-between"
      >
        <span 
          className="flex-1 truncate" 
          style={{ fontFamily }}
        >
          {font.name}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          {font.weights.join(', ')}
        </span>
      </SelectItem>
    );
  };

  if (!selectedFont) {
    return null; // or return a loading state
  }

  const selectedFontFamily = selectedFont.family.startsWith('var(')
    ? `var(${selectedFont.variable})`
    : selectedFont.family;

  return (
    <div className={cn('space-y-2', className)}>
      <Select 
        value={value} 
        onValueChange={onChange}
        onOpenChange={setIsOpen}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <span 
              className="flex-1 text-left truncate"
              style={{ fontFamily: selectedFontFamily }}
            >
              {selectedFont.name}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {Object.entries(fontsByCategory).map(([category, fonts]) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-xs font-medium text-muted-foreground">
                {fontCategories[category as keyof typeof fontCategories] || category}
              </SelectLabel>
              {fonts.map(renderFontOption)}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {showPreview && (
        <div 
          className={cn(
            'p-3 mt-2 border rounded-md transition-all duration-200',
            isOpen ? 'opacity-75' : 'opacity-100',
            disabled && 'opacity-50 cursor-not-allowed',
            'min-h-[60px] flex items-center'
          )}
          style={{
            fontFamily: selectedFontFamily,
            fontSize: '1.1rem',
            lineHeight: '1.5',
          }}
        >
          {previewText}
        </div>
      )}
    </div>
  );
}

export default FontSelector;
