'use client';

import { useState, useEffect } from 'react';

interface Tip {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  image: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface TipFormProps {
  tip?: Tip | null;
  onSave: (tipData: Partial<Tip>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const tipCategories = [
  { value: 'furniture-care', label: 'Furniture Care' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'space-planning', label: 'Space Planning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'styling', label: 'Styling' },
  { value: 'buying-guide', label: 'Buying Guide' },
  { value: 'diy', label: 'DIY' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'trends', label: 'Trends' },
  { value: 'general', label: 'General' }
];

export function TipForm({ tip, onSave, onCancel, loading = false }: TipFormProps) {
  const [formData, setFormData] = useState<Partial<Tip>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: [],
    featured: false,
    published: false,
    image: {
      url: '',
      alt: ''
    },
    readTime: 5,
    seoTitle: '',
    seoDescription: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (tip) {
      setFormData({
        ...tip,
        tags: tip.tags || []
      });
    }
  }, [tip]);

  // Calculate read time based on content length
  const calculateReadTime = (content: string): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, Math.min(60, minutes)); // Between 1 and 60 minutes
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'title') {
      // Auto-generate slug from title
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: !tip?._id ? slug : prev.slug // Only auto-generate slug for new tips
      }));
    } else if (name === 'content') {
      // Auto-calculate read time when content changes
      const readTime = calculateReadTime(value);
      setFormData(prev => ({
        ...prev,
        content: value,
        readTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 :
                type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'furniture-showcase/tips');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        image: {
          url: result.data.url,
          alt: prev.image?.alt || '',
          width: result.data.width,
          height: result.data.height
        }
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: {
        url: '',
        alt: ''
      }
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';
    if (!formData.content?.trim() || (formData.content?.trim().length || 0) < 100) {
      newErrors.content = 'Content is required and must be at least 100 characters';
    }
    if (!formData.excerpt?.trim() || (formData.excerpt?.trim().length || 0) > 300) {
      newErrors.excerpt = 'Excerpt is required and must be 300 characters or less';
    }
    if (!formData.author?.trim()) newErrors.author = 'Author is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.image?.url?.trim()) newErrors.image = 'Tip image is required';
    if (!formData.readTime || formData.readTime < 1 || formData.readTime > 60) {
      newErrors.readTime = 'Read time must be between 1 and 60 minutes';
    }

    // Validate slug format
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter tip title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.title?.length || 0}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.slug ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="tip-slug"
              pattern="[a-z0-9-]+"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {tipCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author || ''}
              onChange={handleInputChange}
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Read Time (minutes) *
            </label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime || ''}
              onChange={handleInputChange}
              min="1"
              max="60"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.readTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.readTime && <p className="text-red-500 text-sm mt-1">{errors.readTime}</p>}
            <p className="text-xs text-gray-500 mt-1">Auto-calculated from content length</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleInputChange}
              rows={3}
              maxLength={300}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief description of the tip (max 300 characters)"
            />
            {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt?.length || 0}/300 characters</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content * (Supports Markdown)
          </label>
          <textarea
            name="content"
            value={formData.content || ''}
            onChange={handleInputChange}
            rows={20}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter tip content (supports Markdown formatting)"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.content?.length || 0} characters (minimum 100). Read time: {formData.readTime || 5} minutes
          </p>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tip Image</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {uploadingImage && (
            <p className="text-blue-600 text-sm mt-1">Uploading image...</p>
          )}
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {formData.image?.url && (
          <div className="relative inline-block mb-4">
            <img
              src={formData.image.url}
              alt={formData.image.alt || formData.title || 'Tip image'}
              className="w-64 h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {formData.image?.url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              name="image.alt"
              value={formData.image.alt || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                image: {
                  ...prev.image!,
                  alt: e.target.value
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alternative text for image"
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle || ''}
              onChange={handleInputChange}
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO optimized title"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seoTitle?.length || 0}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription || ''}
              onChange={handleInputChange}
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO meta description"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seoDescription?.length || 0}/160 characters</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Featured Tip</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Published (visible on website)</label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : tip?._id ? 'Update Tip' : 'Create Tip'}
        </button>
      </div>
    </form>
  );
}




