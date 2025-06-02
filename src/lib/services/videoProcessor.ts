// src/lib/services/videoProcessor.ts
interface ProcessVideoParams {
    videoBlob: Blob;
    onProgress?: (progress: number) => void;
  }
  
  export const processVideo = async ({ 
    videoBlob,
    onProgress 
  }: ProcessVideoParams): Promise<Blob> => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, `recording-${Date.now()}.webm`);
  
      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Video processing failed');
      }
  
      return await response.blob();
    } catch (error) {
      console.error('Video processing error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to process video. Please try again.'
      );
    }
  };