import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Video, X, Loader2, Check, Upload, Link2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  title: string;
  source: 'pexels' | 'upload' | 'url';
}

interface VideoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (videoUrl: string) => void;
}

export function VideoSelectionModal({
  isOpen,
  onClose,
  onSelectVideo,
}: VideoSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pexels' | 'upload' | 'url'>('pexels');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (activeTab === 'pexels' && debouncedSearchQuery) {
      searchVideos(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, activeTab]);

  const searchVideos = async (query: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&orientation=portrait`,
        {
          headers: {
            'Authorization': process.env.NEXT_PUBLIC_PEXELS_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      const formattedVideos = data.videos.map((video: any) => ({
        id: video.id.toString(),
        url: video.video_files.find((f: any) => f.quality === 'sd' && f.file_type === 'video/mp4')?.link || video.video_files[0].link,
        thumbnail: video.image,
        duration: video.duration,
        title: `Video ${video.id}`,
        source: 'pexels' as const,
      }));
      
      setVideos(formattedVideos);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
      setSelectedVideo(URL.createObjectURL(file));
    }
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) !== null;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsUrlValid(validateUrl(url));
  };

  const handleSelect = () => {
    if (activeTab === 'pexels' && selectedVideo) {
      const video = videos.find(v => v.id === selectedVideo);
      if (video) {
        onSelectVideo(video.url);
        onClose();
      }
    } else if (activeTab === 'upload' && uploadedVideo) {
      const videoUrl = URL.createObjectURL(uploadedVideo);
      onSelectVideo(videoUrl);
      onClose();
    } else if (activeTab === 'url' && videoUrl && isUrlValid) {
      onSelectVideo(videoUrl);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>Select a Video</DialogTitle>
          <DialogDescription>
            Search for videos or upload your own
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeTab === 'pexels' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('pexels')}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Pexels
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant={activeTab === 'url' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('url')}
            >
              <Link2 className="h-4 w-4 mr-2" />
              URL
            </Button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'pexels' && (
              <>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for videos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-2">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedVideo === video.id ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
                          }`}
                          onClick={() => setSelectedVideo(video.id)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-white text-sm font-medium truncate">{video.title}</p>
                            <p className="text-white/80 text-xs">{video.duration}s • Pexels</p>
                          </div>
                          {selectedVideo === video.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No videos found. Try a different search term.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'upload' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground mb-4">Drag and drop a video file, or click to browse</p>
                  <Input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                    onChange={handleUpload}
                  />
                  <Button asChild>
                    <label htmlFor="video-upload" className="cursor-pointer">
                      Select Video
                    </label>
                  </Button>
                  {uploadedVideo && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Selected: {uploadedVideo.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-lg space-y-4">
                  <div>
                    <Input
                      type="url"
                      placeholder="Paste video URL (MP4, WebM, etc.)"
                      value={videoUrl}
                      onChange={handleUrlChange}
                      className="w-full"
                    />
                    {videoUrl && !isUrlValid && (
                      <p className="mt-1 text-sm text-destructive">
                        Please enter a valid video URL (MP4, WebM, etc.)
                      </p>
                    )}
                  </div>
                  {isUrlValid && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        controls
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedVideo && !(activeTab === 'upload' && uploadedVideo) && !(activeTab === 'url' && isUrlValid)}
          >
            Select Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
