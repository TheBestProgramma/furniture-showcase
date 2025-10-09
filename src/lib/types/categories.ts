export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage: string;
  icon: string;
  productCount: number;
  featured: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'beds',
    name: 'Beds & Bedroom',
    slug: 'beds',
    description: 'Transform your bedroom into a sanctuary with our premium collection of beds, mattresses, and bedroom furniture. From modern platform beds to classic wooden frames, find the perfect centerpiece for your sleep space.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop&auto=format',
    icon: '🛏️',
    productCount: 12,
    featured: true,
    subcategories: [
      { id: 'platform-beds', name: 'Platform Beds', slug: 'platform-beds', description: 'Modern, low-profile beds with built-in support' },
      { id: 'wooden-beds', name: 'Wooden Beds', slug: 'wooden-beds', description: 'Classic and timeless wooden bed frames' },
      { id: 'upholstered-beds', name: 'Upholstered Beds', slug: 'upholstered-beds', description: 'Comfortable beds with padded headboards' },
      { id: 'storage-beds', name: 'Storage Beds', slug: 'storage-beds', description: 'Beds with built-in storage solutions' }
    ]
  },
  {
    id: 'sofas',
    name: 'Sofas & Living Room',
    slug: 'sofas',
    description: 'Create the perfect living space with our curated selection of sofas, sectionals, and living room furniture. Whether you prefer modern minimalism or cozy comfort, we have the perfect seating for your home.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop&auto=format',
    icon: '🛋️',
    productCount: 18,
    featured: true,
    subcategories: [
      { id: 'sectional-sofas', name: 'Sectional Sofas', slug: 'sectional-sofas', description: 'Large, modular sofas perfect for family rooms' },
      { id: 'loveseats', name: 'Loveseats', slug: 'loveseats', description: 'Compact two-seater sofas for smaller spaces' },
      { id: 'recliners', name: 'Recliners', slug: 'recliners', description: 'Comfortable chairs with reclining functionality' },
      { id: 'accent-chairs', name: 'Accent Chairs', slug: 'accent-chairs', description: 'Stylish chairs to complement your decor' }
    ]
  },
  {
    id: 'dining',
    name: 'Dining & Kitchen',
    slug: 'dining',
    description: 'Gather around the table with our beautiful dining furniture collection. From elegant dining sets to functional kitchen islands, create memorable moments with family and friends.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&auto=format',
    icon: '🍽️',
    productCount: 15,
    featured: true,
    subcategories: [
      { id: 'dining-tables', name: 'Dining Tables', slug: 'dining-tables', description: 'Tables for family meals and entertaining' },
      { id: 'dining-chairs', name: 'Dining Chairs', slug: 'dining-chairs', description: 'Comfortable seating for your dining area' },
      { id: 'bar-stools', name: 'Bar Stools', slug: 'bar-stools', description: 'High seating for kitchen islands and bars' },
      { id: 'kitchen-islands', name: 'Kitchen Islands', slug: 'kitchen-islands', description: 'Multi-functional kitchen centerpieces' }
    ]
  },
  {
    id: 'storage',
    name: 'Storage & Organization',
    slug: 'storage',
    description: 'Keep your home organized and clutter-free with our smart storage solutions. From elegant bookcases to functional wardrobes, maximize your space with style.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop&auto=format',
    icon: '📚',
    productCount: 20,
    featured: false,
    subcategories: [
      { id: 'bookcases', name: 'Bookcases', slug: 'bookcases', description: 'Display and organize your books and decor' },
      { id: 'wardrobes', name: 'Wardrobes', slug: 'wardrobes', description: 'Spacious storage for clothing and accessories' },
      { id: 'storage-cabinets', name: 'Storage Cabinets', slug: 'storage-cabinets', description: 'Versatile cabinets for any room' },
      { id: 'shelving-units', name: 'Shelving Units', slug: 'shelving-units', description: 'Modular shelving for flexible organization' }
    ]
  },
  {
    id: 'office',
    name: 'Office & Workspace',
    slug: 'office',
    description: 'Boost your productivity with our ergonomic office furniture. From spacious desks to comfortable chairs, create a workspace that inspires creativity and efficiency.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop&auto=format',
    icon: '💼',
    productCount: 10,
    featured: false,
    subcategories: [
      { id: 'desks', name: 'Desks', slug: 'desks', description: 'Spacious work surfaces for productivity' },
      { id: 'office-chairs', name: 'Office Chairs', slug: 'office-chairs', description: 'Ergonomic seating for long work sessions' },
      { id: 'filing-cabinets', name: 'Filing Cabinets', slug: 'filing-cabinets', description: 'Organize documents and office supplies' },
      { id: 'bookshelves', name: 'Bookshelves', slug: 'bookshelves', description: 'Display books and office accessories' }
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Garden',
    slug: 'outdoor',
    description: 'Extend your living space outdoors with our weather-resistant furniture collection. Create beautiful outdoor areas for relaxation and entertainment.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
    bannerImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=400&fit=crop&auto=format',
    icon: '🌿',
    productCount: 8,
    featured: false,
    subcategories: [
      { id: 'patio-sets', name: 'Patio Sets', slug: 'patio-sets', description: 'Complete outdoor dining and seating sets' },
      { id: 'garden-chairs', name: 'Garden Chairs', slug: 'garden-chairs', description: 'Comfortable seating for outdoor spaces' },
      { id: 'outdoor-tables', name: 'Outdoor Tables', slug: 'outdoor-tables', description: 'Weather-resistant tables for outdoor use' },
      { id: 'garden-storage', name: 'Garden Storage', slug: 'garden-storage', description: 'Storage solutions for outdoor equipment' }
    ]
  }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getFeaturedCategories = (): Category[] => {
  return categories.filter(category => category.featured);
};
