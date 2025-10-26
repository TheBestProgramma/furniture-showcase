import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order ID format' 
        },
        { status: 400 }
      );
    }

    // Find order by ID with populated items
    const order = await Order.findById(id)
      .populate('items.product', 'name price images description')
      .lean();

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      );
    }

    // Response data
    const response = {
      success: true,
      data: {
        order
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT method for updating order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const updateData = await request.json();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order ID format' 
        },
        { status: 400 }
      );
    }

    // Validate status updates
    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const allowedPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order status' 
        },
        { status: 400 }
      );
    }

    if (updateData.paymentStatus && !allowedPaymentStatuses.includes(updateData.paymentStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment status' 
        },
        { status: 400 }
      );
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product', 'name price images');

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE method for cancelling orders (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order ID format' 
        },
        { status: 400 }
      );
    }

    // Find order first
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order cannot be cancelled in current status' 
        },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const cancelledOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: 'cancelled',
        cancelledAt: new Date()
      },
      { new: true }
    );

    // Restore product stock
    for (const item of order.items) {
      await mongoose.model('Product').findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: item.quantity } }
      );
    }

    return NextResponse.json({
      success: true,
      data: cancelledOrder,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cancel order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

