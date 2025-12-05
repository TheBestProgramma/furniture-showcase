'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/store/cartStore';

// Product interface matching database schema
interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string | {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: string;
  images: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    isPrimary?: boolean;
  }[] | string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    weight?: number;
  };
  material: string | string[];
  color: string;
  brand?: string;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  onSale?: boolean;
  discountPercentage?: number;
  tags?: string[];
  specifications?: {
    [key: string]: string | number;
  };
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartFeedback, setCartFeedback] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productId = params.id as string;

        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (data.success && data.data.product) {
          const productData = data.data.product;
          setProduct(productData);
          setSelectedColor(productData.color || '');
          
          // Set related products if available
          if (data.data.relatedProducts) {
            setRelatedProducts(data.data.relatedProducts);
          }
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString('en-KE')}`;
  };

  const formatDimensions = (dimensions: { width: number; height: number; depth: number }) => {
    return `${dimensions.width}" × ${dimensions.height}" × ${dimensions.depth}"`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get image URL (handle both string and object formats)
    const getImageUrl = (image: any): string => {
      if (typeof image === 'string') return image;
      if (typeof image === 'object' && image.url) return image.url;
      return '/images/placeholder.jpg';
    };

    const firstImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/images/placeholder.jpg';
    
    // Get category name
    const categoryName = typeof product.category === 'string' 
      ? product.category 
      : product.category?.name || 'other';
    
    // Add to cart using Zustand store
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product._id}-${selectedColor}`,
        productId: product._id, // Store the actual product ID
        name: product.name,
        price: product.price,
        color: selectedColor,
        image: getImageUrl(firstImage),
        category: categoryName,
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

  if (error || (!loading && !product)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
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

  if (!product) {
    return null;
  }

  // Get available colors - use tags or default to product color
  const productColors = product.tags && product.tags.length > 0 
    ? product.tags.filter(tag => tag.toLowerCase().includes('color') || tag.length < 20)
    : [product.color || 'default'];
  
  // Get material as string or array
  const materialDisplay = Array.isArray(product.material) 
    ? product.material.join(', ') 
    : product.material || 'N/A';
  
  // Get category name
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'other';
  
  // Get images array
  const getImageUrls = (): string[] => {
    if (!product.images || product.images.length === 0) {
      return ['/images/placeholder.jpg'];
    }
    return product.images.map((img: any) => {
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img.url) return img.url;
      return '/images/placeholder.jpg';
    });
  };

  const imageUrls = getImageUrls();

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
                onClick={() => router.push(`/products?category=${categoryName}`)}
                className="hover:text-gray-700 capitalize"
              >
                {categoryName}
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images */}
          <div>
            <ImageGallery images={imageUrls} productName={product.name} />
          </div>

          {/* Product Information */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 capitalize">{categoryName}</span>
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
              <div className="flex items-center gap-3 mb-3 lg:mb-4">
                {product.onSale && product.originalPrice ? (
                  <>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-xl line-through text-gray-500">
                      {formatPrice(product.originalPrice)}
                    </div>
                    {product.discountPercentage && (
                      <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </>
                ) : (
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                )}
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
                  <p className="text-gray-900 capitalize">{materialDisplay}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Dimensions:</span>
                  <p className="text-gray-900">{formatDimensions(product.dimensions)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <p className="text-gray-900 capitalize">{categoryName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Weight Capacity:</span>
                  <p className="text-gray-900">Up to 200kg</p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {productColors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {productColors.length > 1 ? 'Available Colors' : 'Color'}
                </h3>
                <div className="flex gap-3 flex-wrap">
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
              <p className="text-gray-600">You might also like these {categoryName}s</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
