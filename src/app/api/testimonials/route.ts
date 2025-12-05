import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

// GET /api/testimonials - Get all approved testimonials with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const verified = searchParams.get('verified');
    const limit = searchParams.get('limit');
    const rating = searchParams.get('rating');

    // Build filter - only show approved testimonials to public
    const filter: any = {
      status: 'approved'
    };

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Verified filter
    if (verified === 'true') {
      filter.verified = true;
    }

    // Rating filter
    if (rating) {
      const minRating = parseInt(rating);
      if (!isNaN(minRating)) {
        filter.rating = { $gte: minRating };
      }
    }

    // Build query
    let query = Testimonial.find(filter).sort({ createdAt: -1 });

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        query = query.limit(limitNum);
      }
    }

    const testimonials = await query.lean();

    // Transform to match expected format
    const formattedTestimonials = testimonials.map((t: any) => ({
      id: t._id.toString(),
      name: t.name,
      location: t.location,
      rating: t.rating,
      text: t.text,
      image: t.image || undefined,
      product: t.product || undefined,
      date: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
      verified: t.verified,
      featured: t.featured
    }));

    return NextResponse.json({
      success: true,
      data: formattedTestimonials,
      count: formattedTestimonials.length,
      total: formattedTestimonials.length
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create a new testimonial (public endpoint)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const { name, location, rating, text, product, image } = body;
    
    if (!name || !location || !rating || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, location, rating, text' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create new testimonial - starts as pending and needs admin approval
    const testimonial = new Testimonial({
      name,
      location,
      rating: parseInt(rating),
      text,
      product: product || undefined,
      image: image || undefined,
      verified: false, // New testimonials start as unverified
      featured: false, // New testimonials start as not featured
      status: 'pending' // Requires admin approval
    });

    await testimonial.save();

    // Return formatted testimonial
    const formattedTestimonial = {
      id: testimonial._id.toString(),
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      text: testimonial.text,
      image: testimonial.image || undefined,
      product: testimonial.product || undefined,
      date: testimonial.createdAt,
      verified: testimonial.verified,
      featured: testimonial.featured
    };

    return NextResponse.json({
      success: true,
      data: formattedTestimonial,
      message: 'Testimonial submitted successfully. It will be reviewed by an administrator.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}











