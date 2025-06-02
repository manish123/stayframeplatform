'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input'; // Note: Case-sensitive import
import { Button } from '@/components/ui/Button';
import { Search, Video as VideoIcon, Loader2 } from 'lucide-react';

interface PexelsVideo {
  id: number;
  url: string;
  video_files: {
    link: string;
    quality: string;
    file_type: string;
    width: number;
    height: number;
  }[];
  video_pictures: {
    picture: string;
  }[];
  user: {
    name: string;
    url: string;
  };
}

export function VideoSelectionModal({
  isOpen,
  onClose,
  onSelectVideo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (videoUrl: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('funny');
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from Pexels
  const fetchVideos = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&size=medium`,
        {
          headers: {
            'Authorization': process.env.NEXT_PUBLIC_PEXELS_API_KEY || '',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isOpen) {
      fetchVideos(searchQuery);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideos(searchQuery);
  };

  const handleSelect = () => {
    if (selectedVideo) {
      onSelectVideo(selectedVideo);
      onClose();
    }
  };

  // Get the best quality video URL
  const getBestQualityVideo = (video: PexelsVideo) => {
    const sortedVideos = [...video.video_files]
      .filter(v => v.quality === 'sd' || v.quality === 'hd')
      .sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    return sortedVideos[0]?.link || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <VideoIcon className="h-6 w-6 mr-2" />
            Select a Video
          </DialogTitle>
          <DialogDescription>
            Search for videos to use in your video meme
          </DialogDescription>
        </DialogHeader>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for videos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => fetchVideos(searchQuery)}>Retry</Button>
          </div>
        )}
        
        {/* Video Grid */}
        {!isLoading && !error && (
          <div className="flex-1 overflow-y-auto">
            {videos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No videos found. Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => {
                  const videoUrl = getBestQualityVideo(video);
                  const thumbnail = video.video_pictures[0]?.picture || '';
                  
                  return (
                    <div
                      key={video.id}
                      className={`relative aspect-video rounded-md overflow-hidden border-2 ${
                        selectedVideo === videoUrl ? 'border-primary ring-2 ring-primary' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedVideo(videoUrl)}
                    >
                      <div className="relative w-full h-full">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <VideoIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-6 w-6 text-white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {selectedVideo === videoUrl && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-sm font-medium truncate">
                          {video.user.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            Videos provided by{' '}
            <a
              href="https://pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Pexels
            </a>
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedVideo}>
              Select Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
