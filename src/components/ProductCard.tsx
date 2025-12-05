'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { IFurniture } from '@/lib/models/Furniture';

// Common interface for furniture data (used by both mock data and components)
interface FurnitureData {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | {
    _id: string;
    name: string;
    slug: string;
  };
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
  images: string[] | {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    isPrimary?: boolean;
  }[];
  inStock: boolean;
  featured: boolean;
  onSale?: boolean;
  salePrice?: number;
  tags?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ProductCardProps {
  product: FurnitureData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem, getItemQuantity } = useCartStore();

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString('en-KE')}`;
  };

  const formatDimensions = (dimensions: { width: number; height: number; depth: number }) => {
    return `${dimensions.width}" × ${dimensions.height}" × ${dimensions.depth}"`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group relative">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 group overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any)?.url}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-75"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        {/* Clickable Overlay - Shows on Hover */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          {/* Hover indicator */}
          <div className="transform scale-0 group-hover:scale-100 transition-all duration-300">
            <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {typeof product.category === 'string' ? product.category : product.category.name}
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

        {/* Price and Actions */}
        <div className="space-y-3">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push(`/products/${product._id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!product.inStock}
            >
              {product.inStock ? 'View Details' : 'Unavailable'}
            </button>
            {product.inStock && (
              <button 
                onClick={() => addItem({
                  id: product._id,
                  productId: product._id, // Store the actual product ID
                  name: product.name,
                  price: product.price,
                  color: product.color,
                  image: typeof product.images[0] === 'string' ? product.images[0] : ((product.images[0] as any)?.url || ''),
                  category: typeof product.category === 'string' ? product.category : product.category.name,
                  inStock: product.inStock
                })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Add
              </button>
            )}
          </div>
          {getItemQuantity(product._id) > 0 && (
            <div className="text-sm text-green-600 font-medium">
              {getItemQuantity(product._id)} in cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
