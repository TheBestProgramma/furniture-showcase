/**
 * Migration script to import mock testimonials into the database
 * 
 * Run this script once to migrate existing hardcoded testimonials to the database.
 * After running, you can manage testimonials through the admin panel.
 * 
 * Usage: npx ts-node scripts/migrate-testimonials.ts
 */

import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb';
import Testimonial from '../src/lib/models/Testimonial';
import { mockTestimonials } from '../src/lib/types/testimonials';

async function migrateTestimonials() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected successfully!');

    console.log(`\nMigrating ${mockTestimonials.length} testimonials...`);

    let imported = 0;
    let skipped = 0;

    for (const testimonial of mockTestimonials) {
      // Check if testimonial already exists (by name and text)
      const existing = await Testimonial.findOne({
        name: testimonial.name,
        text: testimonial.text
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${testimonial.name} (already exists)`);
        skipped++;
        continue;
      }

      // Create new testimonial
      const newTestimonial = new Testimonial({
        name: testimonial.name,
        location: testimonial.location,
        rating: testimonial.rating,
        text: testimonial.text,
        image: testimonial.image || undefined,
        product: testimonial.product || undefined,
        verified: testimonial.verified,
        featured: testimonial.featured,
        status: 'approved' // Auto-approve existing testimonials
      });

      await newTestimonial.save();
      console.log(`✅ Imported: ${testimonial.name}`);
      imported++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   - Imported: ${imported}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${mockTestimonials.length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrateTestimonials();


