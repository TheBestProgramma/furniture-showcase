import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// GET all unique customers for admin
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
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'lastOrderDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Aggregate to get unique customers with order statistics
    const matchStage: any = {};
    
    if (search) {
      matchStage.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $group: {
          _id: '$customer.email',
          name: { $first: '$customer.name' },
          email: { $first: '$customer.email' },
          phone: { $first: '$customer.phone' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          firstOrderDate: { $min: '$createdAt' },
          lastOrderDate: { $max: '$createdAt' },
          orderIds: { $push: '$_id' },
          orderNumbers: { $push: '$orderNumber' }
        }
      }
    ];

    // Add sorting
    const sortStage: any = {};
    if (sortBy === 'name') {
      sortStage.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'email') {
      sortStage.email = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'totalOrders') {
      sortStage.totalOrders = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'totalSpent') {
      sortStage.totalSpent = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortStage.lastOrderDate = sortOrder === 'desc' ? -1 : 1;
    }
    pipeline.push({ $sort: sortStage });

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Order.aggregate(countPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const customers = await Order.aggregate(pipeline);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        customers,
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
          search: search || null,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

