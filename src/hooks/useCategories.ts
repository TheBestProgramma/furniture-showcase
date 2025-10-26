import { useState, useEffect } from 'react';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  parentCategory?: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  products?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    total: number;
  };
  error?: string;
}

export interface UseCategoriesParams {
  includeProductCount?: boolean;
  includeProducts?: boolean;
  limit?: number;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => void;
}

export function useCategories(params: UseCategoriesParams = {}): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const searchParams = new URLSearchParams();
      
      if (params.includeProductCount) searchParams.set('includeProductCount', 'true');
      if (params.includeProducts) searchParams.set('includeProducts', 'true');
      if (params.limit) searchParams.set('limit', params.limit.toString());

      const response = await fetch(`/api/categories?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoriesResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch categories');
      }

      setCategories(data.data.categories);
      setTotal(data.data.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [params.includeProductCount, params.includeProducts, params.limit]);

  const refetch = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    total,
    refetch
  };
}
