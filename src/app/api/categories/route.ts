import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeProductCount = searchParams.get('includeProductCount') === 'true';

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
      pipeline.push({
        $project: {
          products: 0 // Remove the products array, keep only count
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
