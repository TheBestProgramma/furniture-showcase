import connectDB from './mongodb';
import Tip from './models/Tip';

const tips = [
  {
    title: 'How to Choose the Perfect Sofa for Your Living Room',
    content: `Choosing the right sofa is one of the most important decisions when furnishing your living room. This comprehensive guide will help you make the perfect choice.

## Size and Space Considerations

First, measure your space carefully. The sofa should fit comfortably without overwhelming the room. Consider the 2/3 rule: your sofa should be about 2/3 the length of the wall it's against.

## Style and Design

Match your sofa style to your overall room aesthetic. Modern sofas work well in contemporary spaces, while traditional styles complement classic decor. Consider the sofa's silhouette and how it will work with your existing furniture.

## Fabric and Material

Choose fabrics based on your lifestyle. If you have pets or children, consider durable, easy-to-clean fabrics like leather or performance fabrics. For formal living rooms, luxurious fabrics like velvet or silk can add elegance.

## Comfort and Support

Test the sofa before buying. Sit on it, lie down, and check the back support. The seat depth should allow you to sit comfortably with your back against the backrest. Cushion firmness is a personal preference, but medium-firm cushions tend to work well for most people.

## Quality and Construction

Look for solid wood frames, high-density foam cushions, and quality upholstery. Check the warranty and ask about the construction details. A well-made sofa is an investment that will last for years.

## Budget Considerations

Set a realistic budget and stick to it. Remember that a quality sofa is an investment, but you don't need to break the bank. Look for sales, consider floor models, or explore financing options if needed.

By considering these factors carefully, you'll find the perfect sofa that combines style, comfort, and functionality for your living space.`,
    excerpt: 'Learn how to select the perfect sofa by considering size, style, fabric, comfort, and quality factors for your living space.',
    author: 'Sarah Johnson',
    category: 'buying-guide',
    tags: ['sofa', 'living-room', 'furniture-selection', 'home-decor'],
    featured: true,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
      alt: 'Modern living room with sofa',
      width: 800,
      height: 600
    },
    readTime: 8,
    views: 1250,
    likes: 89
  },
  {
    title: 'Essential Furniture Care Tips for Longevity',
    content: `Proper furniture care can extend the life of your pieces by decades. This comprehensive guide covers essential maintenance tips for all types of furniture.

## Wood Furniture Care

Wood furniture requires special attention to maintain its beauty and longevity. Regular dusting with a soft, dry cloth is essential. Avoid using water directly on wood, as it can cause warping and damage.

### Cleaning Wood Furniture

- Use a soft, dry cloth for daily dusting
- For deeper cleaning, use a slightly damp cloth with mild soap
- Always dry immediately with a clean cloth
- Use furniture polish sparingly and choose quality products

### Protecting Wood Surfaces

- Use coasters for drinks and placemats for meals
- Avoid placing hot items directly on wood surfaces
- Keep wood furniture away from direct sunlight and heat sources
- Maintain consistent humidity levels in your home

## Upholstery Care

Fabric and leather upholstery require different care approaches. Regular vacuuming and spot cleaning can prevent major issues.

### Fabric Upholstery

- Vacuum regularly with an upholstery attachment
- Blot spills immediately with a clean, dry cloth
- Use appropriate fabric cleaners for deeper cleaning
- Rotate cushions regularly to ensure even wear

### Leather Upholstery

- Dust regularly with a soft cloth
- Use leather conditioner to maintain suppleness
- Avoid harsh chemicals and excessive moisture
- Keep leather away from direct sunlight

## Preventive Maintenance

Regular maintenance is key to extending furniture life. Create a maintenance schedule and stick to it. Address problems early to prevent major damage.

By following these care tips, your furniture will maintain its beauty and functionality for many years to come.`,
    excerpt: 'Discover essential maintenance tips to keep your furniture looking new for years, including care for wood, upholstery, and leather pieces.',
    author: 'Michael Chen',
    category: 'furniture-care',
    tags: ['maintenance', 'wood-care', 'upholstery', 'leather-care', 'longevity'],
    featured: true,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
      alt: 'Wooden furniture care and maintenance',
      width: 800,
      height: 600
    },
    readTime: 6,
    views: 2100,
    likes: 156
  },
  {
    title: 'Small Space Furniture Solutions That Actually Work',
    content: 'Living in a small space doesn\'t mean sacrificing style or comfort. Learn proven strategies for maximizing your space with smart furniture choices.',
    excerpt: 'Maximize your small space with multi-functional furniture, smart storage solutions, and design tricks that create the illusion of more room.',
    author: 'Emma Rodriguez',
    category: 'space-planning',
    tags: ['small-space', 'storage', 'multi-functional', 'space-saving', 'apartment'],
    featured: true,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 7,
    views: 3200,
    likes: 234
  },
  {
    title: 'Sustainable Furniture: Making Eco-Friendly Choices',
    content: 'As environmental awareness grows, choosing sustainable furniture has become increasingly important. Learn how to make eco-friendly furniture decisions.',
    excerpt: 'Learn how to choose eco-friendly furniture that\'s good for your home and the environment, from materials to certifications.',
    author: 'David Park',
    category: 'sustainability',
    tags: ['sustainable', 'eco-friendly', 'green-living', 'recycled', 'environment'],
    featured: true,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 9,
    views: 1800,
    likes: 142
  },
  {
    title: 'Creating the Perfect Home Office Setup',
    content: 'With remote work becoming the norm, having a well-designed home office is essential for productivity and comfort. Learn how to create your ideal workspace.',
    excerpt: 'Design a productive and comfortable home office with the right furniture, ergonomic setup, and organizational systems.',
    author: 'Lisa Thompson',
    category: 'space-planning',
    tags: ['home-office', 'ergonomics', 'productivity', 'remote-work', 'workspace'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 10,
    views: 2800,
    likes: 198
  },
  {
    title: 'Seasonal Furniture Styling: Spring Refresh Ideas',
    content: 'Spring is the perfect time to refresh your home with seasonal styling. Learn creative ways to update your furniture and decor for the new season.',
    excerpt: 'Refresh your home for spring with seasonal styling tips, color updates, and furniture arrangements that welcome the new season.',
    author: 'Jennifer Walsh',
    category: 'styling',
    tags: ['spring', 'seasonal', 'styling', 'refresh', 'decorating'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 8,
    views: 1650,
    likes: 123
  },
  {
    title: 'DIY Furniture Restoration: Beginner\'s Guide',
    content: 'Restoring old furniture is a rewarding way to create unique pieces while saving money. Learn beginner-friendly techniques for furniture restoration.',
    excerpt: 'Learn the basics of furniture restoration with safety tips, essential tools, and step-by-step techniques for beginners.',
    author: 'Robert Kim',
    category: 'diy',
    tags: ['diy', 'restoration', 'refinishing', 'woodworking', 'upcycling'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 12,
    views: 2200,
    likes: 167
  },
  {
    title: 'Furniture Trends 2024: What\'s In and What\'s Out',
    content: 'Stay ahead of the curve with the latest furniture trends for 2024. Discover what\'s trending in furniture design and home decor.',
    excerpt: 'Discover the latest furniture trends for 2024, from sustainable materials to emerging styles, and learn what to invest in.',
    author: 'Amanda Foster',
    category: 'trends',
    tags: ['trends', '2024', 'design', 'style', 'fashion'],
    featured: true,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 9,
    views: 4500,
    likes: 312
  },
  {
    title: 'Maximizing Storage in Every Room',
    content: 'Effective storage solutions can transform any space from cluttered to organized. Learn room-by-room storage strategies that actually work.',
    excerpt: 'Learn effective storage solutions for every room in your home, from living spaces to utility areas, with practical organization tips.',
    author: 'Maria Santos',
    category: 'space-planning',
    tags: ['storage', 'organization', 'decluttering', 'home-management', 'systems'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 11,
    views: 1900,
    likes: 145
  },
  {
    title: 'Creating a Cozy Reading Nook',
    content: 'A dedicated reading space can become your favorite spot in the house. Learn how to create the perfect reading nook that invites relaxation and focus.',
    excerpt: 'Design the perfect reading nook with comfortable seating, proper lighting, and cozy accessories that invite relaxation and focus.',
    author: 'Thomas Wilson',
    category: 'styling',
    tags: ['reading', 'cozy', 'nook', 'relaxation', 'home-library'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 7,
    views: 1400,
    likes: 98
  },
  {
    title: 'Furniture Arrangement for Better Flow',
    content: 'The way you arrange furniture can make or break a room\'s functionality and feel. Learn proven strategies for creating better flow in any space.',
    excerpt: 'Learn how to arrange furniture for better flow, improved functionality, and a more comfortable living space.',
    author: 'Rachel Green',
    category: 'space-planning',
    tags: ['arrangement', 'flow', 'layout', 'functionality', 'design'],
    featured: false,
    published: true,
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format',
      alt: 'Tip image',
      width: 800,
      height: 600
    },
    readTime: 8,
    views: 2100,
    likes: 156
  }
];

async function seedTips() {
  try {
    console.log('🌱 Starting tips seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing tips
    await Tip.deleteMany({});
    console.log('🗑️ Cleared existing tips');

    // Create tips
    const createdTips = await Tip.insertMany(tips);
    console.log(`✅ Created ${createdTips.length} tips`);

    console.log('🎉 Tips seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Tips: ${createdTips.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tips:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedTips();
}

export default seedTips;

