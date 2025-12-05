'use client';

import { useState, useRef } from 'react';
import { uploadImage, ImageUploadResult } from '@/lib/image-upload';

interface ImageUploadProps {
  onUpload: (result: ImageUploadResult) => void;
  onError?: (error: string) => void;
  folder?: string;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  onError, 
  folder = 'uploads',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (disabled || isUploading) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file, { folder, maxSize });
      onUpload(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${isUploading ? 'cursor-wait' : ''}
        `}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Multiple image upload component
interface MultipleImageUploadProps {
  onUpload: (results: ImageUploadResult[]) => void;
  onError?: (error: string) => void;
  folder?: string;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function MultipleImageUpload({
  onUpload,
  onError,
  folder = 'uploads',
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  className = '',
  disabled = false
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(files);
    
    if (fileArray.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      setIsUploading(true);
      const results: ImageUploadResult[] = [];
      
      for (const file of fileArray) {
        const result = await uploadImage(file, { folder, maxSize });
        results.push(result);
      }
      
      onUpload(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${isUploading ? 'cursor-wait' : ''}
        `}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              {dragActive ? 'Drop images here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to {Math.round(maxSize / (1024 * 1024))}MB (max {maxFiles} files)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}







