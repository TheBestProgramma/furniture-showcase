export interface Tip {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: TipCategory;
  author: string;
  readTime: number; // in minutes
  image: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TipCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export const tipCategories: TipCategory[] = [
  {
    id: 'furniture-care',
    name: 'Furniture Care',
    slug: 'furniture-care',
    description: 'Tips for maintaining and caring for your furniture',
    icon: '🧽',
    color: 'blue'
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Interior design and decoration ideas',
    icon: '🏠',
    color: 'green'
  },
  {
    id: 'space-optimization',
    name: 'Space Optimization',
    slug: 'space-optimization',
    description: 'Maximizing space and organization tips',
    icon: '📐',
    color: 'purple'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    slug: 'maintenance',
    description: 'Cleaning and maintenance guides',
    icon: '🔧',
    color: 'orange'
  },
  {
    id: 'styling',
    name: 'Styling',
    slug: 'styling',
    description: 'Furniture styling and arrangement tips',
    icon: '✨',
    color: 'pink'
  },
  {
    id: 'buying-guide',
    name: 'Buying Guide',
    slug: 'buying-guide',
    description: 'How to choose the right furniture',
    icon: '🛒',
    color: 'indigo'
  }
];

export const mockTips: Tip[] = [
  {
    id: '1',
    title: 'How to Clean and Maintain Wooden Furniture',
    slug: 'clean-maintain-wooden-furniture',
    excerpt: 'Learn the best practices for keeping your wooden furniture looking new for years to come.',
    content: 'Wooden furniture requires special care to maintain its beauty and longevity...',
    category: tipCategories[0], // furniture-care
    author: 'Sarah Johnson',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tags: ['wood', 'cleaning', 'maintenance', 'furniture care'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: '10 Small Space Furniture Arrangement Ideas',
    slug: 'small-space-furniture-arrangement',
    excerpt: 'Transform your small space with these clever furniture arrangement tips and tricks.',
    content: 'Living in a small space doesn\'t mean you have to compromise on style or comfort...',
    category: tipCategories[2], // space-optimization
    author: 'Mike Chen',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
    featured: true,
    tags: ['small space', 'arrangement', 'organization', 'interior design'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Choosing the Right Sofa for Your Living Room',
    slug: 'choosing-right-sofa-living-room',
    excerpt: 'A comprehensive guide to selecting the perfect sofa that fits your space and lifestyle.',
    content: 'The sofa is often the centerpiece of your living room, so choosing the right one is crucial...',
    category: tipCategories[5], // buying-guide
    author: 'Emma Davis',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
    featured: false,
    tags: ['sofa', 'living room', 'buying guide', 'furniture selection'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    title: 'Modern Minimalist Home Decor Tips',
    slug: 'modern-minimalist-home-decor',
    excerpt: 'Create a clean, modern look with these minimalist home decoration principles.',
    content: 'Minimalism is about more than just having fewer things - it\'s about intentional living...',
    category: tipCategories[1], // home-decor
    author: 'Alex Thompson',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format',
    featured: true,
    tags: ['minimalist', 'modern', 'decor', 'interior design'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    title: 'DIY Furniture Restoration Techniques',
    slug: 'diy-furniture-restoration-techniques',
    excerpt: 'Bring old furniture back to life with these simple restoration techniques.',
    content: 'Restoring old furniture can be a rewarding project that saves money and reduces waste...',
    category: tipCategories[3], // maintenance
    author: 'Lisa Rodriguez',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
    featured: false,
    tags: ['DIY', 'restoration', 'upcycling', 'furniture repair'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '6',
    title: 'Creating the Perfect Reading Nook',
    slug: 'creating-perfect-reading-nook',
    excerpt: 'Design a cozy reading corner that encourages relaxation and focus.',
    content: 'A reading nook is a special place in your home dedicated to quiet contemplation...',
    category: tipCategories[4], // styling
    author: 'David Wilson',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
    featured: false,
    tags: ['reading nook', 'cozy', 'styling', 'home design'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '7',
    title: 'Seasonal Furniture Care Checklist',
    slug: 'seasonal-furniture-care-checklist',
    excerpt: 'Keep your furniture in top condition with this seasonal maintenance checklist.',
    content: 'Different seasons bring different challenges for furniture care...',
    category: tipCategories[0], // furniture-care
    author: 'Sarah Johnson',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
    featured: false,
    tags: ['seasonal care', 'maintenance', 'checklist', 'furniture care'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    title: 'Maximizing Storage in Small Bedrooms',
    slug: 'maximizing-storage-small-bedrooms',
    excerpt: 'Smart storage solutions to make the most of your small bedroom space.',
    content: 'Small bedrooms can be challenging, but with the right storage solutions...',
    category: tipCategories[2], // space-optimization
    author: 'Mike Chen',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
    featured: false,
    tags: ['bedroom', 'storage', 'small space', 'organization'],
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28')
  }
];

export const getTipBySlug = (slug: string): Tip | undefined => {
  return mockTips.find(tip => tip.slug === slug);
};

export const getTipsByCategory = (categorySlug: string): Tip[] => {
  return mockTips.filter(tip => tip.category.slug === categorySlug);
};

export const getFeaturedTips = (): Tip[] => {
  return mockTips.filter(tip => tip.featured);
};
