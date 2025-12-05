'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
  createdAt?: string;
  updatedAt?: string;
}

interface TestimonialsTableProps {
  onStatusUpdate?: (testimonialId: string, newStatus: string) => void;
  onToggleFeatured?: (testimonialId: string, featured: boolean) => void;
  onToggleVerified?: (testimonialId: string, verified: boolean) => void;
  onEdit?: (testimonial: Testimonial) => void;
}

export function TestimonialsTable({ 
  onStatusUpdate, 
  onToggleFeatured, 
  onToggleVerified,
  onEdit
}: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(featuredFilter !== 'all' && { featured: featuredFilter }),
        ...(verifiedFilter !== 'all' && { verified: verifiedFilter }),
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/testimonials?${params}`);
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data.testimonials || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      } else {
        setError(data.error || 'Failed to fetch testimonials');
      }
    } catch (err) {
      setError('Failed to fetch testimonials');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, statusFilter, featuredFilter, verifiedFilter, ratingFilter]);

  const handleStatusUpdate = async (testimonialId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        if (onStatusUpdate) {
          onStatusUpdate(testimonialId, newStatus);
        }
      } else {
        alert('Failed to update testimonial status: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      alert('Failed to update testimonial status');
    }
  };

  const handleToggleFeatured = async (testimonialId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        if (onToggleFeatured) {
          onToggleFeatured(testimonialId, !currentFeatured);
        }
      } else {
        alert('Failed to update featured status: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status');
    }
  };

  const handleToggleVerified = async (testimonialId: string, currentVerified: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified: !currentVerified }),
      });

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        if (onToggleVerified) {
          onToggleVerified(testimonialId, !currentVerified);
        }
      } else {
        alert('Failed to update verified status: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error toggling verified status:', error);
      alert('Failed to update verified status');
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
      } else {
        alert('Failed to delete testimonial: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTestimonials();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, text, product, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Featured</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Verified</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </form>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimonial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {testimonial.image ? (
                          <div className="shrink-0 h-12 w-12 mr-3">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="shrink-0 h-12 w-12 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 font-medium text-lg">
                              {testimonial.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{renderStars(testimonial.rating)}</div>
                      <div className="text-xs text-gray-500">{testimonial.rating}/5</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {testimonial.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {testimonial.product || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={testimonial.status}
                        onChange={(e) => handleStatusUpdate(testimonial._id!, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 ${statusColors[testimonial.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        <option value="pending" className="bg-white">Pending</option>
                        <option value="approved" className="bg-white">Approved</option>
                        <option value="rejected" className="bg-white">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(testimonial._id!, testimonial.featured)}
                          className={`text-xs px-2 py-1 rounded ${
                            testimonial.featured 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={testimonial.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          {testimonial.featured ? '⭐ Featured' : '☆ Feature'}
                        </button>
                        <button
                          onClick={() => handleToggleVerified(testimonial._id!, testimonial.verified)}
                          className={`text-xs px-2 py-1 rounded ${
                            testimonial.verified 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={testimonial.verified ? 'Mark as unverified' : 'Mark as verified'}
                        >
                          {testimonial.verified ? '✓ Verified' : '○ Verify'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(testimonial.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(testimonial)}
                            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(testimonial._id!)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center gap-1 px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center gap-1 px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

