'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, X, Upload, Link2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  searchTerm?: string;
  initialSearch?: string;
  supportsImages?: boolean;
}

type ImageSource = 'unsplash' | 'upload' | 'url';

export function ImageSelectionModal({
  isOpen,
  onClose,
  onSelect,
  searchTerm = '',
  initialSearch = '',
  supportsImages = true,
}: ImageSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [activeTab, setActiveTab] = useState<ImageSource>('unsplash');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasInitialSearch, setHasInitialSearch] = useState(false);

  // Handle initial search when modal opens with an initialSearch term
  useEffect(() => {
    if (isOpen && initialSearch && !hasInitialSearch) {
      setSearchQuery(initialSearch);
      setActiveTab('unsplash');
      searchImages(initialSearch);
      setHasInitialSearch(true);
    } else if (!isOpen) {
      setHasInitialSearch(false);
    }
  }, [isOpen, initialSearch, hasInitialSearch]);

  // Tab navigation
  const tabs: { id: ImageSource; label: string; icon: React.ReactNode }[] = [
    { id: 'unsplash', label: 'Search', icon: <Search className="h-4 w-4 mr-2" /> },
    { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4 mr-2" /> },
    { id: 'url', label: 'URL', icon: <Link2 className="h-4 w-4 mr-2" /> },
  ];

  // Handle image selection
  const handleSelect = (url: string) => {
    setSelectedImage(url);
    onSelect(url);
    onClose();
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(file);
      handleSelect(url);
    }
  };

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    // Simple URL validation
    const isValid = url.match(/^https?:\/\/.+\..+/) !== null;
    setIsUrlValid(isValid);
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    if (isUrlValid) {
      handleSelect(imageUrl);
    }
  };

  // Handle search button click
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    searchImages();
  };

  // Search for images (mock implementation - replace with actual API call)
  const searchImages = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      // Replace with actual API call to Unsplash or your image service
      const response = await fetch(`/api/v1/images?query=${encodeURIComponent(searchTerm)}&page=1`);
      const data = await response.json();
      setImages(data.results || []);
      setPage(1);
      setHasMore(!!data.total_pages && 1 < data.total_pages);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more images for pagination
  const loadMoreImages = async () => {
    if (!searchQuery.trim() || !hasMore || isLoading) return;
    
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      // Replace with actual API call
      const response = await fetch(`/api/v1/images?query=${encodeURIComponent(searchQuery)}&page=${nextPage}`);
      const data = await response.json();
      setImages(prev => [...prev, ...(data.results || [])]);
      setPage(nextPage);
      setHasMore(nextPage < (data.total_pages || 1));
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Select Image</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Choose an image from Unsplash, upload your own, or paste an image URL
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <DialogPrimitive.Close>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-border px-6">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                className={cn(
                  'rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'unsplash' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for images..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchImages()}
                  />
                  <Button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4" 
                    onClick={handleSearchClick}
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {isLoading && images.length === 0 ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Searching for images...</p>
                    </div>
                  </div>
                ) : images.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <button
                          key={image.id}
                          onClick={() => handleSelect(image.urls.regular)}
                          className="group relative aspect-square overflow-hidden rounded-md border border-border hover:border-primary transition-colors"
                        >
                          <img
                            src={image.urls.small}
                            alt={image.alt_description || 'Image'}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors" />
                        </button>
                      ))}
                    </div>
                    {hasMore && (
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          onClick={loadMoreImages}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
                    <p>Search for images above</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop an image here, or click to select a file
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Image
                  </label>
                </Button>
                {uploadedImage && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {uploadedImage.name}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Paste the URL of an image
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUrlSubmit}
                      disabled={!isUrlValid}
                    >
                      Use Image
                    </Button>
                  </div>
                  {!isUrlValid && imageUrl && (
                    <p className="text-sm text-destructive">
                      Please enter a valid URL starting with http:// or https://
                    </p>
                  )}
                </div>
                {isUrlValid && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden border border-border">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          // Handle image loading error
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
