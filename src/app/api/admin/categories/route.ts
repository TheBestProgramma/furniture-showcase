import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';

// GET all categories (including inactive) for admin
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
    const includeProductCount = searchParams.get('includeProductCount') === 'true';

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $sort: { sortOrder: 1, name: 1 } }
    ];

    // Add product count if requested
    if (includeProductCount) {
      pipeline.push({
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      });
      pipeline.push({
        $addFields: {
          productCount: { $size: '$products' }
        }
      });
      pipeline.push({
        $project: {
          products: 0
        }
      });
    }

    const categories = await Category.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        total: categories.length
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new category (admin only)
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
    const { name, slug, description, image, parentCategory, sortOrder, isActive, seoTitle, seoDescription } = body;

    // Validate required fields
    if (!name || !slug || !description || !image?.url) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, slug, description, and image are required' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A category with this slug already exists' 
        },
        { status: 400 }
      );
    }

    // Create new category
    const category = new Category({
      name,
      slug,
      description,
      image: {
        url: image.url,
        alt: image.alt || name,
        width: image.width,
        height: image.height
      },
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      seoTitle,
      seoDescription
    });

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}




