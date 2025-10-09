'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockTips, tipCategories, getFeaturedTips } from '@/lib/types/tips';
import TipCard from '@/components/TipCard';

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  // Filter and search tips
  const filteredTips = useMemo(() => {
    let tips = mockTips;

    // Filter by category
    if (selectedCategory !== 'all') {
      tips = tips.filter(tip => tip.category.slug === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      tips = tips.filter(tip => 
        tip.title.toLowerCase().includes(searchLower) ||
        tip.excerpt.toLowerCase().includes(searchLower) ||
        tip.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        tip.author.toLowerCase().includes(searchLower)
      );
    }

    // Sort tips
    switch (sortBy) {
      case 'newest':
        tips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        tips.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'read-time':
        tips.sort((a, b) => a.readTime - b.readTime);
        break;
      case 'featured':
        tips.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return tips;
  }, [selectedCategory, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTips = filteredTips.slice(startIndex, startIndex + itemsPerPage);

  const featuredTips = getFeaturedTips();

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
        {featuredTips.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTips.slice(0, 3).map((tip) => (
                <TipCard key={tip.id} tip={tip} />
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
                {tipCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.icon} {category.name}
                  </option>
                ))}
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTips.length} Tips Found
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
                  {tipCategories.find(c => c.slug === selectedCategory)?.name}
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

        {/* Tips Grid */}
        {paginatedTips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
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
