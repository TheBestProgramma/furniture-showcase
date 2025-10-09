'use client';

import { Category } from '@/lib/types/categories';

interface CategoryBannerProps {
  category: Category;
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Left side - Category info */}
        <div className="flex items-center gap-4">
          <div className="text-4xl">{category.icon}</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {category.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {category.productCount} Products
              </span>
              {category.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Description */}
        <div className="hidden md:block max-w-md">
          <p className="text-gray-600 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Mobile description */}
      <div className="md:hidden mt-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {category.description}
        </p>
      </div>
    </div>
  );
}
