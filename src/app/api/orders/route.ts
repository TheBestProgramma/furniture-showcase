import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { sanitizeInput, isValidEmail, isValidPhoneNumber, validateTextInput } from '@/lib/security';

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
    console.log('Order creation request received:', {
      hasCustomer: !!body.customer,
      hasShippingAddress: !!body.shippingAddress,
      itemsCount: body.items?.length || 0,
      paymentMethod: body.paymentMethod
    });

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

    console.log(`Processing ${items.length} items...`);

    for (const item of items) {
      // Validate product ID exists
      if (!item.product) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Product ID is required for item: ${item.name || 'Unknown'}` 
          },
          { status: 400 }
        );
      }

      // Find product by ID (MongoDB handles both ObjectId and string IDs)
      console.log(`Looking for product with ID: ${item.product}`);
      let product = await Product.findById(item.product);

      // If not found by ID, try to find by name as fallback (for backward compatibility)
      if (!product && item.name) {
        console.log(`Product not found by ID, trying to find by name: ${item.name}`);
        product = await Product.findOne({ name: item.name });
      }
      
      if (product) {
        console.log(`Found product: ${product.name}, Stock: ${product.stockQuantity}, Price: ${product.price}`);
      }

      if (!product) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Product with ID "${item.product}" not found for item: ${item.name || 'Unknown'}. Please remove this item from your cart and try again.` 
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

      // Extract image URL - handle both string and object formats
      let imageUrl = '/images/placeholder.jpg';
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        if (typeof firstImage === 'string') {
          imageUrl = firstImage;
        } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
          imageUrl = firstImage.url;
        }
      }

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: imageUrl
      });
    }

    // Calculate totals (Kenyan market pricing)
    const tax = Math.round(subtotal * 0.16); // 16% VAT
    const shipping = subtotal >= 100000 ? 0 : 15000; // Free shipping over KSh 100,000
    const discount = 0; // Could be calculated from coupons
    const total = subtotal + tax + shipping - discount;

    // Validate and sanitize customer information
    if (!customer.name || !customer.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Customer name and email are required' 
        },
        { status: 400 }
      );
    }

    // Sanitize customer data
    const nameValidation = validateTextInput(customer.name, 2, 100);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { success: false, error: nameValidation.error },
        { status: 400 }
      );
    }

    if (!isValidEmail(customer.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (customer.phone && !isValidPhoneNumber(customer.phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Sanitize customer data
    const sanitizedCustomer = {
      name: nameValidation.sanitized,
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone ? sanitizeInput(customer.phone) : undefined
    };

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Complete shipping address is required (street, city, state, zipCode, country)' 
        },
        { status: 400 }
      );
    }

    // Create order
    try {
      // Generate order number
      let orderNumber: string;
      try {
        const orderCount = await Order.countDocuments();
        orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;
      } catch (countError) {
        // Fallback to timestamp-based order number
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        orderNumber = `ORD-${timestamp}-${random}`;
      }

      console.log('Creating order with data:', {
        orderNumber,
        customerName: customer?.name,
        itemsCount: validatedItems.length,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod
      });

      // Sanitize shipping address
      const sanitizedShippingAddress = {
        street: sanitizeInput(shippingAddress.street),
        city: sanitizeInput(shippingAddress.city),
        state: sanitizeInput(shippingAddress.state),
        zipCode: sanitizeInput(shippingAddress.zipCode),
        country: sanitizeInput(shippingAddress.country)
      };

      // Sanitize billing address if provided
      const sanitizedBillingAddress = billingAddress ? {
        street: sanitizeInput(billingAddress.street),
        city: sanitizeInput(billingAddress.city),
        state: sanitizeInput(billingAddress.state),
        zipCode: sanitizeInput(billingAddress.zipCode),
        country: sanitizeInput(billingAddress.country)
      } : sanitizedShippingAddress;

      const order = new Order({
        orderNumber, // Explicitly set order number
        customer: sanitizedCustomer,
        shippingAddress: sanitizedShippingAddress,
        billingAddress: sanitizedBillingAddress,
        items: validatedItems,
        subtotal,
        tax,
        shipping,
        discount: discount || 0,
        total,
        paymentMethod,
        notes: notes ? sanitizeInput(notes) : '',
        status: 'pending',
        paymentStatus: 'pending'
      });

      await order.save();
      console.log(`Order created successfully: ${order.orderNumber} (${order._id})`);

      // Update product stock
      for (const item of validatedItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stockQuantity: -item.quantity } }
        );
      }

      // Convert order to plain object for JSON response
      const orderData = order.toObject ? order.toObject() : order;

      return NextResponse.json({
        success: true,
        data: { order: orderData }
      }, { status: 201 });
    } catch (orderError) {
      // Handle order creation/validation errors separately
      console.error('Error saving order:', orderError);
      throw orderError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('Error creating order:', error);
    
    // Extract detailed error message
    let errorMessage = 'Failed to create order';
    let detailedMessage = 'Unknown error';
    
    if (error instanceof Error) {
      detailedMessage = error.message;
      // Check if it's a MongoDB validation error
      if (error.name === 'ValidationError' && (error as any).errors) {
        const validationErrors = Object.values((error as any).errors)
          .map((err: any) => err.message)
          .join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
        detailedMessage = validationErrors;
      } else if (error.message) {
        errorMessage = error.message;
        detailedMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: detailedMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error instanceof Error ? error.stack : undefined 
        })
      },
      { status: 500 }
    );
  }
}


