import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tip from '@/lib/models/Tip';

// GET all tips (including unpublished) for admin
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const published = searchParams.get('published'); // 'true', 'false', or undefined (all)
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object - admin can see all tips
    const filter: any = {};

    // Published filter (if specified)
    if (published === 'true') {
      filter.published = true;
    } else if (published === 'false') {
      filter.published = false;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter (text search across title, content, and excerpt)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [tips, totalCount] = await Promise.all([
      Tip.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Tip.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        tips,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tips',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new tip (admin only)
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
    const { 
      title, 
      slug,
      content, 
      excerpt, 
      author, 
      category, 
      tags, 
      featured, 
      published, 
      image, 
      readTime, 
      seoTitle, 
      seoDescription 
    } = body;

    // Validate required fields
    if (!title || !content || !excerpt || !author || !category || !image?.url || !readTime) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, content, excerpt, author, category, image, and readTime are required' 
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.trim().length < 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content must be at least 100 characters' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTip = await Tip.findOne({ slug: slug || title.toLowerCase().replace(/\s+/g, '-') });
    if (existingTip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A tip with this slug already exists' 
        },
        { status: 400 }
      );
    }

    // Create new tip
    const tip = new Tip({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      content,
      excerpt,
      author,
      category,
      tags: tags || [],
      featured: featured || false,
      published: published || false,
      publishedAt: published ? new Date() : null,
      image: {
        url: image.url,
        alt: image.alt || title,
        width: image.width,
        height: image.height
      },
      readTime,
      seoTitle,
      seoDescription
    });

    await tip.save();

    return NextResponse.json({
      success: true,
      data: tip,
      message: 'Tip created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create tip',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

