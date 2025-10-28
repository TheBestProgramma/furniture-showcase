import { useState, useEffect } from 'react';
import { Testimonial } from '@/lib/types/testimonials';
import { testimonialService, TestimonialFilters } from '@/lib/services/testimonials';

export interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseTestimonialsOptions extends TestimonialFilters {
  autoFetch?: boolean;
}

/**
 * Custom hook for fetching testimonials
 */
export function useTestimonials(options: UseTestimonialsOptions = {}): UseTestimonialsReturn {
  const { autoFetch = true, ...filters } = options;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await testimonialService.getTestimonials(filters);
      
      if (response.success) {
        setTestimonials(response.data);
      } else {
        setError('Failed to fetch testimonials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTestimonials();
    }
  }, [autoFetch, JSON.stringify(filters)]);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials
  };
}

/**
 * Hook for featured testimonials
 */
export function useFeaturedTestimonials(limit?: number) {
  return useTestimonials({ featured: true, limit });
}

/**
 * Hook for testimonials by category
 */
export function useTestimonialsByCategory(category: string, limit?: number) {
  return useTestimonials({ category, limit });
}

/**
 * Hook for verified testimonials
 */
export function useVerifiedTestimonials(limit?: number) {
  return useTestimonials({ verified: true, limit });
}

/**
 * Hook for testimonials with minimum rating
 */
export function useTestimonialsByRating(minRating: number, limit?: number) {
  return useTestimonials({ minRating, limit });
}

/**
 * Hook for homepage testimonials
 */
export function useHomepageTestimonials() {
  return useFeaturedTestimonials(6);
}






