import { useState, useEffect } from 'react';
import { api, ApiResponse, PaginationInfo } from '@/lib/api';

export interface Tip {
  _id: string;
  id: string; // Add id for compatibility
  slug: string; // Add slug for compatibility
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  image: string | {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TipsResponse {
  success: boolean;
  data: {
    tips: Tip[];
    pagination: PaginationInfo;
    filters: {
      category: string | null;
      search: string | null;
      featured: boolean | null;
      published: boolean;
      sortBy: string;
      sortOrder: string;
    };
  };
  error?: string;
}

export interface UseTipsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseTipsReturn {
  tips: Tip[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  filters: TipsResponse['data']['filters'] | null;
  refetch: () => void;
}

export function useTips(params: UseTipsParams = {}): UseTipsReturn {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState<TipsResponse['data']['filters'] | null>(null);

  const fetchTips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching tips with params:', params); // Debug log
      const response = await api.getTips(params);
      console.log('Tips API response:', response); // Debug log
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tips');
      }

      if (response.data) {
        // Transform tips to add id and slug for compatibility
        const data = response.data as TipsResponse['data'];
        const transformedTips = (data.tips || []).map(tip => ({
          ...tip,
          id: tip._id,
          slug: tip.slug || tip._id // Use slug if available, fallback to _id
        }));
        
        setTips(transformedTips);
        setPagination(data.pagination);
        setFilters(data.filters);
      } else {
        console.warn('No data in response:', response);
        setTips([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.featured,
    params.published,
    params.sortBy,
    params.sortOrder
  ]);

  const refetch = () => {
    fetchTips();
  };

  return {
    tips,
    loading,
    error,
    pagination,
    filters,
    refetch
  };
}

export interface UseTipReturn {
  tip: Tip | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTip(slug: string): UseTipReturn {
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTip = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getTip(slug);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tip');
      }

      if (response.data && (response.data as any).tip) {
        // Transform tip to add id and slug for compatibility
        const tipData = (response.data as any).tip;
        const transformedTip = {
          ...tipData,
          id: tipData._id,
          slug: tipData.slug || tipData._id // Use slug if available, fallback to _id
        };
        setTip(transformedTip);
      } else {
        setTip(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching tip:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchTip();
    }
  }, [slug]);

  const refetch = () => {
    fetchTip();
  };

  return {
    tip,
    loading,
    error,
    refetch
  };
}
