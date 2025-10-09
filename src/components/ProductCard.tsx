'use client';

import { useRouter } from 'next/navigation';
import { IFurniture } from '@/lib/models/Furniture';

interface ProductCardProps {
  product: IFurniture;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString('en-KE')}`;
  };

  const formatDimensions = (dimensions: { width: number; height: number; depth: number }) => {
    return `${dimensions.width}" × ${dimensions.height}" × ${dimensions.depth}"`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group relative">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 rounded-full overflow-hidden">
          {product.inStock ? (
            <span 
              className="text-white px-2 py-1 text-xs font-medium block"
              style={{ 
                backgroundColor: '#10b981', 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              In Stock
            </span>
          ) : (
            <span 
              className="text-white px-2 py-1 text-xs font-medium block"
              style={{ 
                backgroundColor: '#ef4444', 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              Out of Stock
            </span>
          )}
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 rounded-full overflow-hidden">
            <span 
              className="text-white px-2 py-1 text-xs font-medium block"
              style={{ 
                backgroundColor: '#f59e0b', 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              Featured
            </span>
          </div>
        )}

        {/* Quick View Button - Shows on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-0 group-hover:backdrop-blur-sm">
          <button 
            className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium shadow-lg hover:bg-gray-50 transition-colors duration-200 transform translate-y-2 group-hover:translate-y-0"
            onClick={() => router.push(`/products/${product._id}`)}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {product.category}
          </p>
        </div>

        <p className="text-gray-700 text-sm mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.description}
        </p>

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Material:</span>
            <span className="text-gray-900 capitalize">{product.material}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <span className="text-gray-900 capitalize">{product.color}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dimensions:</span>
            <span className="text-gray-900 text-xs">
              {formatDimensions(product.dimensions)}
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-bold text-gray-900 flex-shrink-0">
            {formatPrice(product.price)}
          </div>
          <button 
            onClick={() => router.push(`/products/${product._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
            disabled={!product.inStock}
          >
            {product.inStock ? 'View Details' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
