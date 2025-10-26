import { useState, useEffect } from 'react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
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
  images: string[];
  inStock: boolean;
  featured: boolean;
  onSale?: boolean;
  salePrice?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
    filters: {
      category: string | null;
      search: string | null;
      minPrice: number | null;
      maxPrice: number | null;
      featured: boolean | null;
      onSale: boolean | null;
      inStock: boolean | null;
      sortBy: string;
      sortOrder: string;
    };
  };
  error?: string;
}

export interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: ProductsResponse['data']['pagination'] | null;
  filters: ProductsResponse['data']['filters'] | null;
  refetch: () => void;
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ProductsResponse['data']['pagination'] | null>(null);
  const [filters, setFilters] = useState<ProductsResponse['data']['filters'] | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.category) searchParams.set('category', params.category);
      if (params.search) searchParams.set('search', params.search);
      if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
      if (params.featured !== undefined) searchParams.set('featured', params.featured.toString());
      if (params.onSale !== undefined) searchParams.set('onSale', params.onSale.toString());
      if (params.inStock !== undefined) searchParams.set('inStock', params.inStock.toString());
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.data.products);
      setPagination(data.data.pagination);
      setFilters(data.data.filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.minPrice,
    params.maxPrice,
    params.featured,
    params.onSale,
    params.inStock,
    params.sortBy,
    params.sortOrder
  ]);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    refetch
  };
}
