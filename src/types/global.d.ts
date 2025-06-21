// This file ensures TypeScript understands our path aliases and provides type declarations for browser-specific APIs

// Extend the Window interface to include doNotTrack
declare global {
  interface Window {
    doNotTrack?: string;
  }

  // Define BatteryManager interface
  interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
    onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
  }

  // Extend Navigator to include getBattery
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
    doNotTrack?: string;
  }
}

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
    ShapeCanvasElement,
    WatermarkCanvasElement,
    BaseTemplate,
    CanvasDimensions
  } from '../../types/templates';
  
  export {
    AnyCanvasElement,
    TextCanvasElement,
    ImageCanvasElement,
    VideoCanvasElement,
    ShapeCanvasElement,
    WatermarkCanvasElement,
    BaseTemplate,
    CanvasDimensions
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
