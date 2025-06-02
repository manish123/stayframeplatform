// src/types/ui.d.ts
declare module '@/components/ui/button' {
  import { ButtonHTMLAttributes, FC } from 'react';
  
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export const Button: FC<ButtonProps>;
}

declare module '@/components/ui/select' {
  import { FC, ReactNode, SelectHTMLAttributes } from 'react';
  
  interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }
  
  interface SelectContentProps {
    children: ReactNode;
    position?: 'item-aligned' | 'popper';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
  }
  
  interface SelectItemProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
  }
  
  interface SelectTriggerProps {
    children: ReactNode;
    className?: string;
  }
  
  interface SelectValueProps {
    children?: ReactNode;
    placeholder?: string;
  }
  
  export const Select: FC<SelectProps> & {
    Content: FC<SelectContentProps>;
    Item: FC<SelectItemProps>;
    Trigger: FC<SelectTriggerProps>;
    Value: FC<SelectValueProps>;
  };
  export const SelectContent: FC<SelectContentProps>;
  export const SelectItem: FC<SelectItemProps>;
  export const SelectTrigger: FC<SelectTriggerProps>;
  export const SelectValue: FC<SelectValueProps>;
}