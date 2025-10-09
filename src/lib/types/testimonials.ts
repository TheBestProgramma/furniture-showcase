export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number; // 1-5 stars
  text: string;
  image?: string; // Optional customer photo
  product?: string; // Optional product they purchased
  date: Date;
  verified: boolean; // Whether the purchase was verified
  featured: boolean; // Whether to show in featured section
}

export interface TestimonialCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const testimonialCategories: TestimonialCategory[] = [
  {
    id: 'sofas',
    name: 'Sofas',
    slug: 'sofas',
    description: 'Customer reviews for sofas and seating',
    icon: '🛋️'
  },
  {
    id: 'beds',
    name: 'Beds',
    slug: 'beds',
    description: 'Customer reviews for beds and bedroom furniture',
    icon: '🛏️'
  },
  {
    id: 'dining',
    name: 'Dining',
    slug: 'dining',
    description: 'Customer reviews for dining furniture',
    icon: '🪑'
  },
  {
    id: 'storage',
    name: 'Storage',
    slug: 'storage',
    description: 'Customer reviews for storage solutions',
    icon: '🗄️'
  },
  {
    id: 'general',
    name: 'General',
    slug: 'general',
    description: 'General customer reviews',
    icon: '⭐'
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mwangi',
    location: 'Nairobi, Kenya',
    rating: 5,
    text: 'Absolutely love my new leather sofa! The quality is exceptional and it fits perfectly in my living room. The delivery was prompt and the customer service was outstanding.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'Premium Leather Sofa',
    date: new Date('2024-01-10'),
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'John Kamau',
    location: 'Mombasa, Kenya',
    rating: 5,
    text: 'The dining table set exceeded my expectations. Solid wood construction and beautiful finish. My family gatherings have never been better!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'Modern Dining Set',
    date: new Date('2024-01-08'),
    verified: true,
    featured: true
  },
  {
    id: '3',
    name: 'Grace Wanjiku',
    location: 'Kisumu, Kenya',
    rating: 5,
    text: 'Excellent customer service and beautiful furniture. The bed frame is sturdy and the storage drawers are a game changer for my small bedroom.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'King Size Bed Frame',
    date: new Date('2024-01-05'),
    verified: true,
    featured: true
  },
  {
    id: '4',
    name: 'David Ochieng',
    location: 'Eldoret, Kenya',
    rating: 4,
    text: 'Great quality furniture at reasonable prices. The coffee table set looks amazing in my living room. Would definitely recommend to friends.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'Coffee Table Set',
    date: new Date('2024-01-03'),
    verified: true,
    featured: false
  },
  {
    id: '5',
    name: 'Mary Njeri',
    location: 'Nakuru, Kenya',
    rating: 5,
    text: 'The wardrobe doors are exactly what I was looking for. Custom fit and beautiful design. The installation team was professional and efficient.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'Custom Wardrobe Doors',
    date: new Date('2024-01-01'),
    verified: true,
    featured: true
  },
  {
    id: '6',
    name: 'Peter Kiprop',
    location: 'Thika, Kenya',
    rating: 5,
    text: 'Outstanding furniture quality and service. The cabinet storage solution has transformed my home office. Highly recommend FurniturePro!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format&q=80',
    product: 'Office Storage Cabinet',
    date: new Date('2023-12-28'),
    verified: true,
    featured: false
  }
];

export const getFeaturedTestimonials = (): Testimonial[] => {
  return mockTestimonials.filter(testimonial => testimonial.featured);
};

export const getTestimonialsByCategory = (categorySlug: string): Testimonial[] => {
  return mockTestimonials.filter(testimonial => 
    testimonial.product?.toLowerCase().includes(categorySlug.toLowerCase())
  );
};

export const getTestimonialsByRating = (minRating: number): Testimonial[] => {
  return mockTestimonials.filter(testimonial => testimonial.rating >= minRating);
};

export const getVerifiedTestimonials = (): Testimonial[] => {
  return mockTestimonials.filter(testimonial => testimonial.verified);
};
