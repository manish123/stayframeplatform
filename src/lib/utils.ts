import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Font utilities
interface Font {
  family: string;
}

function getFontById(fontId: string): Font | undefined {
  // TO DO: implement font retrieval logic
  // For demonstration purposes, return a mock font
  return { family: "Arial" };
}

export function applyFontStyle(fontId: string, element: HTMLElement) {
  const font = getFontById(fontId);
  if (font) {
    element.style.fontFamily = font.family;
    // Apply any additional font styles here
  }
}

// For React components
import React from 'react';

export function getFontStyle(fontId: string): React.CSSProperties {
  const font = getFontById(fontId);
  return font ? { fontFamily: font.family } : {};
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
