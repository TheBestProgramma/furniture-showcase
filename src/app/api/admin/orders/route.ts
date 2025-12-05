import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// GET all orders for admin
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
    const paymentStatus = searchParams.get('paymentStatus');
    const customerEmail = searchParams.get('customerEmail');
    const orderNumber = searchParams.get('orderNumber');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Payment status filter
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // Customer email filter
    if (customerEmail) {
      filter['customer.email'] = customerEmail;
    }

    // Order number filter
    if (orderNumber) {
      filter.orderNumber = { $regex: orderNumber, $options: 'i' };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'name price images')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        orders,
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
          paymentStatus: paymentStatus || null,
          customerEmail: customerEmail || null,
          orderNumber: orderNumber || null,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}




