'use client';

import Link from 'next/link';
import { categories } from '@/lib/types/categories';

export default function CategoriesPage() {
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
            <li className="text-gray-900 font-medium">Categories</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Furniture Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our complete range of furniture categories, each carefully curated to bring style and functionality to every room in your home.
          </p>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className="relative h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay elements */}
                  <div className="absolute top-3 left-3 text-2xl">{category.icon}</div>
                  <div className="absolute top-3 right-3">
                    {category.featured && (
                      <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {category.productCount} products
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {category.description}
                  </p>
                  <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    View Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
