/**
 * Migration script to import mock testimonials into the database
 * 
 * Run this script once to migrate existing hardcoded testimonials to the database.
 * After running, you can manage testimonials through the admin panel.
 * 
 * Usage: node scripts/migrate-testimonials.js
 * 
 * Note: Make sure your MongoDB connection string is set in your .env file
 */

const { MongoClient } = require('mongodb');
const path = require('path');

// Import the mock testimonials
const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Mwangi',
    location: 'Nairobi, Kenya',
    rating: 5,
    text: 'Absolutely love my new leather sofa! The quality is exceptional and it fits perfectly in my living room. The delivery was prompt and the customer service was outstanding.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&auto=format&q=80&ixlib=rb-4.0.3',
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

async function migrateTestimonials() {
  let client;
  
  try {
    // Get MongoDB URI from environment or use fallback from mongodb.ts
    const mongoUri = process.env.MONGODB_URI || 
      'mongodb+srv://kiptoosolomon07_db_user:2G6Wxh9dldyYTqT7@cluster0.vb1x2md.mongodb.net/furniture-showcase?retryWrites=true&w=majority&appName=Cluster0';
    
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.log('Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    console.log('Connecting to database...');
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected successfully!');

    const db = client.db();
    const testimonialsCollection = db.collection('testimonials');

    console.log(`\nMigrating ${mockTestimonials.length} testimonials...`);

    let imported = 0;
    let skipped = 0;

    for (const testimonial of mockTestimonials) {
      // Check if testimonial already exists (by name and text)
      const existing = await testimonialsCollection.findOne({
        name: testimonial.name,
        text: testimonial.text
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${testimonial.name} (already exists)`);
        skipped++;
        continue;
      }

      // Create new testimonial document
      const newTestimonial = {
        name: testimonial.name,
        location: testimonial.location,
        rating: testimonial.rating,
        text: testimonial.text,
        image: testimonial.image || undefined,
        product: testimonial.product || undefined,
        verified: testimonial.verified,
        featured: testimonial.featured,
        status: 'approved', // Auto-approve existing testimonials
        createdAt: testimonial.date || new Date(),
        updatedAt: new Date()
      };

      await testimonialsCollection.insertOne(newTestimonial);
      console.log(`✅ Imported: ${testimonial.name}`);
      imported++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   - Imported: ${imported}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${mockTestimonials.length}`);

    await client.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

// Run migration
migrateTestimonials();

