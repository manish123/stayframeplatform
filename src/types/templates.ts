// src/types/templates.ts

export type TemplateType = 'static' | 'animated';
export type AppType = 'quote' | 'meme' | 'reel';
export type ElementType = 'text' | 'image' | 'video' | 'shape' | 'audio' | 'watermark';

// Common properties for all elements on the canvas
export interface CanvasElement {
  id: string;          // Unique ID for this element instance within the template
  name: string;        // User-friendly name (e.g., "Headline", "Background Image")
  type: ElementType;
  x: number;           // Position from left (percentage or pixels - decide on unit)
  y: number;           // Position from top (percentage or pixels)
  width: number;       // (percentage or pixels)
  height: number;      // (percentage or pixels)
  rotation?: number;    // Degrees
  opacity?: number;     // 0-1
  locked?: boolean;     // If true, user cannot move/resize/delete initially
  zIndex?: number;      // Stacking order
  // blendMode?: string; // For future consideration
}

export interface TextElementProperties {
  content: string;
  fontFamily: string;
  fontSize: number; // in pixels (ensure consistency with canvasDimensions)
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  color: string; // hex, rgba, etc.
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number; // e.g., 1.5 (for 150% of fontSize)
  letterSpacing?: number; // in pixels or em
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: string; // Added textShadow as an optional property
  // textShadow?: {offsetX: number, offsetY: number, blurRadius: number, color: string}; // Future
}
export interface TextCanvasElement extends CanvasElement, TextElementProperties {
  type: 'text';
}

export interface ImageElementProperties {
  src?: string; // URL or placeholder identifier for user upload
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // filters?: { blur?: number, brightness?: number, contrast?: number, saturate?: number }; // Future
}
export interface ImageCanvasElement extends CanvasElement, ImageElementProperties {
  type: 'image';
}

export interface VideoElementProperties {
  src?: string; // URL or placeholder for user upload
  startTime?: number; // seconds, for trimming
  endTime?: number; // seconds, for trimming
  volume?: number; // 0-1
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean; // Added for video controls
  muted?: boolean;    // Added for video mute state
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  // posterImage?: string; // Image to show before video loads or for static preview
}
export interface VideoCanvasElement extends CanvasElement, VideoElementProperties {
  type: 'video';
}

export interface ShapeElementProperties {
  shapeType: 'rectangle' | 'circle' | 'ellipse' | 'line' | 'triangle' | 'star' | string; // string for custom SVG paths later?
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  // For rectangle:
  cornerRadius?: number;
  // For star (example properties):
  // numPoints?: number;
  // innerRadius?: number;
  // outerRadius?: number;
}
export interface ShapeCanvasElement extends CanvasElement {
  type: 'shape';
  props?: ShapeElementProperties; // Shape properties are now nested under 'props'
}

// Placeholder for Audio specific properties (can be detailed later)
export interface AudioElementProperties {
  src?: string; // URL
  volume?: number; // 0-1
  loop?: boolean;
  // startTime?: number;
  // endTime?: number;
}
export interface AudioCanvasElement extends CanvasElement, AudioElementProperties {
  type: 'audio';
}

export interface WatermarkCanvasElement extends Omit<TextCanvasElement, 'type' | 'name'> {
  type: 'watermark';
  name: 'Watermark'; // Watermarks will typically have a fixed name internally
  // isSystemLocked?: boolean; // Optional: True for "Powered by StayFrame.fyi" for free users
                               // Pro users could change content, making it not "system locked"
}

// Union type for any element that can be on the canvas
export type AnyCanvasElement =
  | TextCanvasElement
  | ImageCanvasElement
  | VideoCanvasElement
  | ShapeCanvasElement
  | AudioCanvasElement
  | WatermarkCanvasElement;

// Basic structure for canvas dimensions
export interface CanvasDimensions {
  width: number;
  height: number;
  rotation?: number; // Optional rotation in degrees
}

export interface TemplateFeatures {
  supportsVideos?: boolean;
  supportsImages?: boolean;
  supportsText: boolean;
  maxTextElements: number;
  [key: string]: any;
}

export interface BaseTemplate {
  id: string;                      // Unique ID for the template
  name: string;                    // User-friendly name
  type: TemplateType;              // static or animated
  appType: AppType;                // quote, meme, reel
  category: string;                // e.g., "Social Media Post", "Instagram Story"
  features?: string[];             // Array of feature strings for filtering
  aspectRatio: string;             // e.g., "1:1", "16:9", "9:16"
  canvasDimensions: CanvasDimensions; // Width and height in pixels
  canvasBackgroundColor?: string;   // Default background color for the canvas
  elements: AnyCanvasElement[];     // Array of elements on the canvas
  tags?: string[];                  // For search and categorization
  previewImageUrl?: string;         // URL to a preview image for the template
  createdBy?: 'system' | string;    // 'system' for built-in templates, user ID for custom
  version?: number;                 // Version number for updates
  description?: string;             // Optional description
  lastModified?: string;            // ISO date string
  supportedFeatures: TemplateFeatures; // What features this template supports
}

// For now, all templates can use BaseTemplate.
// We can create specific QuoteTemplate, MemeTemplate etc. if they diverge significantly later.
export type AnyTemplate = BaseTemplate;
