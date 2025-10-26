import connectDB from './mongodb';
import Category from './models/Category';
import Product from './models/Product';

const categories = [
  {
    name: 'Sofas',
    description: 'Comfortable seating for your living room',
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
      alt: 'Modern sofas in a living room',
      width: 800,
      height: 600
    },
    sortOrder: 1
  },
  {
    name: 'Chairs',
    description: 'Dining chairs, office chairs, and accent chairs',
    image: {
      url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
      alt: 'Various types of chairs',
      width: 800,
      height: 600
    },
    sortOrder: 2
  },
  {
    name: 'Tables',
    description: 'Dining tables, coffee tables, and side tables',
    image: {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
      alt: 'Modern dining table setup',
      width: 800,
      height: 600
    },
    sortOrder: 3
  },
  {
    name: 'Beds',
    description: 'Bed frames, headboards, and bedroom furniture',
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
      alt: 'Modern bedroom with bed',
      width: 800,
      height: 600
    },
    sortOrder: 4
  },
  {
    name: 'Storage',
    description: 'Cabinets, shelves, and storage solutions',
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
      alt: 'Storage cabinets and shelves',
      width: 800,
      height: 600
    },
    sortOrder: 5
  }
];

const products = [
  // Sofas
  {
    name: 'Modern L-Shaped Sectional Sofa',
    description: 'Spacious L-shaped sectional with premium fabric upholstery. Perfect for large living rooms and family gatherings.',
    price: 1299.99,
    originalPrice: 1599.99,
    category: 'sofas', // Will be replaced with ObjectId
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 3',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 4',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 5',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 6',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 7',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 8',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 9',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 10',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 11',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 12',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 13',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 14',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 15',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 240, height: 85, depth: 180, weight: 120 },
    material: ['fabric', 'wood'],
    color: 'Charcoal Gray',
    brand: 'ComfortZone',
    productModel: 'LS-001',
    sku: 'SOFA-LS-001',
    stockQuantity: 15,
    featured: true,
    onSale: true,
    discountPercentage: 19,
    tags: ['sectional', 'modern', 'large', 'family'],
    specifications: {
      'Seating Capacity': '6-8 people',
      'Frame Material': 'Solid Oak',
      'Cushion Fill': 'High-density foam',
      'Warranty': '5 years'
    }
  },
  {
    name: 'Classic Chesterfield Sofa',
    description: 'Timeless Chesterfield design with genuine leather upholstery. Adds elegance to any room.',
    price: 2199.99,
    category: 'sofas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 3',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 4',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 5',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 6',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 7',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 8',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 9',
        width: 800,
        height: 600,
        isPrimary: false
      },
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 10',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 200, height: 90, depth: 95, weight: 85 },
    material: ['leather', 'wood'],
    color: 'Rich Brown',
    brand: 'Heritage',
    productModel: 'CH-001',
    sku: 'SOFA-CH-002',
    stockQuantity: 8,
    featured: true,
    tags: ['classic', 'leather', 'elegant', 'traditional'],
    specifications: {
      'Leather Type': 'Full-grain Italian leather',
      'Frame Material': 'Kiln-dried hardwood',
      'Spring System': 'Hand-tied springs',
      'Warranty': 'Lifetime'
    }
  },
  {
    name: 'Minimalist 3-Seater Sofa',
    description: 'Clean lines and modern design. Perfect for contemporary homes with limited space.',
    price: 899.99,
    category: 'sofas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 180, height: 75, depth: 85, weight: 65 },
    material: ['fabric', 'metal'],
    color: 'Light Gray',
    brand: 'ModernHome',
    sku: 'SOFA-MIN-003',
    stockQuantity: 25,
    tags: ['minimalist', 'modern', 'compact', 'contemporary'],
    specifications: {
      'Style': 'Mid-century modern',
      'Assembly': 'Required',
      'Care Instructions': 'Spot clean only'
    }
  },

  // Chairs
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.',
    price: 449.99,
    originalPrice: 599.99,
    category: 'chairs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 65, height: 120, depth: 65, weight: 25 },
    material: ['fabric', 'metal', 'plastic'],
    color: 'Black',
    brand: 'WorkPro',
    sku: 'CHAIR-ERG-004',
    stockQuantity: 30,
    featured: true,
    onSale: true,
    discountPercentage: 25,
    tags: ['ergonomic', 'office', 'adjustable', 'lumbar-support'],
    specifications: {
      'Weight Capacity': '300 lbs',
      'Adjustable Height': 'Yes',
      'Lumbar Support': 'Yes',
      'Armrests': 'Adjustable'
    }
  },
  {
    name: 'Vintage Dining Chair Set (4)',
    description: 'Set of 4 vintage-inspired dining chairs with comfortable padded seats and elegant wooden frames.',
    price: 399.99,
    category: 'chairs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 45, height: 95, depth: 50, weight: 12 },
    material: ['wood', 'fabric'],
    color: 'Natural Oak',
    brand: 'RusticHome',
    sku: 'CHAIR-DIN-005',
    stockQuantity: 20,
    tags: ['vintage', 'dining', 'set', 'wooden'],
    specifications: {
      'Set Size': '4 chairs',
      'Seat Material': 'Premium fabric',
      'Frame Material': 'Solid oak',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Accent Reading Chair',
    description: 'Comfortable accent chair perfect for reading corners. Features high back support and soft cushions.',
    price: 599.99,
    category: 'chairs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 80, height: 100, depth: 85, weight: 35 },
    material: ['fabric', 'wood'],
    color: 'Navy Blue',
    brand: 'CozyCorner',
    sku: 'CHAIR-ACC-006',
    stockQuantity: 12,
    featured: true,
    tags: ['accent', 'reading', 'comfortable', 'high-back'],
    specifications: {
      'Style': 'Traditional',
      'Cushion Fill': 'Down and feather',
      'Frame Material': 'Hardwood',
      'Reclining': 'No'
    }
  },

  // Tables
  {
    name: 'Solid Oak Dining Table',
    description: 'Beautiful solid oak dining table that seats 6-8 people. Handcrafted with attention to detail.',
    price: 1299.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 200, height: 75, depth: 100, weight: 80 },
    material: ['wood'],
    color: 'Natural Oak',
    brand: 'ArtisanWood',
    sku: 'TABLE-OAK-007',
    stockQuantity: 10,
    featured: true,
    tags: ['solid-oak', 'dining', 'handcrafted', 'large'],
    specifications: {
      'Seating Capacity': '6-8 people',
      'Wood Type': 'Solid oak',
      'Finish': 'Natural oil',
      'Warranty': '10 years'
    }
  },
  {
    name: 'Glass Coffee Table',
    description: 'Modern glass coffee table with chrome legs. Adds elegance and doesn\'t overwhelm small spaces.',
    price: 299.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 120, height: 45, depth: 60, weight: 20 },
    material: ['glass', 'metal'],
    color: 'Clear',
    brand: 'ModernGlass',
    sku: 'TABLE-GLASS-008',
    stockQuantity: 18,
    tags: ['glass', 'modern', 'coffee-table', 'chrome'],
    specifications: {
      'Glass Type': 'Tempered safety glass',
      'Leg Material': 'Chrome-plated steel',
      'Assembly': 'Required',
      'Weight Capacity': '50 lbs'
    }
  },
  {
    name: 'Rustic Farmhouse Table',
    description: 'Charming farmhouse-style dining table with distressed finish. Perfect for country-style homes.',
    price: 799.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 180, height: 75, depth: 90, weight: 70 },
    material: ['wood'],
    color: 'Weathered Gray',
    brand: 'CountryStyle',
    sku: 'TABLE-FARM-009',
    stockQuantity: 15,
    tags: ['farmhouse', 'rustic', 'distressed', 'country'],
    specifications: {
      'Style': 'Farmhouse',
      'Finish': 'Distressed',
      'Seating Capacity': '6 people',
      'Assembly': 'Required'
    }
  },

  // Beds
  {
    name: 'King Size Platform Bed',
    description: 'Sleek platform bed with built-in storage drawers. Modern design with practical functionality.',
    price: 899.99,
    originalPrice: 1199.99,
    category: 'beds',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 200, height: 30, depth: 220, weight: 150 },
    material: ['wood'],
    color: 'Walnut',
    brand: 'SleepWell',
    sku: 'BED-PLAT-010',
    stockQuantity: 8,
    featured: true,
    onSale: true,
    discountPercentage: 25,
    tags: ['platform', 'storage', 'modern', 'king-size'],
    specifications: {
      'Size': 'King (200x220cm)',
      'Storage': '4 built-in drawers',
      'Frame Material': 'Solid walnut',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Upholstered Headboard Bed',
    description: 'Elegant upholstered headboard with tufted design. Available in multiple colors.',
    price: 699.99,
    category: 'beds',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 160, height: 120, depth: 200, weight: 80 },
    material: ['fabric', 'wood'],
    color: 'Navy Blue',
    brand: 'LuxurySleep',
    sku: 'BED-UPH-011',
    stockQuantity: 12,
    tags: ['upholstered', 'headboard', 'tufted', 'queen-size'],
    specifications: {
      'Size': 'Queen (160x200cm)',
      'Headboard Height': '120cm',
      'Fabric': 'Premium velvet',
      'Style': 'Tufted'
    }
  },
  {
    name: 'Minimalist Metal Bed Frame',
    description: 'Clean and simple metal bed frame. Easy to assemble and perfect for modern bedrooms.',
    price: 249.99,
    category: 'beds',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 140, height: 25, depth: 190, weight: 35 },
    material: ['metal'],
    color: 'Black',
    brand: 'SimpleFrame',
    sku: 'BED-METAL-012',
    stockQuantity: 25,
    tags: ['metal', 'minimalist', 'simple', 'twin-size'],
    specifications: {
      'Size': 'Twin (140x190cm)',
      'Material': 'Powder-coated steel',
      'Assembly': 'Required',
      'Weight Capacity': '500 lbs'
    }
  },

  // Storage
  {
    name: 'Modern TV Stand with Storage',
    description: 'Contemporary TV stand with multiple storage compartments and cable management system.',
    price: 399.99,
    category: 'storage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 150, height: 45, depth: 40, weight: 45 },
    material: ['wood', 'metal'],
    color: 'White',
    brand: 'MediaCenter',
    sku: 'STORAGE-TV-013',
    stockQuantity: 20,
    featured: true,
    tags: ['tv-stand', 'storage', 'modern', 'cable-management'],
    specifications: {
      'TV Size': 'Up to 65 inches',
      'Storage': '3 compartments',
      'Cable Management': 'Yes',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Bookshelf with 5 Shelves',
    description: 'Sturdy bookshelf with 5 adjustable shelves. Perfect for books, decorations, and storage.',
    price: 199.99,
    category: 'storage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 80, height: 180, depth: 30, weight: 25 },
    material: ['wood'],
    color: 'Oak',
    brand: 'BookLover',
    sku: 'STORAGE-BOOK-014',
    stockQuantity: 30,
    tags: ['bookshelf', 'storage', 'adjustable', 'wooden'],
    specifications: {
      'Shelves': '5 adjustable',
      'Weight Capacity': '30 lbs per shelf',
      'Assembly': 'Required',
      'Material': 'Engineered wood'
    }
  },
  {
    name: 'Wardrobe with Mirror',
    description: 'Spacious wardrobe with full-length mirror and multiple storage compartments.',
    price: 799.99,
    category: 'storage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 120, height: 200, depth: 60, weight: 120 },
    material: ['wood'],
    color: 'White',
    brand: 'ClosetMax',
    sku: 'STORAGE-WARD-015',
    stockQuantity: 6,
    featured: true,
    tags: ['wardrobe', 'mirror', 'storage', 'bedroom'],
    specifications: {
      'Hanging Space': 'Yes',
      'Shelves': '4 fixed',
      'Mirror': 'Full-length',
      'Assembly': 'Required'
    }
  },

  // Additional products to reach 20+
  {
    name: 'Luxury Recliner Chair',
    description: 'Premium recliner chair with massage function and USB charging port.',
    price: 1299.99,
    category: 'chairs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 90, height: 110, depth: 95, weight: 80 },
    material: ['leather', 'metal'],
    color: 'Brown',
    brand: 'ComfortMax',
    sku: 'CHAIR-REC-016',
    stockQuantity: 5,
    featured: true,
    tags: ['recliner', 'massage', 'luxury', 'leather'],
    specifications: {
      'Reclining': 'Yes',
      'Massage': 'Yes',
      'USB Port': 'Yes',
      'Power': 'Electric'
    }
  },
  {
    name: 'Industrial Bar Stool Set (2)',
    description: 'Set of 2 industrial-style bar stools with adjustable height and footrest.',
    price: 299.99,
    category: 'chairs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 40, height: 90, depth: 40, weight: 15 },
    material: ['metal', 'wood'],
    color: 'Black',
    brand: 'IndustrialStyle',
    sku: 'CHAIR-BAR-017',
    stockQuantity: 15,
    tags: ['bar-stool', 'industrial', 'adjustable', 'set'],
    specifications: {
      'Set Size': '2 stools',
      'Height Range': '65-90cm',
      'Weight Capacity': '150 kg',
      'Footrest': 'Yes'
    }
  },
  {
    name: 'Nesting Coffee Tables (Set of 3)',
    description: 'Set of 3 nesting coffee tables in different sizes. Perfect for flexible living room arrangements.',
    price: 449.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 60, height: 45, depth: 40, weight: 12 },
    material: ['wood'],
    color: 'Natural',
    brand: 'FlexiSpace',
    sku: 'TABLE-NEST-018',
    stockQuantity: 12,
    tags: ['nesting', 'coffee-tables', 'set', 'flexible'],
    specifications: {
      'Set Size': '3 tables',
      'Nesting': 'Yes',
      'Material': 'Solid wood',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Bunk Bed with Storage',
    description: 'Space-saving bunk bed with built-in storage drawers and safety rails.',
    price: 599.99,
    category: 'beds',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 200, height: 160, depth: 100, weight: 100 },
    material: ['wood'],
    color: 'White',
    brand: 'KidsSpace',
    sku: 'BED-BUNK-019',
    stockQuantity: 8,
    featured: true,
    tags: ['bunk-bed', 'storage', 'kids', 'space-saving'],
    specifications: {
      'Beds': '2 twin beds',
      'Storage': '2 drawers',
      'Safety Rails': 'Yes',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Corner Storage Cabinet',
    description: 'Space-efficient corner cabinet with multiple shelves and doors. Perfect for small spaces.',
    price: 349.99,
    category: 'storage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 80, height: 180, depth: 80, weight: 50 },
    material: ['wood'],
    color: 'Oak',
    brand: 'CornerMax',
    sku: 'STORAGE-CORNER-020',
    stockQuantity: 10,
    tags: ['corner', 'cabinet', 'storage', 'space-saving'],
    specifications: {
      'Shelves': '4 adjustable',
      'Doors': '2',
      'Corner Design': 'Yes',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Executive Desk with Drawers',
    description: 'Professional executive desk with multiple drawers and cable management. Perfect for home office.',
    price: 899.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 160, height: 75, depth: 80, weight: 60 },
    material: ['wood', 'metal'],
    color: 'Dark Oak',
    brand: 'OfficePro',
    sku: 'TABLE-EXEC-021',
    stockQuantity: 12,
    featured: true,
    tags: ['desk', 'executive', 'office', 'drawers'],
    specifications: {
      'Drawers': '3',
      'Cable Management': 'Yes',
      'Material': 'Solid oak',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Outdoor Patio Set (4 chairs + table)',
    description: 'Weather-resistant outdoor patio set perfect for gardens and balconies.',
    price: 699.99,
    category: 'tables',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 1',
        width: 800,
        height: 600,
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
        alt: 'Product image 2',
        width: 800,
        height: 600,
        isPrimary: false
      }
    ],
    dimensions: { width: 120, height: 75, depth: 120, weight: 45 },
    material: ['metal', 'fabric'],
    color: 'Black',
    brand: 'OutdoorLiving',
    sku: 'TABLE-PATIO-022',
    stockQuantity: 8,
    tags: ['outdoor', 'patio', 'weather-resistant', 'set'],
    specifications: {
      'Set Size': '4 chairs + table',
      'Weather Resistant': 'Yes',
      'Material': 'Powder-coated steel',
      'Assembly': 'Required'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category map for products
    const categoryMap = new Map();
    createdCategories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase(), cat._id);
    });

    // Update products with category ObjectIds
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap.get(product.category)
    }));

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
