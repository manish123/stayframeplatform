// src/config/canvasPresets.ts

export interface CanvasPreset {
  name: string;
  width: number;
  height: number;
  aspectRatioLabel: string; // e.g., "1:1", "16:9", "Custom"
  icon?: string; // Optional: for displaying an icon next to the preset name
}

export const canvasPresets: CanvasPreset[] = [
  {
    name: 'Custom Dimensions',
    width: 0, // Will be set by user or current template
    height: 0, // Will be set by user or current template
    aspectRatioLabel: 'Custom',
  },
  {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1 (Square)',
    // icon: 'instagram'
  },
  {
    name: 'Instagram Story / Reel',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16 (Portrait)',
    // icon: 'instagram'
  },
  {
    name: 'Instagram Landscape',
    width: 1080,
    height: 566,
    aspectRatioLabel: '1.91:1 (Landscape)',
    // icon: 'instagram'
  },
  {
    name: 'X (Twitter) Post Image',
    width: 1600, // Recommended for single image, can be 1:1 too
    height: 900,
    aspectRatioLabel: '16:9 (Landscape)',
    // icon: 'twitter'
  },
  {
    name: 'X (Twitter) Profile Header',
    width: 1500,
    height: 500,
    aspectRatioLabel: '3:1 (Landscape)',
    // icon: 'twitter'
  },
  {
    name: 'Facebook Post (Square)',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1 (Square)',
    // icon: 'facebook'
  },
  {
    name: 'Facebook Post (Landscape)',
    width: 1200,
    height: 630,
    aspectRatioLabel: '1.91:1 (Landscape)',
    // icon: 'facebook'
  },
  {
    name: 'Facebook Story',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16 (Portrait)',
    // icon: 'facebook'
  },
  {
    name: 'LinkedIn Post (Landscape)',
    width: 1200,
    height: 627,
    aspectRatioLabel: '1.91:1 (Landscape)',
    // icon: 'linkedin'
  },
  {
    name: 'LinkedIn Post (Square)',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1 (Square)',
    // icon: 'linkedin'
  },
  {
    name: 'Pinterest Pin',
    width: 1000,
    height: 1500,
    aspectRatioLabel: '2:3 (Portrait)',
    // icon: 'pinterest'
  },
  {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9 (Landscape)',
    // icon: 'youtube'
  },
  {
    name: 'Default Wide (16:9)',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
  },
  {
    name: 'Default Tall (9:16)',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
  },
  {
    name: 'Default Square (1:1)',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
  },
];

export const DEFAULT_CANVAS_WIDTH = 1280;
export const DEFAULT_CANVAS_HEIGHT = 720;
