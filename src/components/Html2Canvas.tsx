import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Define the html2canvas options type
type Html2CanvasOptions = {
  scale?: number;
  useCORS?: boolean;
  logging?: boolean;
  scrollX?: number;
  scrollY?: number;
  windowWidth?: number;
  windowHeight?: number;
  // Add other options as needed
};

// Create a type for the html2canvas function
type Html2Canvas = (element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>;

// Dynamic import for html2canvas
const loadHtml2Canvas = async (): Promise<Html2Canvas> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(() => Promise.resolve(document.createElement('canvas'))) as unknown as Promise<Html2Canvas>;
  }
  const mod = await import('html2canvas');
  return mod.default as unknown as Html2Canvas;
};

interface Html2CanvasProps {
  onCapture: (dataUrl: string) => void;
  scale?: number;
  children?: React.ReactNode;
  className?: string;
}

export function Html2Canvas({ 
  onCapture, 
  scale = 0.5, 
  children,
  className = '' 
}: Html2CanvasProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capture = async () => {
      if (!captureRef.current) return;

      try {
        setIsCapturing(true);
        setError(null);

        const html2canvas = await loadHtml2Canvas();
        const canvas = await html2canvas(captureRef.current, {
          scale,
          useCORS: true,
          logging: false,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
        });

        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      } catch (err) {
        console.error('Error capturing with html2canvas:', err);
        setError('Failed to capture screenshot');
      } finally {
        setIsCapturing(false);
      }
    };

    capture();
  }, [onCapture, scale]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isCapturing) {
    return <div>Capturing screenshot...</div>;
  }

  return (
    <div ref={captureRef} className={className}>
      {children}
    </div>
  );
}
