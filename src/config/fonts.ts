// src/config/fonts.ts
import { Inter, Montserrat, Poppins, Roboto, Playfair_Display, Oswald, Lato, Raleway, Merriweather, Open_Sans } from 'next/font/google';

// Export the FontConfig type
export interface FontConfig {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  weights: number[];
  styles?: string[];
  variable?: string;
  fallback?: string[];
  googleFont?: boolean;
}

export const fontCategories = {
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'display': 'Display',
  'handwriting': 'Handwriting',
  'monospace': 'Monospace'
} as const;

// Font configurations
export const fontConfigs: FontConfig[] = [
  // Google Fonts
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'var(--font-montserrat)',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    fallback: ['sans-serif'],
    variable: '--font-montserrat',
    googleFont: true
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: 'var(--font-poppins)',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    fallback: ['sans-serif'],
    variable: '--font-poppins',
    googleFont: true
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'var(--font-roboto)',
    category: 'sans-serif',
    weights: [300, 400, 500, 700],
    fallback: ['sans-serif'],
    variable: '--font-roboto',
    googleFont: true
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: 'var(--font-playfair)',
    category: 'serif',
    weights: [400, 500, 600, 700],
    fallback: ['serif'],
    variable: '--font-playfair',
    googleFont: true
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: 'var(--font-oswald)',
    category: 'display',
    weights: [300, 400, 500, 600, 700],
    fallback: ['sans-serif'],
    variable: '--font-oswald',
    googleFont: true
  },
  {
    id: 'lato',
    name: 'Lato',
    family: 'var(--font-lato)',
    category: 'sans-serif',
    weights: [300, 400, 700],
    fallback: ['sans-serif'],
    variable: '--font-lato',
    googleFont: true
  },
  // System fonts
  {
    id: 'arial',
    name: 'Arial',
    family: 'Arial, sans-serif',
    category: 'sans-serif',
    weights: [400, 700],
    fallback: ['sans-serif'],
    googleFont: false
  },
  {
    id: 'times',
    name: 'Times New Roman',
    family: '"Times New Roman", Times, serif',
    category: 'serif',
    weights: [400, 700],
    fallback: ['serif'],
    googleFont: false
  },
  {
    id: 'courier',
    name: 'Courier New',
    family: '"Courier New", Courier, monospace',
    category: 'monospace',
    weights: [400, 700],
    fallback: ['monospace'],
    googleFont: false
  }
];

// Helper function to get font by ID
export const getFontById = (id: string) => 
  fontConfigs.find(font => font.id === id) || fontConfigs[0];

// Get Google Fonts configuration for layout.tsx
export const getGoogleFontsConfig = () => {
  return fontConfigs
    .filter(font => font.googleFont)
    .map(font => ({
      id: font.id,
      name: font.name,
      variable: font.variable!,
      weights: font.weights
    }));
};

// Get unique categories
export const getFontCategories = () => {
  const categories = new Set(fontConfigs.map(font => font.category));
  return Array.from(categories);
};

// Get fonts by category
export const getFontsByCategory = () => {
  return fontConfigs.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, typeof fontConfigs>);
};
