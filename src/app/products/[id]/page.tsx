'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import { IFurniture } from '@/lib/models/Furniture';
import { useCartStore } from '@/store/cartStore';

// Common interface for furniture data (used by both mock data and components)
interface FurnitureData {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock furniture data (same as in products page)
const mockFurniture: FurnitureData[] = [
  {
    _id: '1',
    name: 'Modern Leather Sofa',
    description: 'A comfortable and stylish leather sofa perfect for any living room. Features premium leather upholstery and sturdy wooden frame.',
    price: 195000,
    category: 'sofa',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'
    ],
    dimensions: { width: 84, height: 34, depth: 36 },
    material: 'leather',
    color: 'brown',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Oak Dining Table',
    description: 'Beautiful solid oak dining table that seats 6 people comfortably. Handcrafted with attention to detail and durability.',
    price: 135000,
    category: 'table',
    images: [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    dimensions: { width: 72, height: 30, depth: 36 },
    material: 'wood',
    color: 'oak',
    inStock: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Ergonomic Office Chair',
    description: 'High-quality ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.',
    price: 45000,
    category: 'chair',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'
    ],
    dimensions: { width: 24, height: 40, depth: 24 },
    material: 'mixed',
    color: 'black',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'King Size Bed Frame',
    description: 'Elegant king size bed frame with built-in storage drawers. Made from sustainable materials and designed for modern bedrooms.',
    price: 240000,
    category: 'bed',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    dimensions: { width: 80, height: 24, depth: 84 },
    material: 'wood',
    color: 'white',
    inStock: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    name: 'Glass Coffee Table',
    description: 'Modern glass coffee table with metal legs. Adds elegance and sophistication to any living space.',
    price: 67500,
    category: 'table',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    dimensions: { width: 48, height: 18, depth: 24 },
    material: 'glass',
    color: 'clear',
    inStock: false,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6',
    name: 'Bookshelf Unit',
    description: '5-tier bookshelf unit perfect for organizing books, decor, and storage. Made from engineered wood with a clean finish.',
    price: 30000,
    category: 'shelf',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800'
    ],
    dimensions: { width: 30, height: 72, depth: 12 },
    material: 'wood',
    color: 'walnut',
    inStock: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '7',
    name: 'Executive Desk',
    description: 'Spacious executive desk with multiple drawers and cable management. Perfect for home offices and professional workspaces.',
    price: 120000,
    category: 'desk',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    dimensions: { width: 60, height: 30, depth: 30 },
    material: 'wood',
    color: 'mahogany',
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '8',
    name: 'Storage Cabinet',
    description: 'Multi-purpose storage cabinet with adjustable shelves and soft-close doors. Great for organizing various items.',
    price: 52500,
    category: 'cabinet',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    dimensions: { width: 36, height: 72, depth: 18 },
    material: 'wood',
    color: 'gray',
    inStock: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Available colors for each product (mock data)
const availableColors = {
  '1': ['brown', 'black', 'tan'],
  '2': ['oak', 'walnut', 'cherry'],
  '3': ['black', 'gray', 'blue'],
  '4': ['white', 'oak', 'walnut'],
  '5': ['clear', 'tinted'],
  '6': ['walnut', 'oak', 'white'],
  '7': ['mahogany', 'oak', 'walnut'],
  '8': ['gray', 'white', 'oak']
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<FurnitureData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartFeedback, setCartFeedback] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = mockFurniture.find(p => p._id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.color);
    } else {
      // Product not found, redirect to products page
      router.push('/products');
    }
    setLoading(false);
  }, [params.id, router]);

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString('en-KE')}`;
  };

  const formatDimensions = (dimensions: { width: number; height: number; depth: number }) => {
    return `${dimensions.width}" × ${dimensions.height}" × ${dimensions.depth}"`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add to cart using Zustand store
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product._id}-${selectedColor}`,
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: product.images[0],
        category: product.category,
        inStock: product.inStock
      });
    }
    
    // Show success feedback
    setCartFeedback({
      show: true,
      message: `${quantity} × ${product.name} added to cart!`,
      type: 'success'
    });
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setCartFeedback({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleBuyNow = () => {
    // Buy now functionality
    console.log('Buy now:', {
      product: product?.name,
      quantity,
      color: selectedColor,
      price: product?.price
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productColors = availableColors[product._id as keyof typeof availableColors] || [product.color];

  // Get related products (same category, excluding current product)
  const relatedProducts = mockFurniture
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Feedback Notification */}
      {cartFeedback.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            cartFeedback.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {cartFeedback.type === 'success' ? (
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">{cartFeedback.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => router.push('/products')}
                className="hover:text-gray-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => router.push(`/products?category=${product.category}`)}
                className="hover:text-gray-700 capitalize"
              >
                {product.category}
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Information */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                {product.featured && (
                  <span 
                    className="text-white px-2 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: '#f59e0b' }}
                  >
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">{product.name}</h1>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <span 
                  className="text-white px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: '#10b981' }}
                >
                  In Stock
                </span>
              ) : (
                <span 
                  className="text-white px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Material:</span>
                  <p className="text-gray-900 capitalize">{product.material}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Dimensions:</span>
                  <p className="text-gray-900">{formatDimensions(product.dimensions)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <p className="text-gray-900 capitalize">{product.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Weight Capacity:</span>
                  <p className="text-gray-900">Up to 200kg</p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {productColors.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Colors</h3>
                <div className="flex gap-3">
                  {productColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="capitalize">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-blue-600 text-white py-3 px-4 lg:px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm lg:text-base"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-gray-900 text-white py-3 px-4 lg:px-6 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm lg:text-base"
              >
                {product.inStock ? 'Buy Now' : 'Unavailable'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Shipping & Returns</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free delivery within Nairobi</li>
                <li>• 30-day return policy</li>
                <li>• Assembly service available</li>
                <li>• 2-year warranty included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
              <p className="text-gray-600">You might also like these {product.category}s</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2 rounded-full overflow-hidden">
                      {relatedProduct.inStock ? (
                        <span 
                          className="text-white px-2 py-1 text-xs font-medium block"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          In Stock
                        </span>
                      ) : (
                        <span 
                          className="text-white px-2 py-1 text-xs font-medium block"
                          style={{ backgroundColor: '#ef4444' }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">
                      {relatedProduct.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">
                        KSh {relatedProduct.price.toLocaleString('en-KE')}
                      </div>
                      <button 
                        onClick={() => router.push(`/products/${relatedProduct._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
