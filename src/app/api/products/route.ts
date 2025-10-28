import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Search filter (text search across name and description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Boolean filters
    if (featured === 'true') filter.featured = true;
    if (onSale === 'true') filter.onSale = true;
    if (inStock === 'true') filter.inStock = true;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with population
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Response data
    const response = {
      success: true,
      data: {
        products,
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
          minPrice: minPrice ? parseFloat(minPrice) : null,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
          featured: featured === 'true' || null,
          onSale: onSale === 'true' || null,
          inStock: inStock === 'true' || null,
          sortBy,
          sortOrder
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
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
    console.log('Received product data:', body);
    const {
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      material,
      dimensions,
      weight,
      color,
      inStock,
      stockQuantity,
      images,
      features,
      tags,
      isActive,
      isFeatured,
      discount,
      sku,
      rating,
      reviewCount
    } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !sku) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Name, description, price, category, and SKU are required'
        },
        { status: 400 }
      );
    }

    // Validate material if provided
    const validMaterials = ['wood', 'metal', 'fabric', 'leather', 'plastic', 'glass', 'ceramic', 'stone', 'mixed'];
    if (material && !validMaterials.includes(material)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid material',
          message: `Material must be one of: ${validMaterials.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Handle category - if it's a string, try to find or create the category
    let categoryId = category;
    if (typeof category === 'string') {
      let categoryDoc = await Category.findOne({ 
        $or: [
          { name: category },
          { slug: category.toLowerCase().replace(/\s+/g, '-') }
        ]
      });
      
      if (!categoryDoc) {
        // Create a new category if it doesn't exist
        categoryDoc = new Category({
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, '-'),
          description: `Products in the ${category} category`,
          image: {
            url: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(category),
            alt: category
          },
          isActive: true,
          sortOrder: 0
        });
        await categoryDoc.save();
      }
      categoryId = categoryDoc._id;
    }

    // Check if product with same SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SKU already exists',
          message: 'A product with this SKU already exists'
        },
        { status: 400 }
      );
    }

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      category: categoryId,
      subcategory,
      brand,
      material: material ? [material] : ['mixed'],
      dimensions: {
        width: dimensions?.width || 0,
        height: dimensions?.height || 0,
        depth: dimensions?.length || 0,
        weight: weight || 0
      },
      color: color || 'Unknown',
      inStock: inStock !== undefined ? inStock : true,
      stockQuantity: stockQuantity || 0,
      images: images ? images.map((url: string) => ({ url, isPrimary: false })) : [],
      tags: tags || [],
      featured: isFeatured || false,
      onSale: discount > 0,
      discountPercentage: discount || 0,
      sku,
      rating: {
        average: rating || 0,
        count: reviewCount || 0
      },
      reviews: []
    });

    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID is required',
          message: 'Product ID is required for updates'
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found',
          message: 'Product with this ID does not exist'
        },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product ID is required',
          message: 'Product ID is required for deletion'
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found',
          message: 'Product with this ID does not exist'
        },
        { status: 404 }
      );
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


