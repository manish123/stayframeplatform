// lib/services/canvasRenderer.ts
import { BaseTemplate, AnyCanvasElement, TextCanvasElement, ImageCanvasElement, VideoCanvasElement } from '@/types/templates';

export interface RenderOptions {
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  // New options for optimization
  maxDimension?: number; // Limit max width/height for file size control
  pixelRatio?: number;   // Control pixel density (1 = standard, 2 = retina)
  compression?: boolean; // Enable compression optimizations
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private loadedImages = new Map<string, HTMLImageElement>();
  private loadedFonts = new Set<string>();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Main render method - this is your single source of truth
   */
  async renderTemplate(template: BaseTemplate, options: RenderOptions = {}): Promise<HTMLCanvasElement> {
    // Use template dimensions or provided dimensions
    let width = options.width || template.canvasDimensions?.width || 1920;
    let height = options.height || template.canvasDimensions?.height || 1080;
    
    // Apply max dimension limit for file size control
    if (options.maxDimension) {
      const maxDim = Math.max(width, height);
      if (maxDim > options.maxDimension) {
        const scale = options.maxDimension / maxDim;
        width *= scale;
        height *= scale;
      }
    }
    
    const pixelRatio = options.pixelRatio || 1;
    const scale = (options.scale || 1) * pixelRatio;
    
    // Setup canvas
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    
    // Scale context for high DPI
    if (pixelRatio !== 1) {
      this.ctx.scale(pixelRatio, pixelRatio);
    }
    
    // Apply quality settings for compression
    if (options.compression) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'medium'; // vs 'high'
    } else {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    
    // Clear and set background
    this.ctx.fillStyle = options.backgroundColor || template.canvasBackgroundColor || '#ffffff';
    this.ctx.fillRect(0, 0, width, height);
    
    // Pre-load all assets
    await this.preloadAssets(template.elements);
    
    // Sort elements by z-index for proper layering
    const sortedElements = [...template.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    // Render each element
    for (const element of sortedElements) {
      await this.renderElement(element);
    }
    
    return this.canvas;
  }

  private async preloadAssets(elements: AnyCanvasElement[]): Promise<void> {
    const imagePromises: Promise<void>[] = [];
    const fontPromises: Promise<void>[] = [];

    for (const element of elements) {
      // Preload images
      if (element.type === 'image' && 'src' in element && element.src) {
        if (!this.loadedImages.has(element.src)) {
          imagePromises.push(this.loadImage(element.src));
        }
      }

      // Preload fonts
      if ((element.type === 'text' || element.type === 'watermark') && 'fontFamily' in element && element.fontFamily) {
        const fontKey = element.fontFamily;
        if (!this.loadedFonts.has(fontKey)) {
          fontPromises.push(this.loadFont(element.fontFamily, element.fontWeight, element.fontStyle));
        }
      }
    }

    await Promise.all([...imagePromises, ...fontPromises]);
  }

  private async loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS
      img.onload = () => {
        this.loadedImages.set(src, img);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        resolve(); // Don't fail the entire render for one image
      };
      img.src = src;
    });
  }

  private async loadFont(fontFamily: string, fontWeight?: string, fontStyle?: string): Promise<void> {
    const fontKey = `${fontStyle || 'normal'} ${fontWeight || 'normal'} 16px ${fontFamily}`;
    
    try {
      // Try to load the font
      await document.fonts.load(fontKey);
      this.loadedFonts.add(fontFamily);
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily}`);
      // Fallback fonts will be used automatically by the browser
    }
  }

  private async renderElement(element: AnyCanvasElement): Promise<void> {
    this.ctx.save();
    
    // Apply common transformations
    this.applyTransforms(element);
    
    // Apply opacity
    if (element.opacity !== undefined) {
      this.ctx.globalAlpha = element.opacity;
    }

    // Render based on element type
    switch (element.type) {
      case 'text':
      case 'watermark':
        this.renderTextElement(element as TextCanvasElement);
        break;
      case 'image':
        await this.renderImageElement(element as ImageCanvasElement);
        break;
      case 'video':
        // For static export, render video thumbnail or first frame
        await this.renderVideoElement(element as VideoCanvasElement);
        break;
    }
    
    this.ctx.restore();
  }

  private applyTransforms(element: AnyCanvasElement): void {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    // Move to center for rotation
    this.ctx.translate(centerX, centerY);
    
    // Apply rotation
    if (element.rotation) {
      this.ctx.rotate((element.rotation * Math.PI) / 180);
    }
    
    // Move back
    this.ctx.translate(-centerX, -centerY);
  }

  private renderTextElement(element: TextCanvasElement): void {
    if (!('content' in element) || !element.content) return;

    // Set font properties
    const fontSize = element.fontSize || 16;
    const fontWeight = element.fontWeight || 'normal';
    const fontStyle = element.fontStyle || 'normal';
    const fontFamily = element.fontFamily || 'Arial, sans-serif';
    
    this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = element.color || '#000000';
    this.ctx.textBaseline = 'top';

    // Handle text alignment
    const textAlign = element.textAlign || 'left';
    this.ctx.textAlign = 'left'; // Always use left for wrapping calculation

    const lineHeight = fontSize * (element.lineHeight || 1.2);
    const maxWidth = element.width - 8; // Padding similar to CSS
    
    // Get wrapped lines
    const wrappedLines = this.wrapText(element.content, maxWidth);
    
    // Calculate vertical positioning
    const totalTextHeight = wrappedLines.length * lineHeight;
    const availableHeight = element.height - 8; // Account for padding
    const startY = element.y + Math.max(4, (availableHeight - totalTextHeight) / 2);

    // Render each line with proper alignment
    wrappedLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      let x = element.x + 4; // Left padding

      // Apply text alignment
      if (textAlign === 'center') {
        const lineWidth = this.ctx.measureText(line).width;
        x = element.x + (element.width - lineWidth) / 2;
      } else if (textAlign === 'right') {
        const lineWidth = this.ctx.measureText(line).width;
        x = element.x + element.width - lineWidth - 4; // Right padding
      }

      this.ctx.fillText(line, x, y);
    });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = this.ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  private async renderImageElement(element: ImageCanvasElement): Promise<void> {
    if (!('src' in element) || !element.src) return;

    const img = this.loadedImages.get(element.src);
    if (!img) return;

    // Calculate object-fit behavior
    const objectFit = element.objectFit || 'cover';
    const { sx, sy, sw, sh, dx, dy, dw, dh } = this.calculateObjectFit(
      img.naturalWidth,
      img.naturalHeight,
      element.x,
      element.y,
      element.width,
      element.height,
      objectFit
    );

    this.ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  private async renderVideoElement(element: VideoCanvasElement): Promise<void> {
    // For static export, you might want to render a thumbnail or placeholder
    // This is a simplified implementation
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(element.x, element.y, element.width, element.height);
    
    // Add play icon or "VIDEO" text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      'VIDEO',
      element.x + element.width / 2,
      element.y + element.height / 2
    );
  }

  private calculateObjectFit(
    imgWidth: number,
    imgHeight: number,
    destX: number,
    destY: number,
    destWidth: number,
    destHeight: number,
    objectFit: string
  ) {
    const imgAspectRatio = imgWidth / imgHeight;
    const destAspectRatio = destWidth / destHeight;

    let sx = 0, sy = 0, sw = imgWidth, sh = imgHeight;
    let dx = destX, dy = destY, dw = destWidth, dh = destHeight;

    if (objectFit === 'cover') {
      if (imgAspectRatio > destAspectRatio) {
        // Image is wider, crop horizontally
        sw = imgHeight * destAspectRatio;
        sx = (imgWidth - sw) / 2;
      } else {
        // Image is taller, crop vertically
        sh = imgWidth / destAspectRatio;
        sy = (imgHeight - sh) / 2;
      }
    } else if (objectFit === 'contain') {
      if (imgAspectRatio > destAspectRatio) {
        // Image is wider, fit width
        dh = destWidth / imgAspectRatio;
        dy = destY + (destHeight - dh) / 2;
      } else {
        // Image is taller, fit height
        dw = destHeight * imgAspectRatio;
        dx = destX + (destWidth - dw) / 2;
      }
    }

    return { sx, sy, sw, sh, dx, dy, dw, dh };
  }

  // Export methods
  toDataURL(format: string = 'image/png', quality?: number): string {
    return this.canvas.toDataURL(format, quality);
  }

  toBlob(callback: BlobCallback, format?: string, quality?: number): void {
    this.canvas.toBlob(callback, format, quality);
  }

  async toBlobAsync(format?: string, quality?: number): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, format, quality);
    });
  }

  // Cleanup
  dispose(): void {
    this.loadedImages.clear();
    this.loadedFonts.clear();
  }
}

// Usage in your PreviewModal
export const createCanvasFromTemplate = async (
  template: BaseTemplate,
  options: RenderOptions = {}
): Promise<HTMLCanvasElement> => {
  const renderer = new CanvasRenderer();
  try {
    return await renderer.renderTemplate(template, options);
  } finally {
    renderer.dispose();
  }
};