import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeProductCount = searchParams.get('includeProductCount') === 'true';
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0');

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: { isActive: true } },
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
    }

    // Add actual products if requested
    if (includeProducts) {
      pipeline.push({
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products',
          pipeline: [
            { $sort: { featured: -1, createdAt: -1 } },
            { $limit: limit || 6 }
          ]
        }
      });
    }

    // Remove products array if we only want count
    if (includeProductCount && !includeProducts) {
      pipeline.push({
        $project: {
          products: 0
        }
      });
    }

    const categories = await Category.aggregate(pipeline);

    // Response data
    const response = {
      success: true,
      data: {
        categories,
        total: categories.length
      }
    };

    return NextResponse.json(response);

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

// POST method for creating categories (admin only - for future implementation)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, image, parentCategory, sortOrder, seoTitle, seoDescription } = body;

    // Validate required fields
    if (!name || !description || !image) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, description, and image are required' 
        },
        { status: 400 }
      );
    }

    // Create new category
    const category = new Category({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      seoTitle,
      seoDescription
    });

    await category.save();

    return NextResponse.json({
      success: true,
      data: category
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
