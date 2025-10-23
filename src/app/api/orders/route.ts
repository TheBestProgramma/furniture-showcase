import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
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

    // Response data
    const response = {
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
    };

    return NextResponse.json(response);

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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      customer, 
      shippingAddress, 
      billingAddress, 
      items, 
      paymentMethod, 
      notes 
    } = body;

    // Validate required fields
    if (!customer || !shippingAddress || !items || !paymentMethod) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Customer, shipping address, items, and payment method are required' 
        },
        { status: 400 }
      );
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Product with ID ${item.product} not found` 
          },
          { status: 400 }
        );
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}` 
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0] || '/images/placeholder.jpg'
      });
    }

    // Calculate totals (simplified - in real app, use tax calculation service)
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const discount = 0; // Could be calculated from coupons
    const total = subtotal + tax + shipping - discount;

    // Create order
    const order = new Order({
      customer,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Update product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
