// src/components/quote/ImageSearch.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2, Search } from 'lucide-react';
import Alert from '@/components/feedback/Alert';
import { getRandomMessage } from '@/lib/utils/funMessages';

interface Image {
  id: string;
  urls: { regular: string; small: string; thumb: string };
  user: { name: string; username: string; link: string };
  links: { html: string };
  width: number;
  height: number;
  alt: string;
}

interface ImageSearchProps {
  initialQuery?: string;
  onImageSelect: (imageUrl: string) => void;
  onClose?: () => void;  // Add this line
  supportsImages?: boolean;
  className?: string;
} 


export function ImageSearch({ 
  initialQuery = '', 
  onImageSelect, 
  onClose,
  supportsImages = true,
  className,
}: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [alertState, setAlertState] = useState({
    show: false,
    message: '',
    action: undefined as string | undefined,
    onAction: undefined as (() => void) | undefined,
  });


  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery, 1);
    }
  }, [initialQuery]);

  const performSearch = useCallback(async (query: string, pageNum: number) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setIsSearching(true);
    try {
      const response = await fetch(`/api/v1/images?query=${encodeURIComponent(query)}&page=${pageNum}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(pageNum === 1 ? data.results : prev => [...prev, ...data.results]);
      setPage(pageNum);
      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  const handleImageClick = (imageUrl: string) => {
    if (!supportsImages) {const { message, action } = getRandomMessage('noImage');
    setAlertState({
      show: true,
      message,
      action,
      onAction: () => {
        setAlertState(prev => ({ ...prev, show: false }));
        onClose?.();  // Call onClose if it exists
      }
    });
    return;
  }
  onImageSelect(imageUrl);
};


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) performSearch(searchQuery, 1);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) performSearch(searchQuery, page + 1);
  };

  return (
    <div className={className}>
      {alertState.show && (
        <div className="fixed top-20 right-4 z-[120] w-64 sm:w-72">
          <Alert 
            message={alertState.message} 
            action={alertState.action}
            onAction={alertState.onAction}
            onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
            variant="info"
            className="w-full"
          />
        </div>
      )}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for images..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {isSearching && !isLoading && images.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No images found. Try a different search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => handleImageClick(image.urls.regular)}
                className="group relative aspect-video overflow-hidden rounded-md hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={image.urls.small}
                  alt={image.alt || 'Image'}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20" />
              </button>
            ))}
          </div>

          {hasMore && images.length > 0 && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {images.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Images from{' '}
              <a 
                href="https://unsplash.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Unsplash
              </a>
            </p>
          )}
        </>
      )}
    </div>
  );
}