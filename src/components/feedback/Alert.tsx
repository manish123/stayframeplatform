import React from 'react';
// Add Info to the imports from lucide-react
import { X, CheckCircle, AlertCircle, Clock, WifiOff, CloudOff, AlertTriangle, Save, Edit, Type, Palette, LayoutTemplate, ListOrdered, ArrowLeft, FileEdit, Rewind, Edit3, Zap, RefreshCw, Check, Keyboard, PenTool, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Map our icon strings to actual components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'wifi-off': WifiOff,
  'cloud-off': CloudOff,
  'refresh-cw': RefreshCw,
  'save': Save,
  'edit': Edit,
  'type': Type,
  'palette': Palette,
  'layout-template': LayoutTemplate,
  'list-ordered': ListOrdered,
  'arrow-left': ArrowLeft,
  'file-edit': FileEdit,
  'rewind': Rewind,
  'edit-3': Edit3,
  'zap': Zap,
  'check': Check,
  'keyboard': Keyboard,
  'pen-tool': PenTool,
  'clock': Clock,
  'text': Type
};

interface AlertProps {
  message: string;
  action?: string;
  actionVariant?: 'default' | 'destructive' | 'outline' | 'ghost';
  icon?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
  onClose?: () => void;
  onAction?: () => void;
  show?: boolean;
}

export default function Alert({
  message,
  action,
  actionVariant = 'default',
  icon,
  variant = 'default',
  className = '',
  onClose,
  onAction,
  show = true,
}: AlertProps) {
  if (!show) return null;

  const variantStyles = {
    default: 'bg-blue-50 border-blue-400 text-blue-700',
    destructive: 'bg-red-50 border-red-400 text-red-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  };

  const IconComponent = icon ? iconMap[icon] || null : null;
  const defaultIcon = variant === 'destructive' ? AlertTriangle : 
                     variant === 'success' ? CheckCircle : 
                     variant === 'warning' ? AlertTriangle : 
                     variant === 'info' ? Info : null;

  return (
    <div 
      className={cn(
        "relative border-l-4 p-4 rounded-r shadow-sm",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
          {IconComponent ? (
  <IconComponent className="h-5 w-5" />
) : defaultIcon ? (
  React.createElement(defaultIcon, { className: "h-5 w-5" })
) : null}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
            {action && onAction && (
              <div className="mt-2">
// Update the Button variant prop to match the expected types
<Button
  variant={
    actionVariant === 'default' 
      ? 'primary' 
      : actionVariant as 'destructive' | 'outline' | 'ghost'
  }
  size="sm"
  onClick={onAction}
  className="text-xs"
>
  {action}
</Button>
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 -my-1.5 -mr-1.5 p-1.5 inline-flex h-8 w-8 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}