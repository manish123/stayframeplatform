'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Loader2, Minus, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useTemplateStore } from '@/store/templateStore';
import CanvasDisplay from './CanvasDisplay';
import { AnyCanvasElement, TextCanvasElement, ImageCanvasElement, VideoCanvasElement } from '@/types/templates';

type PreviewType = 'image' | 'video';
type ExportFormat = 'png' | 'jpeg' | 'webp' | 'webm';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: PreviewType;
  template?: any;
  editorCanvasWidth?: number;
  editorCanvasHeight?: number;
}

// Helper function to debounce resize events
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const PreviewModal = ({
  isOpen,
  onClose,
  type = 'image',
  template: templateProp,
  editorCanvasWidth,
  editorCanvasHeight
}: PreviewModalProps) => {
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const canvasDisplayRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const { selectedTemplate: storeSelectedTemplate } = useTemplateStore();

  const template = templateProp || storeSelectedTemplate;

  // Update container size when modal opens or template changes
  useEffect(() => {
    if (isOpen) {
      const updateSize = () => {
        if (previewAreaRef.current) {
          const { width, height } = previewAreaRef.current.getBoundingClientRect();
          setContainerSize({
            width: Math.max(1, width - 32),
            height: Math.max(1, height - 32)
          });
        }
      };

      updateSize();
      const handleResize = debounce(updateSize, 100);
      window.addEventListener('resize', handleResize);

      // Small delay to ensure container is fully rendered
      const timer = setTimeout(() => {
        setContainerReady(true);
        setCanvasKey(prev => prev + 1);
      }, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    } else {
      setContainerReady(false);
    }
  }, [isOpen, template]);

  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    try {
      if (!template) {
        console.error('No template selected');
        return null;
      }

      const { createCanvasFromTemplate } = await import('@/lib/services/canvasRenderer');
      return await createCanvasFromTemplate(template, {
        width: template.canvasDimensions?.width || 1920,
        height: template.canvasDimensions?.height || 1080,
        scale: 1,
        backgroundColor: template.canvasBackgroundColor || '#ffffff',
        format: 'png',
        quality: 0.95,
        maxDimension: 2048,
        pixelRatio: 1,
        compression: true
      });
    } catch (error) {
      console.error('Error creating canvas:', error);
      return null;
    }
  };

  const calculateObjectFit = (
    imgWidth: number,
    imgHeight: number,
    destX: number,
    destY: number,
    destWidth: number,
    destHeight: number,
    objectFit: string
  ) => {
    const imgAspect = imgWidth / imgHeight;
    const destAspect = destWidth / destHeight;

    let sx = 0, sy = 0, sw = imgWidth, sh = imgHeight;
    let dx = destX, dy = destY, dw = destWidth, dh = destHeight;

    if (objectFit === 'cover') {
      if (imgAspect > destAspect) {
        // Image is wider than destination
        sw = imgHeight * destAspect;
        sx = (imgWidth - sw) / 2;
      } else {
        // Image is taller than destination
        sh = imgWidth / destAspect;
        sy = (imgHeight - sh) / 2;
      }
    } else if (objectFit === 'contain') {
      if (imgAspect > destAspect) {
        // Image is wider than destination
        dh = destWidth / imgAspect;
        dy += (destHeight - dh) / 2;
      } else {
        // Image is taller than destination
        dw = destHeight * imgAspect;
        dx += (destWidth - dw) / 2;
      }
    } else if (objectFit === 'fill') {
      // Use destination dimensions directly
    } else if (objectFit === 'none') {
      // Use source dimensions
      dx = destX + (destWidth - imgWidth) / 2;
      dy = destY + (destHeight - imgHeight) / 2;
      dw = imgWidth;
      dh = imgHeight;
    } else if (objectFit === 'scale-down') {
      // Use 'contain' but don't scale up
      const scale = Math.min(1, destWidth / imgWidth, destHeight / imgHeight);
      dw = imgWidth * scale;
      dh = imgHeight * scale;
      dx = destX + (destWidth - dw) / 2;
      dy = destY + (destHeight - dh) / 2;
    }

    return { sx, sy, sw, sh, dx, dy, dw, dh };
  };

  const renderTextElement = (ctx: CanvasRenderingContext2D, element: TextCanvasElement) => {
    const {
      content,
      x,
      y,
      width,
      height,
      color = '#000000',
      fontSize = 16,
      fontFamily = 'Arial, sans-serif',
      fontWeight = 'normal',
      fontStyle = 'normal',
      textAlign = 'left',
      verticalAlign = 'top',
      lineHeight = 1.2,
      padding = 0,
      backgroundColor,
      borderRadius = 0,
    } = element;

    // Save context state
    ctx.save();

    try {
      // Set text styles
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.textAlign = textAlign as CanvasTextAlign;

      // Calculate text metrics
      const lines = content.split('\n');
      const lineHeightPx = fontSize * lineHeight;
      const totalHeight = lines.length * lineHeightPx;
      const startY = y + padding;

      // Draw background if specified
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        if (borderRadius > 0) {
          const r = Math.min(borderRadius, width / 2, height / 2);
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + width, y, x + width, y + height, r);
          ctx.arcTo(x + width, y + height, x, y + height, r);
          ctx.arcTo(x, y + height, x, y, r);
          ctx.arcTo(x, y, x + width, y, r);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(x, y, width, height);
        }
        ctx.fillStyle = color; // Reset fill style
      }

      // Calculate vertical alignment
      let textY = startY;
      if (verticalAlign === 'middle') {
        textY = y + (height - totalHeight) / 2;
      } else if (verticalAlign === 'bottom') {
        textY = y + height - totalHeight - padding;
      }

      // Draw text lines
      lines.forEach((line: string, i: number) => {
        let textX = x + padding;
        if (textAlign === 'center') {
          textX = x + width / 2;
        } else if (textAlign === 'right') {
          textX = x + width - padding;
        }
        ctx.fillText(line, textX, textY + i * lineHeightPx);
      });

    } catch (error) {
      console.error('Error rendering text element:', error);
    } finally {
      // Restore context state
      ctx.restore();
    }
  };

  const renderImageElement = async (ctx: CanvasRenderingContext2D, element: ImageCanvasElement) => {
    const { src, x, y, width, height, objectFit = 'cover', borderRadius = 0 } = element;

    try {
      // Load the image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(new Error('Failed to load image'));
        image.src = src;
      });

      // Calculate dimensions based on objectFit
      const { sx, sy, sw, sh, dx, dy, dw, dh } = calculateObjectFit(
        img.width,
        img.height,
        x,
        y,
        width,
        height,
        objectFit
      );

      // Draw the image with optional border radius
      if (borderRadius > 0) {
        const r = Math.min(borderRadius, width / 2, height / 2);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(dx + r, dy);
        ctx.arcTo(dx + dw, dy, dx + dw, dy + dh, r);
        ctx.arcTo(dx + dw, dy + dh, dx, dy + dh, r);
        ctx.arcTo(dx, dy + dh, dx, dy, r);
        ctx.arcTo(dx, dy, dx + dw, dy, r);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    } catch (error) {
      console.error('Error rendering image element:', error);
      // Draw error placeholder
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#ff0000';
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Image Load Error', x + width / 2, y + height / 2);
    }
  };

  const renderVideoFrame = async (ctx: CanvasRenderingContext2D, element: VideoCanvasElement, currentTime: number) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // Add CORS attribute
    video.muted = true;
    video.playsInline = true;
    video.currentTime = currentTime;

    try {
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          console.error('Video load error:', e);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          reject(new Error('Failed to load video'));
        };

        video.addEventListener('canplay', onCanPlay, { once: true });
        video.addEventListener('error', onError, { once: true });
        video.src = element.src;
        video.load();
      });

      // Draw the video frame
      const { sx, sy, sw, sh, dx, dy, dw, dh } = calculateObjectFit(
        video.videoWidth,
        video.videoHeight,
        element.x,
        element.y,
        element.width,
        element.height,
        element.objectFit || 'cover'
      );

      ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
    } catch (error) {
      console.error('Error rendering video frame:', error);
      // Fallback to placeholder
      ctx.fillStyle = '#000000';
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'VIDEO',
        element.x + element.width / 2,
        element.y + element.height / 2
      );
    }
  };

  const renderElement = async (ctx: CanvasRenderingContext2D, element: AnyCanvasElement) => {
    // Save the current context state
    ctx.save();

    try {
      // Apply transformations
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      if (element.rotation) {
        ctx.rotate((element.rotation * Math.PI) / 180);
      }
      ctx.translate(-centerX, -centerY);

      // Apply opacity
      if (element.opacity !== undefined) {
        ctx.globalAlpha = element.opacity;
      }

      // Render based on element type
      switch (element.type) {
        case 'text':
          renderTextElement(ctx, element as TextCanvasElement);
          break;
        case 'image':
          await renderImageElement(ctx, element as ImageCanvasElement);
          break;
        case 'video':
          await renderVideoFrame(ctx, element as VideoCanvasElement, 0);
          break;
      }
    } catch (error) {
      console.error('Error rendering element:', error);
    } finally {
      // Restore the context state
      ctx.restore();
    }
  };

  /**
   * Renders text and watermark elements onto the canvas
   * @param ctx Canvas rendering context
   * @param elements Array of elements to render
   * @param width Width of the target canvas
   * @param height Height of the target canvas
   * @param originalWidth Original template width (default: 1080)
   * @param originalHeight Original template height (default: 1920)
   */
  const renderTextElements = (
    ctx: CanvasRenderingContext2D,
    elements: any[],
    width: number,
    height: number,
    originalWidth = 1080,
    originalHeight = 1920
  ) => {
    // Process text and watermark elements
    const textElements = elements
      .filter(el => el && (el.type === 'text' || el.type === 'watermark'))
      .map(el => {
        const isWatermark = el.type === 'watermark';
        const defaultFontSize = isWatermark 
          ? Math.min(originalWidth, originalHeight) * 0.03 
          : 16;
          
        return {
          ...el,
          content: el.content || el.text || (isWatermark ? 'Watermark' : ''),
          textAlign: el.textAlign || 'left',
          color: el.color || (isWatermark ? 'rgba(128, 128, 128, 0.5)' : '#000000'),
          fontSize: el.fontSize || defaultFontSize,
          fontFamily: el.fontFamily || 'Arial, sans-serif',
          fontWeight: el.fontWeight || 'normal',
          opacity: typeof el.opacity === 'number' ? el.opacity : (isWatermark ? 0.9 : 1)
        };
      });

    if (textElements.length === 0) return;

    // Calculate scale and offset for proper aspect ratio and centering
    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (width - (originalWidth * scale)) / 2;
    const offsetY = (height - (originalHeight * scale)) / 2;

    // Save context state
    ctx.save();
    
    try {
      // Apply scale and offset to match preview
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Render each text element
      textElements.forEach((textEl) => {
        if (!textEl.content) return;

        // Save the current context state
        ctx.save();

        try {
          // Set up text style with defaults
          const fontSize = textEl.fontSize || (textEl.type === 'watermark' 
            ? Math.min(originalWidth, originalHeight) * 0.03 
            : 16);
          const fontFamily = textEl.fontFamily || 'Arial, sans-serif';
          const fontWeight = textEl.fontWeight || 'normal';
          const fontStyle = textEl.fontStyle || 'normal';
          
          // Build font string
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          
          // Set text alignment and baseline
          ctx.textAlign = (textEl.textAlign as CanvasTextAlign) || 'left';
          ctx.textBaseline = 'top';
          
          // Set fill style with opacity
          const opacity = typeof textEl.opacity === 'number' ? textEl.opacity : 1;
          ctx.globalAlpha = opacity;
          
          // Configure shadow for better visibility
          if (textEl.textShadow) {
            const shadowParts = String(textEl.textShadow).split(' ');
            if (shadowParts.length >= 3) {
              const shadowX = parseFloat(shadowParts[0]) || 0;
              const shadowY = parseFloat(shadowParts[1]) || 0;
              const shadowBlur = parseFloat(shadowParts[2]) || 0;
              const shadowColor = shadowParts[3] || 'rgba(0,0,0,0.5)';
              
              ctx.shadowColor = shadowColor;
              ctx.shadowOffsetX = shadowX;
              ctx.shadowOffsetY = shadowY;
              ctx.shadowBlur = shadowBlur;
            }
          } else if (textEl.type === 'watermark') {
            // Add subtle shadow for watermarks
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
          } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
          
          // Set fill color with opacity
          const color = textEl.type === 'watermark' 
            ? textEl.color || 'rgba(128, 128, 128, 0.5)'
            : textEl.color || '#000000';
          ctx.fillStyle = color;
          
          // Handle multiline text
          const content = textEl.content || '';
          const lines = content.split('\n');
          const lineHeight = fontSize * 1.2; // Standard line height
          
          // Calculate text position based on alignment and vertical alignment
          lines.forEach((line: string, index: number) => {
            let x = textEl.x;
            let y = textEl.y + (index * lineHeight);
            
            // Adjust x position based on text alignment
            if (ctx.textAlign === 'center') {
              x = textEl.x; // Already centered in the x position
            } else if (ctx.textAlign === 'right') {
              x = textEl.x; // Already right-aligned in the x position
            }
            
            // Draw the text
            ctx.fillText(line, x, y);
          });
        } catch (error) {
          console.error('Error rendering text element:', error);
        } finally {
          // Restore context state for this element
          ctx.restore();
        }
      });
      
    } catch (error) {
      console.error('Error in renderTextElements:', error);
    } finally {
      // Restore the context state
      ctx.restore();
    }
  };

  const handleExport = async (format: ExportFormat = 'png') => {
    if (isExporting) {
      console.warn('Export already in progress');
      return;
    }

    setSelectedFormat(format);

    if (format === 'webm' || type === 'video') {
      await handleVideoExport();
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = await getCanvas();
      if (!canvas) {
        throw new Error('Canvas not ready for export');
      }

      setExportProgress(30);
      await new Promise(resolve => setTimeout(resolve, 100));
      setExportProgress(70);

      // Create a new canvas with all elements
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create 2D context');
      }

      // Draw background
      ctx.fillStyle = template?.canvasBackgroundColor || '#ffffff';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw the original canvas
      ctx.drawImage(canvas, 0, 0);

      // For video elements, ensure they're properly rendered
      const videoElements = template.elements.filter((el: any) => el.type === 'video');
      for (const videoEl of videoElements) {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous'; // Add CORS attribute
        video.src = videoEl.src;
        video.currentTime = 0; // Ensure we're at the start of the video
        await new Promise(resolve => {
          video.onloadeddata = () => {
            ctx.drawImage(video, videoEl.x, videoEl.y, videoEl.width, videoEl.height);
            resolve(null);
          };
          video.load(); // Force load the video
          video.play().catch(e => console.error('Error playing video:', e));
        });
      }

      // Convert to blob with correct MIME type
      const mimeType = format === 'jpeg' ? 'image/jpeg' :
        format === 'webp' ? 'image/webp' : 'image/png';

      const quality = format === 'jpeg' ? 0.85 :
        format === 'webp' ? 0.8 : 0.95;

      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob(
          (b) => resolve(b),
          mimeType,
          quality
        );
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      toast({
        title: 'Export successful',
        description: `Your ${format.toUpperCase()} has been downloaded`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred during export',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  };

  const handleVideoExport = async () => {
    if (isExporting || isVideoExporting) {
      return;
    }

    setIsExporting(true);
    setIsVideoExporting(true);
    setExportProgress(0);

    // Create elements
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not create canvas context');
      setIsExporting(false);
      setIsVideoExporting(false);
      return;
    }

    // Set canvas size
    canvas.width = 1920; // Default size, will be updated when video loads
    canvas.height = 1080;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const videoElement = document.createElement('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.src = template?.elements[0]?.src;

    try {
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          canvas.width = videoElement.videoWidth || 1920;
          canvas.height = videoElement.videoHeight || 1080;
          resolve();
        };

        const onError = (e: Event) => {
          console.error('Video load error:', e);
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          reject(new Error('Failed to load video'));
        };

        videoElement.addEventListener('canplay', onCanPlay, { once: true });
        videoElement.addEventListener('error', onError, { once: true });
        videoElement.load();
      });

      // Set up MediaRecorder
      const stream = canvas.captureStream(30);
      const chunks: Blob[] = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });

      // Collect data
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // Start recording
      recorder.start(100);

      // Start playing the video
      videoElement.currentTime = 0;
      await videoElement.play();

      // Frame capture and rendering
      await new Promise<void>((resolve) => {
        const renderFrame = () => {
          if (videoElement.ended || videoElement.paused) {
            resolve();
            return;
          }

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            // Draw video frame
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Render text elements (including watermarks)
            renderTextElements(ctx, template.elements, canvas.width, canvas.height);

            // Update progress
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            setExportProgress(progress);

            // Continue capturing frames if not ended
            if (!videoElement.ended) {
              requestAnimationFrame(renderFrame);
            } else {
              resolve();
            }
          } catch (error) {
            console.error('Error in render loop:', error);
            resolve();
          }
        };

        // Start rendering frames
        renderFrame();

        // Set up video end handler
        const onEnded = () => {
          videoElement.removeEventListener('ended', onEnded);
          resolve();
        };
        videoElement.addEventListener('ended', onEnded);

        // Safety timeout
        const safetyTimeout = setTimeout(() => {
          console.warn('Export timed out, stopping recording');
          videoElement.pause();
          resolve();
        }, (videoElement.duration * 1000) + 5000); // 5 second buffer

        // Clean up timeout when done
        return () => clearTimeout(safetyTimeout);
      });

      // Stop recording and wait for final data
      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          resolve();
        };

        // Request final data and stop
        recorder.requestData();
        recorder.stop();

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      });

      if (chunks.length === 0) {
        throw new Error('No video data recorded');
      }

      // Create final blob
      const finalBlob = new Blob(chunks, { type: 'video/webm' });

      // Clean up
      document.body.removeChild(canvas);

      if (finalBlob.size === 0) {
        throw new Error('No video data recorded');
      }

      // Create and trigger download
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setIsVideoExporting(false);
      setExportProgress(0);
    }
  };

  const handleCopyToClipboard = async () => {
    if (isExporting || isVideoExporting) {
      toast({
        title: 'Please wait',
        description: 'Please wait for the current export to finish',
        variant: 'default',
      });
      return;
    }

    setIsExporting(true);

    try {
      const canvas = await getCanvas();
      if (!canvas) {
        throw new Error('Canvas not ready for export');
      }

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 0.95);
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      toast({
        title: 'Copied to clipboard!',
        description: 'The image has been copied to your clipboard',
      });

    } catch (error) {
      console.error('Copy to clipboard error:', error);
      toast({
        title: 'Copy failed',
        description: error instanceof Error ? error.message : 'Could not copy to clipboard',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(0.8);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Preview</DialogTitle>
              <DialogDescription>
                {type === 'image' ? 'Preview your image' : 'Preview your video'}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetZoom}
                className="h-8 px-3"
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 2}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-2 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedFormat === 'png' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFormat('png')}
                disabled={isExporting || isVideoExporting}
              >
                PNG
              </Button>
              <Button
                variant={selectedFormat === 'jpeg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFormat('jpeg')}
                disabled={isExporting || isVideoExporting}
              >
                JPEG
              </Button>
              <Button
                variant={selectedFormat === 'webp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFormat('webp')}
                disabled={isExporting || isVideoExporting}
              >
                WebP
              </Button>
              <Button
                variant={selectedFormat === 'webm' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFormat('webm')}
                disabled={isExporting || isVideoExporting}
              >
                WebM
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                disabled={isExporting || isVideoExporting}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                size="sm"
                onClick={() => handleExport(selectedFormat)}
                disabled={isExporting || isVideoExporting}
              >
                {isExporting || isVideoExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Exporting... {Math.round(exportProgress)}%
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          {(isExporting || isVideoExporting) && (
            <div className="h-1 bg-muted relative">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          )}

          {/* Preview Area */}
          <div
            ref={previewAreaRef}
            className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/50"
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ minHeight: '400px' }}
            >
              {!containerReady ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div
                  className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <CanvasDisplay
                    key={`preview-${canvasKey}`}
                    ref={canvasDisplayRef}
                    template={template}
                    sourceWidth={template?.canvasDimensions?.width || 1920}
                    sourceHeight={template?.canvasDimensions?.height || 1080}
                    uiScale={scale}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default PreviewModal;