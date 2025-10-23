import connectDB from './mongodb';
import Tip from './models/Tip';

const tips = [
  {
    title: 'How to Choose the Perfect Sofa for Your Living Room',
    content: 'Choosing the right sofa is one of the most important decisions when furnishing your living room. Consider size, style, fabric, comfort, and quality factors for your living space.',
    excerpt: 'Learn how to select the perfect sofa by considering size, style, fabric, comfort, and quality factors for your living space.',
    author: 'Sarah Johnson',
    category: 'buying-guide',
    tags: ['sofa', 'living-room', 'furniture-selection', 'home-decor'],
    featured: true,
    published: true,
    image: '/images/tips/sofa-guide.jpg',
    readTime: 8,
    views: 1250,
    likes: 89
  },
  {
    title: 'Essential Furniture Care Tips for Longevity',
    content: 'Proper furniture care can extend the life of your pieces by decades. Learn essential maintenance tips for wood, upholstery, and leather furniture.',
    excerpt: 'Discover essential maintenance tips to keep your furniture looking new for years, including care for wood, upholstery, and leather pieces.',
    author: 'Michael Chen',
    category: 'furniture-care',
    tags: ['maintenance', 'wood-care', 'upholstery', 'leather-care', 'longevity'],
    featured: true,
    published: true,
    image: '/images/tips/furniture-care.jpg',
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
    image: '/images/tips/small-space.jpg',
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
    image: '/images/tips/sustainable-furniture.jpg',
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
    image: '/images/tips/home-office.jpg',
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
    image: '/images/tips/spring-styling.jpg',
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
    image: '/images/tips/diy-restoration.jpg',
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
    image: '/images/tips/furniture-trends.jpg',
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
    image: '/images/tips/storage-solutions.jpg',
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
    image: '/images/tips/reading-nook.jpg',
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
    image: '/images/tips/furniture-flow.jpg',
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
