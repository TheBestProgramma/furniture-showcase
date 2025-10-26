// API Client Utility
// Centralized API client for making HTTP requests with error handling and type safety

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export class ApiError extends Error {
  status?: number;
  response?: Response;

  constructor(message: string, options?: { status?: number; response?: Response }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.response = options?.response;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      const errorMessage = (errorData as any).message || `HTTP error! status: ${response.status}`;
      console.error('API Error Response:', { status: response.status, errorData });
      
      throw new ApiError(errorMessage, {
        status: response.status,
        response,
      });
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to parse success response:', error);
      throw new ApiError('Failed to parse response data');
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    // Handle relative URLs for client-side usage
    const fullUrl = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;
    const url = new URL(fullUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, params);
      console.log('Fetching URL:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error); // Debug log
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  CATEGORIES: '/api/categories',
  CATEGORY_BY_SLUG: (slug: string) => `/api/categories/${slug}`,
  TIPS: '/api/tips',
  TIP_BY_SLUG: (slug: string) => `/api/tips/${slug}`,
  TESTIMONIALS: '/api/testimonials',
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  CONTACT: '/api/contact',
  SETTINGS: '/api/settings',
} as const;

// Type-safe API functions
export const api = {
  // Products
  getProducts: (params?: {
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
  }) => apiClient.get(API_ENDPOINTS.PRODUCTS, params),

  getProduct: (id: string) => apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id)),

  // Categories
  getCategories: (params?: {
    includeProductCount?: boolean;
    includeProducts?: boolean;
    limit?: number;
  }) => apiClient.get(API_ENDPOINTS.CATEGORIES, params),

  getCategory: (slug: string) => apiClient.get(API_ENDPOINTS.CATEGORY_BY_SLUG(slug)),

  // Tips
  getTips: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    published?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => apiClient.get(API_ENDPOINTS.TIPS, params),

  getTip: (slug: string) => apiClient.get(API_ENDPOINTS.TIP_BY_SLUG(slug)),

  // Testimonials
  getTestimonials: (params?: {
    limit?: number;
    featured?: boolean;
  }) => apiClient.get(API_ENDPOINTS.TESTIMONIALS, params),

  // Orders
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => apiClient.get(API_ENDPOINTS.ORDERS, params),

  getOrder: (id: string) => apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id)),

  createOrder: (orderData: any) => apiClient.post(API_ENDPOINTS.ORDERS, orderData),

  // Contact
  submitContact: (contactData: any) => apiClient.post(API_ENDPOINTS.CONTACT, contactData),

  // Settings
  getSettings: () => apiClient.get(API_ENDPOINTS.SETTINGS),
} as const;

// Utility functions for common API patterns
export const createApiHook = <TData, TParams = any>(
  apiFunction: (params?: TParams) => Promise<ApiResponse<TData>>
) => {
  return async (params?: TParams): Promise<{ data: TData | null; error: string | null }> => {
    try {
      const response = await apiFunction(params);
      if (response.success && response.data) {
        return { data: response.data, error: null };
      } else {
        return { data: null, error: response.error || 'Unknown error' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { data: null, error: errorMessage };
    }
  };
};

// Error boundary helper
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

// Retry mechanism for failed requests
export const withRetry = async <T>(
  apiFunction: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError!;
};
