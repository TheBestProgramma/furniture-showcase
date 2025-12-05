'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  _id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
  product?: string;
  verified: boolean;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSave: (testimonialData: Partial<Testimonial>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TestimonialForm({ testimonial, onSave, onCancel, loading = false }: TestimonialFormProps) {
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    location: '',
    rating: 5,
    text: '',
    image: '',
    product: '',
    verified: false,
    featured: false,
    status: 'approved'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        location: testimonial.location || '',
        rating: testimonial.rating || 5,
        text: testimonial.text || '',
        image: testimonial.image || '',
        product: testimonial.product || '',
        verified: testimonial.verified || false,
        featured: testimonial.featured || false,
        status: testimonial.status || 'approved'
      });
    }
  }, [testimonial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'rating') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 5
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (!formData.text?.trim()) {
      newErrors.text = 'Testimonial text is required';
    } else if (formData.text.trim().length < 10) {
      newErrors.text = 'Testimonial text must be at least 10 characters';
    } else if (formData.text.trim().length > 1000) {
      newErrors.text = 'Testimonial text cannot exceed 1000 characters';
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

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Nairobi, Kenya"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Photo URL (Optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to use default avatar</p>
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonial Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating *
            </label>
            <select
              name="rating"
              value={formData.rating || 5}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rating ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
              <option value={4}>4 Stars ⭐⭐⭐⭐☆</option>
              <option value={3}>3 Stars ⭐⭐⭐☆☆</option>
              <option value={2}>2 Stars ⭐⭐☆☆☆</option>
              <option value={1}>1 Star ⭐☆☆☆☆</option>
            </select>
            {formData.rating && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {renderStars(formData.rating)} ({formData.rating}/5)
              </p>
            )}
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimonial Text *
            </label>
            <textarea
              name="text"
              value={formData.text || ''}
              onChange={handleInputChange}
              rows={6}
              maxLength={1000}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.text ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter the customer's testimonial..."
            />
            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {(formData.text || '').length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product (Optional)
            </label>
            <input
              type="text"
              name="product"
              value={formData.product || ''}
              onChange={handleInputChange}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Premium Leather Sofa"
            />
            <p className="text-xs text-gray-500 mt-1">Product the customer purchased (if applicable)</p>
          </div>
        </div>
      </div>

      {/* Status & Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status || 'approved'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Verified Purchase</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Featured Testimonial</label>
            </div>
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
          {loading ? 'Saving...' : testimonial?._id ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
      </div>
    </form>
  );
}

