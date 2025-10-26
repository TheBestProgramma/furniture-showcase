'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';

interface CategorySidebarProps {
  currentCategory?: string;
}

export default function CategorySidebar({ currentCategory }: CategorySidebarProps) {
  const pathname = usePathname();
  const { categories, loading, error } = useCategories({
    includeProductCount: true
  });

  // Loading state
  if (loading) {
    return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }

  // Error state
  if (error) {
    return (
      <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-2">Failed to load categories</p>
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      
      <nav className="space-y-2">
        {/* All Products Link */}
        <Link
          href="/products"
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            pathname === '/products'
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="text-lg">🏠</span>
          All Products
        </Link>

        {/* Category Links */}
        {categories && categories.length > 0 && categories.map((category) => (
          <div key={category._id}>
            <Link
              href={`/categories/${category.slug}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentCategory === category.slug
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{category.icon || '📦'}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.productCount || 0}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* No categories found */}
        {(!categories || categories.length === 0) && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No categories available</p>
          </div>
        )}
      </nav>

      {/* Featured Categories Section */}
      {categories && categories.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Featured</h4>
          <div className="space-y-2">
            {categories
              .map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200"
                >
                  <span>{category.icon || '📦'}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}




