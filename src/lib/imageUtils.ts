/**
 * Compresses an image file to reduce its size while maintaining a reasonable quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A promise that resolves to the compressed image as a Blob
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas with new dimensions
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Apply white background for transparent images when converting to JPEG
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            resolve(blob);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Set image source to the file data
      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    // Read the file as data URL
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Blob to a base64 string
 * @param blob - The blob to convert
 * @returns A promise that resolves to the base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a base64 string to a Blob
 * @param base64 - The base64 string to convert
 * @param mimeType - The MIME type of the resulting Blob
 * @returns The Blob object
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays: Uint8Array[] = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
}

/**
 * Gets the dimensions of an image file
 * @param file - The image file
 * @returns A promise that resolves to an object with width and height
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    const url = URL.createObjectURL(file);
    img.src = url;
    
    // Clean up
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
}

/**
 * Gets the file extension from a file name or path
 * @param filename - The file name or path
 * @returns The file extension in lowercase (without the dot)
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Gets the MIME type from a file extension
 * @param extension - The file extension (with or without dot)
 * @returns The corresponding MIME type or 'application/octet-stream' if unknown
 */
export function getMimeType(extension: string): string {
  const ext = extension.startsWith('.') ? extension.substring(1) : extension;
  
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    
    // Video
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };
  
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

/**
 * Validates if a file type is allowed
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types or file extensions (e.g., ['image/jpeg', '.png'])
 * @returns boolean indicating if the file type is allowed
 */
export function isFileTypeAllowed(file: File, allowedTypes: string[]): boolean {
  if (!allowedTypes.length) return true;
  
  const fileExtension = getFileExtension(file.name);
  const fileType = file.type || getMimeType(fileExtension);
  
  return allowedTypes.some(type => {
    // If type starts with a dot, it's an extension
    if (type.startsWith('.')) {
      return fileExtension === type.substring(1).toLowerCase();
    }
    
    // Otherwise, it's a MIME type
    return fileType === type;
  });
}

/**
 * Validates if a file size is within the allowed limit
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes
 * @returns boolean indicating if the file size is within the limit
 */
export function isFileSizeValid(file: File, maxSizeInMB: number): boolean {
  return file.size <= maxSizeInMB * 1024 * 1024;
}
