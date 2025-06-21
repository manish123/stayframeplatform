import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export function useScreenshotAnnotation() {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [annotation, setAnnotation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);

  const captureScreenshot = useCallback(async () => {
    try {
      setIsCapturing(true);
      
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import('html2canvas')).default;
      // Using type assertion for html2canvas options to avoid type issues
      const options = {
        logging: false,
        useCORS: true,
        scale: 0.5, // Reduce size for better performance
        onclone: (clonedDoc: Document) => {
          // Hide the feedback widget during screenshot
          const widget = clonedDoc.querySelector('.feedback-widget');
          if (widget) {
            (widget as HTMLElement).style.display = 'none';
          }
          return clonedDoc;
        },
      } as const;
      
      const canvas = await html2canvas(document.documentElement, options);
      
      const screenshotDataUrl = canvas.toDataURL('image/png');
      setScreenshot(screenshotDataUrl);
      return screenshotDataUrl;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const startAnnotation = useCallback(() => {
    if (!screenshot) return;
    setIsAnnotating(true);
    
    // Initialize canvas for annotation
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current || !annotationCanvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const annotationCtx = annotationCanvasRef.current.getContext('2d');
      
      if (!ctx || !annotationCtx) return;
      
      // Set canvas dimensions
      const maxWidth = 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;
      
      // Resize if image is too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      annotationCanvasRef.current.width = width;
      annotationCanvasRef.current.height = height;
      
      // Draw the screenshot on the canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Set up annotation canvas
      annotationCtx.strokeStyle = color;
      annotationCtx.lineWidth = brushSize;
      annotationCtx.lineCap = 'round';
      annotationCtx.lineJoin = 'round';
    };
    
    img.src = screenshot;
  }, [screenshot, color, brushSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAnnotating || !annotationCanvasRef.current) return;
    
    const rect = annotationCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastPoint({ x, y });
  }, [isAnnotating]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isAnnotating || !annotationCanvasRef.current || !lastPoint) return;
    
    const rect = annotationCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = annotationCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Draw line from last point to current point
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    
    setLastPoint({ x, y });
  }, [isDrawing, isAnnotating, lastPoint, color, brushSize]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const clearAnnotation = useCallback(() => {
    if (!annotationCanvasRef.current) return;
    
    const ctx = annotationCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, annotationCanvasRef.current.width, annotationCanvasRef.current.height);
  }, []);

  const saveAnnotation = useCallback(async (): Promise<string | null> => {
    if (!canvasRef.current || !annotationCanvasRef.current || !screenshot) return null;
    
    try {
      // Create a new canvas to combine screenshot and annotation
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Set canvas dimensions
      combinedCanvas.width = canvasRef.current.width;
      combinedCanvas.height = canvasRef.current.height;
      
      // Draw the screenshot
      ctx.drawImage(canvasRef.current, 0, 0);
      
      // Draw the annotation on top
      ctx.drawImage(annotationCanvasRef.current, 0, 0);
      
      // Convert to data URL
      const annotatedScreenshot = combinedCanvas.toDataURL('image/png');
      setScreenshot(annotatedScreenshot);
      setIsAnnotating(false);
      
      return annotatedScreenshot;
    } catch (error) {
      console.error('Error saving annotation:', error);
      toast.error('Failed to save annotation');
      return null;
    }
  }, [screenshot]);

  const cancelAnnotation = useCallback(() => {
    setIsAnnotating(false);
    clearAnnotation();
  }, [clearAnnotation]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      setIsDrawing(false);
      setLastPoint(null);
    };
  }, []);

  return {
    screenshot,
    isAnnotating,
    isCapturing,
    annotation,
    canvasRef,
    annotationCanvasRef,
    color,
    setColor,
    brushSize,
    setBrushSize,
    captureScreenshot,
    startAnnotation,
    saveAnnotation,
    cancelAnnotation,
    clearAnnotation,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
