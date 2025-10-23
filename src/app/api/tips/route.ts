import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tip from '@/lib/models/Tip';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published') || 'true';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Published filter (default to published only)
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

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
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

    // Response data
    const response = {
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
        },
        filters: {
          category: category || null,
          search: search || null,
          featured: featured === 'true' || null,
          published: published === 'true',
          sortBy,
          sortOrder
        }
      }
    };

    return NextResponse.json(response);

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

// POST method for creating tips (admin only - for future implementation)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      title, 
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
    if (!title || !content || !excerpt || !author || !category || !image || !readTime) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, content, excerpt, author, category, image, and readTime are required' 
        },
        { status: 400 }
      );
    }

    // Create new tip
    const tip = new Tip({
      title,
      content,
      excerpt,
      author,
      category,
      tags: tags || [],
      featured: featured || false,
      published: published || false,
      image,
      readTime,
      seoTitle,
      seoDescription
    });

    await tip.save();

    return NextResponse.json({
      success: true,
      data: tip
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
