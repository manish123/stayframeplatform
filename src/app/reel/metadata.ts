import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reel Generator | StayFrame',
  description: 'Create and customize your own video reels with ease.',
};

export function generateViewport() {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
  };
}
