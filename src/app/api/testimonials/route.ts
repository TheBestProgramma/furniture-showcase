import { NextRequest, NextResponse } from 'next/server';
import { mockTestimonials, getFeaturedTestimonials, getTestimonialsByCategory, getVerifiedTestimonials } from '@/lib/types/testimonials';

// GET /api/testimonials - Get all testimonials with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const verified = searchParams.get('verified');
    const limit = searchParams.get('limit');
    const rating = searchParams.get('rating');

    let testimonials = mockTestimonials;

    // Apply filters
    if (featured === 'true') {
      testimonials = getFeaturedTestimonials();
    }

    if (verified === 'true') {
      testimonials = testimonials.filter(t => t.verified);
    }

    if (category && category !== 'all') {
      testimonials = getTestimonialsByCategory(category);
    }

    if (rating) {
      const minRating = parseInt(rating);
      if (!isNaN(minRating)) {
        testimonials = testimonials.filter(t => t.rating >= minRating);
      }
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        testimonials = testimonials.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
      total: mockTestimonials.length
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create a new testimonial (for future backend integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, location, rating, text, product, image } = body;
    
    if (!name || !location || !rating || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create new testimonial (in a real app, this would save to database)
    const newTestimonial = {
      id: `testimonial_${Date.now()}`,
      name,
      location,
      rating: parseInt(rating),
      text,
      image: image || null,
      product: product || null,
      date: new Date(),
      verified: false, // New testimonials start as unverified
      featured: false // New testimonials start as not featured
    };

    // In a real application, you would save this to your database here
    // For now, we'll just return the created testimonial
    console.log('New testimonial created:', newTestimonial);

    return NextResponse.json({
      success: true,
      data: newTestimonial,
      message: 'Testimonial created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

