'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useTemplateStore } from '@/store/templateStore';
import { BaseTemplate, AnyCanvasElement, TextCanvasElement, ImageCanvasElement, VideoCanvasElement, WatermarkCanvasElement } from '@/types/templates';
import { debounce } from '@/utils/debounce'; // Import your debounce utility

interface CanvasDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  template?: BaseTemplate | null;
  outputWidth?: number;
  outputHeight?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  uiScale?: number;
  className?: string;
  style?: React.CSSProperties;
  onSelectElement?: (element: AnyCanvasElement | null) => void;
  selectedElementId?: string | null;
}

const CanvasDisplay = React.forwardRef<HTMLDivElement, CanvasDisplayProps>(({
  template,
  outputWidth = 800, // Default for output resolution, not directly used for display size
  outputHeight = 600, // Default for output resolution, not directly used for display size
  sourceWidth = 800, // Source dimensions for template content
  sourceHeight = 600, // Source dimensions for template content
  uiScale = 1, // User-controlled zoom/scale factor
  className,
  style,
  onSelectElement,
  selectedElementId,
  ...props
}, forwardedRef) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const setSelectedElement = useTemplateStore((state) => state.setSelectedElement);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const updateSize = useCallback(
    debounce(() => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }, 100),
    []
  );

  useEffect(() => {
    updateSize();
    const handleResize = () => updateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      updateSize.cancel();
    };
  }, [updateSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // CanvasDisplay.tsx
  const calculateCanvasSize = useCallback(() => {
    if (!containerSize.width || !containerSize.height || !sourceWidth || !sourceHeight) {
      console.warn('[CanvasDisplay] Invalid container or source dimensions:', {
        containerWidth: containerSize.width,
        containerHeight: containerSize.height,
        sourceWidth,
        sourceHeight,
        containerSize,
      });
      return { width: 0, height: 0, scale: 0, offsetX: 0, offsetY: 0 };
    }

    let finalScale = uiScale;
    let finalWidth = sourceWidth * finalScale;
    let finalHeight = sourceHeight * finalScale;

    const templateAspectRatio = sourceWidth / sourceHeight;
    const containerAspectRatio = containerSize.width / containerSize.height;

    console.log('[CanvasDisplay] Aspect ratios:', {
      templateAspectRatio,
      containerAspectRatio,
      uiScale,
      containerSize,
    });

    let baseScale = containerAspectRatio > templateAspectRatio
      ? (containerSize.height * 0.95) / sourceHeight
      : (containerSize.width * 0.95) / sourceWidth;
    console.log('[CanvasDisplay] Base scale calculated:', { baseScale });

    finalScale = baseScale * uiScale;
    finalWidth = sourceWidth * finalScale;
    finalHeight = sourceHeight * finalScale;

    console.log('[CanvasDisplay] Initial scaled dimensions:', { finalWidth, finalHeight, finalScale });

    const maxAllowedWidth = containerSize.width * 0.95;
    const maxAllowedHeight = containerSize.height * 0.95;

    if (finalWidth > maxAllowedWidth || finalHeight > maxAllowedHeight) {
      const scaleDownFactorWidth = maxAllowedWidth / sourceWidth;
      const scaleDownFactorHeight = maxAllowedHeight / sourceHeight;
      finalScale = Math.min(finalScale, scaleDownFactorWidth, scaleDownFactorHeight);
      finalWidth = sourceWidth * finalScale;
      finalHeight = sourceHeight * finalScale;
      console.log('[CanvasDisplay] Dimensions capped:', {
        maxAllowedWidth,
        maxAllowedHeight,
        scaleDownFactorWidth,
        scaleDownFactorHeight,
        finalScale,
        finalWidth,
        finalHeight,
      });
    }

    const minPixels = 400;
    if (finalWidth < minPixels || finalHeight < minPixels) {
      const minScaleFactor = minPixels / Math.min(sourceWidth, sourceHeight);
      finalScale = Math.max(finalScale, minScaleFactor);
      finalWidth = sourceWidth * finalScale;
      finalHeight = sourceHeight * finalScale;
      console.log('[CanvasDisplay] Dimensions adjusted for minimum size:', {
        minPixels,
        minScaleFactor,
        finalScale,
        finalWidth,
        finalHeight,
      });
    }

    const offsetX = Math.max(0, (containerSize.width - finalWidth) / 2); // Prevent negative offsets
    const offsetY = Math.max(0, (containerSize.height - finalHeight) / 2);

    console.log('[CanvasDisplay] Final canvas size and position:', {
      finalWidth,
      finalHeight,
      finalScale,
      offsetX,
      offsetY,
      containerSize,
    });

    return { width: finalWidth, height: finalHeight, scale: finalScale, offsetX, offsetY };
  }, [containerSize, sourceWidth, sourceHeight, uiScale]);

  const { width: canvasWidth, height: canvasHeight, scale: contentScale, offsetX, offsetY } = calculateCanvasSize();

  if (!template) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)} style={style}>
        No template selected
      </div>
    );
  }

  if (!template.elements || template.elements.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full w-full bg-muted/20 text-muted-foreground p-4", className)} style={style}>
        No elements in template
      </div>
    );
  }

  // Styles for the main canvas container (the visible editor area)
  // This 'div' *is* the canvas that gets scaled and centered.
  const canvasDisplayAreaStyle: React.CSSProperties = {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    backgroundColor: template.canvasBackgroundColor || 'hsl(var(--background))', // Make default theme-aware    position: 'absolute', // Positioned within the containerRef
    left: `${offsetX}px`,
    top: `${offsetY}px`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    opacity: isInitialRender ? 0 : 1,
    transition: 'opacity 0.1s ease-in-out',
    ...style, // Any additional styles from props applied here
  };

  const handleElementClick = (element: AnyCanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element);
    if (onSelectElement) {
      onSelectElement(element);
      console.log(`[CanvasDisplay] Element clicked: ${element.name}, ID: ${element.id}`); // Add this line

    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(null);
    if (onSelectElement) {
      onSelectElement(null);
      console.log('[CanvasDisplay] Canvas background clicked (element deselected)'); // Add this line

    }
  };
  // CanvasDisplay.tsx
  const renderElement = (element: AnyCanvasElement) => {
    if (!element) return null;

    const isSelected = element.id === selectedElementId;

    let dynamicStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x * contentScale}px`,
      top: `${element.y * contentScale}px`,
      width: `${element.width * contentScale}px`,
      height: `${element.height * contentScale}px`,
      opacity: element.opacity ?? 1,
      transform: `rotate(${element.rotation || 0}deg)`,
      transformOrigin: 'center center',
      border: isSelected ? '2px dashed #3b82f6' : 'none',
      outline: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease-in-out',
    };

    console.log('[CanvasDisplay] Rendering element:', {
      id: element.id,
      type: element.type,
      scaledPosition: { left: element.x * contentScale, top: element.y * contentScale },
      scaledSize: { width: element.width * contentScale, height: element.height * contentScale },
      contentScale,
    });

    switch (element.type) {
      case 'text':
      case 'watermark': {
        const textElement = element as TextCanvasElement | WatermarkCanvasElement;
        if (!('content' in textElement)) return null;
        dynamicStyle = {
          ...dynamicStyle,
          fontSize: `${(textElement.fontSize || 16) * contentScale}px`,
          color: textElement.color || '#000000',
          fontFamily: textElement.fontFamily || 'Inter, Arial, sans-serif',
          fontWeight: textElement.fontWeight || 'normal',
          fontStyle: textElement.fontStyle || 'normal',
          textAlign: textElement.textAlign || 'left',
          lineHeight: textElement.lineHeight || 1.2,
          letterSpacing: textElement.letterSpacing ? `${textElement.letterSpacing}px` : 'normal',
          textTransform: textElement.textTransform || 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: textElement.textAlign === 'center' ? 'center' : (textElement.textAlign === 'right' ? 'flex-end' : 'flex-start'),
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          padding: '0.25rem',
        };
        console.log('[CanvasDisplay] Text element styles:', {
          id: textElement.id,
          fontSize: (textElement.fontSize || 16) * contentScale,
          textAlign: textElement.textAlign,
          content: textElement.content,
        });
        return (
          <div
            key={element.id}
            style={dynamicStyle}
            onClick={(e) => handleElementClick(element, e)}
            className="select-none"
          >
            {textElement.content}
          </div>
        );
      }
      case 'image': {
        const imageElement = element as ImageCanvasElement;
        dynamicStyle = {
          ...dynamicStyle,
          backgroundColor: '#f3f4f6',
        };
        return (
          <div
            key={element.id}
            style={dynamicStyle}
            onClick={(e) => handleElementClick(element, e)}
            title={element.name}
            className="bg-gray-100 rounded"
          >
            <img
              src={imageElement.src || 'https://placehold.co/100x100'}
              alt={element.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imageElement.objectFit || 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
              className="pointer-events-none"
            />
          </div>
        );
      }
      case 'video': {
        const videoElement = element as VideoCanvasElement;
        dynamicStyle = {
          ...dynamicStyle,
          backgroundColor: '#000',
        };
        return (
          <div
            key={element.id}
            style={dynamicStyle}
            onClick={(e) => handleElementClick(element, e)}
            title={element.name}
            className="bg-black rounded"
          >
            <video
              src={videoElement.src}
              controls={videoElement.controls ?? true}
              autoPlay={videoElement.autoplay ?? false}
              loop={videoElement.loop ?? false}
              muted={videoElement.muted ?? false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: videoElement.objectFit || 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
              className="pointer-events-none"
            />
          </div>
        );
      }
      default:
        return null;
    }
  };

  // Use useImperativeHandle to expose methods if needed
  React.useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement);

  if (!template) {
    return (
      <div 
        ref={containerRef}
        className={cn("relative w-full h-full flex items-center justify-center p-4 canvas-container bg-background", className)}
        {...props}
      >
        <div className="text-muted-foreground">No template selected</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex items-center justify-center p-4 canvas-container bg-background", className)}
      {...props}
    >
      {/* This is the main canvas display area, which is centered and scaled */}
      <div
        className="relative bg-background text-foreground rounded-lg shadow-xl"
        style={canvasDisplayAreaStyle} // Use the new style object for the main canvas div
        onClick={handleCanvasClick}
      >
        {/* Render elements, sorted by zIndex for correct layering if implemented */}
        {template.elements.map(renderElement)}
      </div>
    </div>
  );
});

// Set display name for debugging purposes
CanvasDisplay.displayName = 'CanvasDisplay';

// Add prop types validation if needed
CanvasDisplay.propTypes = {
  template: (props: any, propName: string, componentName: string) => {
    if (props[propName] === undefined) {
      return new Error(`The prop '${propName}' is marked as required in '${componentName}', but its value is 'undefined'`);
    }
    return null;
  },
  outputWidth: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(`'${propName}' must be a positive number`);
    }
    return null;
  },
  outputHeight: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(`'${propName}' must be a positive number`);
    }
    return null;
  },
  sourceWidth: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(`'${propName}' must be a positive number`);
    }
    return null;
  },
  sourceHeight: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(`'${propName}' must be a positive number`);
    }
    return null;
  },
  uiScale: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(`'${propName}' must be a positive number`);
    }
    return null;
  },
  className: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && typeof value !== 'string') {
      return new Error(`'${propName}' must be a string`);
    }
    return null;
  },
  style: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && typeof value !== 'object') {
      return new Error(`'${propName}' must be an object`);
    }
    return null;
  },
  onSelectElement: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && typeof value !== 'function') {
      return new Error(`'${propName}' must be a function`);
    }
    return null;
  },
  selectedElementId: (props: any, propName: string) => {
    const value = props[propName];
    if (value !== undefined && typeof value !== 'string' && value !== null) {
      return new Error(`'${propName}' must be a string or null`);
    }
    return null;
  },
};

export default CanvasDisplay;