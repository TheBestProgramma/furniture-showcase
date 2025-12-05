'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { TestimonialsTable } from '@/components/admin/TestimonialsTable';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

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

export default function AdminTestimonialsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTestimonial = () => {
    setSelectedTestimonial(null);
    setView('create');
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setView('edit');
  };

  const handleSaveTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      setLoading(true);

      const url = selectedTestimonial?._id 
        ? `/api/admin/testimonials/${selectedTestimonial._id}`
        : '/api/admin/testimonials';
      
      const method = selectedTestimonial?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the testimonials list
        window.location.reload();
      } else {
        alert('Failed to save testimonial: ' + (data.error || data.message));
        throw new Error(data.error || data.message);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedTestimonial(null);
    setView('list');
  };

  const handleStatusUpdate = (testimonialId: string, newStatus: string) => {
    console.log(`Testimonial ${testimonialId} status updated to ${newStatus}`);
  };

  const handleToggleFeatured = (testimonialId: string, featured: boolean) => {
    console.log(`Testimonial ${testimonialId} featured status: ${featured}`);
  };

  const handleToggleVerified = (testimonialId: string, verified: boolean) => {
    console.log(`Testimonial ${testimonialId} verified status: ${verified}`);
  };

  const renderContent = () => {
    switch (view) {
      case 'create':
      case 'edit':
        return (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Testimonials
              </button>
            </div>
            <TestimonialForm
              testimonial={selectedTestimonial}
              onSave={handleSaveTestimonial}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        );
      case 'list':
      default:
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
              <button
                onClick={handleCreateTestimonial}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Testimonial
              </button>
            </div>
            <TestimonialsTable 
              onStatusUpdate={handleStatusUpdate}
              onToggleFeatured={handleToggleFeatured}
              onToggleVerified={handleToggleVerified}
              onEdit={handleEditTestimonial}
            />
          </div>
        );
    }
  };

  return (
    <AdminPageLayout
      title="Testimonials Management"
      description="View and manage customer testimonials"
      content={renderContent()}
    >
      <></>
    </AdminPageLayout>
  );
}

