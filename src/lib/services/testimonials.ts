import { Testimonial } from '@/lib/types/testimonials';

export interface TestimonialFilters {
  category?: string;
  featured?: boolean;
  verified?: boolean;
  minRating?: number;
  limit?: number;
}

export interface CreateTestimonialData {
  name: string;
  location: string;
  rating: number;
  text: string;
  product?: string;
  image?: string;
}

export interface TestimonialResponse {
  success: boolean;
  data: Testimonial[];
  count: number;
  total: number;
}

export interface CreateTestimonialResponse {
  success: boolean;
  data?: Testimonial;
  message?: string;
  error?: string;
}

class TestimonialService {
  private baseUrl = '/api/testimonials';

  /**
   * Fetch testimonials with optional filtering
   */
  async getTestimonials(filters: TestimonialFilters = {}): Promise<TestimonialResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
      if (filters.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters.minRating) params.append('rating', filters.minRating.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Failed to fetch testimonials');
    }
  }

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(limit?: number): Promise<TestimonialResponse> {
    return this.getTestimonials({ featured: true, limit });
  }

  /**
   * Get testimonials by category
   */
  async getTestimonialsByCategory(category: string, limit?: number): Promise<TestimonialResponse> {
    return this.getTestimonials({ category, limit });
  }

  /**
   * Get verified testimonials only
   */
  async getVerifiedTestimonials(limit?: number): Promise<TestimonialResponse> {
    return this.getTestimonials({ verified: true, limit });
  }

  /**
   * Get testimonials with minimum rating
   */
  async getTestimonialsByRating(minRating: number, limit?: number): Promise<TestimonialResponse> {
    return this.getTestimonials({ minRating, limit });
  }

  /**
   * Create a new testimonial
   */
  async createTestimonial(data: CreateTestimonialData): Promise<CreateTestimonialResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create testimonial');
      }
      
      return result;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw new Error('Failed to create testimonial');
    }
  }

  /**
   * Get testimonials for homepage carousel
   */
  async getHomepageTestimonials(): Promise<TestimonialResponse> {
    return this.getTestimonials({ featured: true, limit: 6 });
  }

  /**
   * Get testimonials for a specific product
   */
  async getProductTestimonials(productName: string, limit?: number): Promise<TestimonialResponse> {
    // This would typically be handled by the backend with a product-specific endpoint
    // For now, we'll filter by product name in the text or product field
    const response = await this.getTestimonials({ limit: limit || 10 });
    
    if (response.success) {
      const filteredData = response.data.filter(testimonial => 
        testimonial.product?.toLowerCase().includes(productName.toLowerCase()) ||
        testimonial.text.toLowerCase().includes(productName.toLowerCase())
      );
      
      return {
        ...response,
        data: filteredData,
        count: filteredData.length
      };
    }
    
    return response;
  }
}

// Export a singleton instance
export const testimonialService = new TestimonialService();

// Export the class for custom instances if needed
export default TestimonialService;



