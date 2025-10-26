'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTips, Tip } from '@/hooks/useTips';
import TipCard from '@/components/TipCard';
import TipGridSkeleton from '@/components/TipGridSkeleton';

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  // Fetch tips from API
  const { tips, loading, error, pagination, refetch } = useTips({
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm || undefined,
    featured: undefined,
    published: true,
    sortBy: sortBy === 'newest' ? 'publishedAt' : sortBy === 'oldest' ? 'publishedAt' : sortBy === 'read-time' ? 'readTime' : 'featured',
    sortOrder: sortBy === 'oldest' ? 'asc' : 'desc'
  });

  // Fetch featured tips
  const { tips: featuredTips, loading: featuredLoading } = useTips({
    featured: true,
    limit: 3,
    published: true,
    sortBy: 'featured',
    sortOrder: 'desc'
  });

  // Debug logging
  console.log('Tips page state:', { tips, loading, error, pagination });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the tips section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Tips & Guides</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tips & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover expert advice, maintenance tips, and styling ideas to make the most of your furniture and home.
          </p>
        </div>

        {/* Featured Tips Section */}
        {featuredLoading && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tips</h2>
            <TipGridSkeleton count={3} columns={3} />
          </div>
        )}

        {!featuredLoading && featuredTips && featuredTips.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTips.map((tip) => (
                <TipCard key={tip._id} tip={tip} />
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500" style={{ lineHeight: 0 }}>
                <input
                  type="text"
                  placeholder="Search tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-0 rounded-md focus:outline-none bg-transparent"
                  style={{ lineHeight: 'normal' }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ lineHeight: 'normal' }}
              >
                <option value="all">All Categories</option>
                <option value="maintenance">🧽 Maintenance</option>
                <option value="styling">🎨 Styling</option>
                <option value="care">💡 Care Tips</option>
                <option value="organization">📦 Organization</option>
                <option value="cleaning">✨ Cleaning</option>
                <option value="repair">🔧 Repair</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ lineHeight: 'normal' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="read-time">Quick Reads</option>
                <option value="featured">Featured</option>
              </select>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || searchTerm || sortBy !== 'newest') && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading tips</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6 space-y-4">
              <button
                onClick={refetch}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <div className="text-xs text-gray-500">
                <p>If the error persists, please check:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Database connection is working</li>
                  <li>• Tips are seeded (run: npm run seed-tips)</li>
                  <li>• Development server is running</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <TipGridSkeleton count={itemsPerPage} columns={3} />
        )}

        {/* Results Header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {pagination ? `${pagination.totalCount} Tips Found` : 'Loading...'}
            </h2>
            {(selectedCategory !== 'all' || searchTerm) && (
              <div className="text-sm text-gray-600">
                {selectedCategory !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 mr-2 inline-block"
                    style={{ 
                      borderRadius: '9999px',
                      border: 'none', 
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 inline-block"
                    style={{ 
                      borderRadius: '9999px',
                      border: 'none', 
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    "{searchTerm}"
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tips Grid */}
        {!loading && !error && tips && tips.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tips.map((tip) => (
                <TipCard key={tip._id} tip={tip} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Tips Found */}
        {!loading && !error && tips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tips found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
