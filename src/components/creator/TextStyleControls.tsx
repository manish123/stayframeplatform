import React from 'react';
import { Bold, Italic, Underline, Type, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface TextStyleControlsProps {
  element: any; // TextCanvasElement
  onUpdate: (property: string, value: any) => void;
  disabled?: boolean;
}

export function TextStyleControls({ element, onUpdate, disabled = false }: TextStyleControlsProps) {
  const isBold = element.fontWeight === 'bold' || parseInt(element.fontWeight || '400') >= 600;
  const isItalic = element.fontStyle === 'italic';
  const isUnderlined = element.textDecoration?.includes('underline');
  const isStrikethrough = element.textDecoration?.includes('line-through');

  const toggleBold = () => {
    onUpdate('fontWeight', isBold ? 'normal' : 'bold');
  };

  const toggleItalic = () => {
    onUpdate('fontStyle', isItalic ? 'normal' : 'italic');
  };

  const toggleUnderline = () => {
    let newDecoration = '';
    if (isUnderlined) {
      newDecoration = element.textDecoration?.replace('underline', '').trim() || 'none';
    } else {
      newDecoration = element.textDecoration 
        ? `${element.textDecoration} underline` 
        : 'underline';
    }
    onUpdate('textDecoration', newDecoration === 'none' ? 'none' : newDecoration);
  };

  const toggleStrikethrough = () => {
    let newDecoration = '';
    if (isStrikethrough) {
      newDecoration = element.textDecoration?.replace('line-through', '').trim() || 'none';
    } else {
      newDecoration = element.textDecoration 
        ? `${element.textDecoration} line-through` 
        : 'line-through';
    }
    onUpdate('textDecoration', newDecoration === 'none' ? 'none' : newDecoration);
  };

  const handleLineHeightChange = (value: number) => {
    onUpdate('lineHeight', Math.max(0.8, Math.min(3, value)));
  };

  const handleLetterSpacingChange = (value: number) => {
    onUpdate('letterSpacing', Math.max(-5, Math.min(10, value)));
  };

  return (
    <div className="space-y-4">
      {/* Style Buttons */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-md">
        <Button
          type="button"
          variant={isBold ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleBold}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isItalic ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleItalic}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isUnderlined ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleUnderline}
          disabled={disabled}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant={isStrikethrough ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleStrikethrough}
          disabled={disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Line Height */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Line Height</label>
          <span className="text-xs text-muted-foreground">
            {element.lineHeight ? Math.round(element.lineHeight * 100) : 100}%
          </span>
        </div>
        <Slider
          value={[element.lineHeight || 1.2]}
          min={0.8}
          max={3}
          step={0.1}
          onValueChange={(values: number[]) => handleLineHeightChange(values[0])}
          disabled={disabled}
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Letter Spacing</label>
          <span className="text-xs text-muted-foreground">
            {element.letterSpacing || 0}px
          </span>
        </div>
        <Slider
          value={[element.letterSpacing || 0]}
          min={-2}
          max={10}
          step={0.5}
          onValueChange={(values: number[]) => handleLetterSpacingChange(values[0])}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
