'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/types/categories';

interface CategorySidebarProps {
  currentCategory?: string;
}

export default function CategorySidebar({ currentCategory }: CategorySidebarProps) {
  const pathname = usePathname();

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
        {categories.map((category) => (
          <div key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentCategory === category.slug
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.productCount}
                  </span>
                </div>
              </div>
            </Link>

            {/* Subcategories */}
            {currentCategory === category.slug && category.subcategories && (
              <div className="ml-6 mt-2 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                    className="block px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Featured Categories Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Featured</h4>
        <div className="space-y-2">
          {categories
            .filter(category => category.featured)
            .map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="flex items-center gap-2 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-200"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

