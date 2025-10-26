import { put } from '@vercel/blob';

export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface ImageUploadOptions {
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  folder: 'uploads',
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export async function uploadImage(
  file: File, 
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate file type
  if (!opts.allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`);
  }

  // Validate file size
  if (file.size > opts.maxSize) {
    throw new Error(`File too large. Maximum size: ${Math.round(opts.maxSize / (1024 * 1024))}MB`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${opts.folder}/${timestamp}-${randomString}.${extension}`;

  // Upload to Vercel Blob Storage
  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return {
    url: blob.url,
    filename: filename,
    size: file.size,
    type: file.type,
  };
}

export async function uploadMultipleImages(
  files: File[], 
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

// Utility function to extract filename from URL
export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').pop() || '';
  } catch {
    return '';
  }
}

// Utility function to get image dimensions (for future use)
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}
