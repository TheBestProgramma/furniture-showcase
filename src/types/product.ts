export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  brand?: string;
  material?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in' | 'm';
  };
  weight?: number;
  color?: string;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  features: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  discount: number;
  sku: string;
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'rating';
  direction: 'asc' | 'desc';
}




