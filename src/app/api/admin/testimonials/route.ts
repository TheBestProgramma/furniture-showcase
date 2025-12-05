import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

// GET all testimonials for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin access required' 
        },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const verified = searchParams.get('verified');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    } else if (featured === 'false') {
      filter.featured = false;
    }

    // Verified filter
    if (verified === 'true') {
      filter.verified = true;
    } else if (verified === 'false') {
      filter.verified = false;
    }

    // Rating filter
    if (rating) {
      const minRating = parseInt(rating);
      if (!isNaN(minRating)) {
        filter.rating = { $gte: minRating };
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [testimonials, totalCount] = await Promise.all([
      Testimonial.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        filters: {
          status: status || null,
          featured: featured || null,
          verified: verified || null,
          rating: rating || null,
          search: search || null,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch testimonials',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin access required' 
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    const { name, location, rating, text, product, image, verified, featured, status } = body;
    
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

    // Create new testimonial
    const testimonial = new Testimonial({
      name,
      location,
      rating: parseInt(rating),
      text,
      product: product || undefined,
      image: image || undefined,
      verified: verified || false,
      featured: featured || false,
      status: status || 'pending'
    });

    await testimonial.save();

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create testimonial',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

