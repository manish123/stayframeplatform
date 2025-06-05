// This file ensures TypeScript understands our path aliases
declare module '@/store/templateStore' {
  import { TemplateState } from '../../store/templateStore';
  
  type Selector<T> = (state: TemplateState) => T;
  
  interface UseTemplateStore {
    (): TemplateState;
    <T>(selector: Selector<T>): T;
  }
  
  export const useTemplateStore: UseTemplateStore;
}

declare module '@/types/templates' {
  import { 
    AnyCanvasElement, 
    TextCanvasElement, 
    ImageCanvasElement, 
    VideoCanvasElement, 
    WatermarkCanvasElement 
  } from '../../types/templates';
  
  export {
    AnyCanvasElement,
    TextCanvasElement,
    ImageCanvasElement,
    VideoCanvasElement,
    WatermarkCanvasElement
  };
}

declare module '@/components/ui/Button' {
  import * as React from 'react';
  
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'accent' | 'primary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module '@/components/ui/FontSelector' {
  import * as React from 'react';
  
  interface FontSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    previewText?: string;
    showPreview?: boolean;
    disabled?: boolean;
  }
  
  export const FontSelector: React.FC<FontSelectorProps>;
}
