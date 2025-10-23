import connectDB from './mongodb';
import Category from './models/Category';
import Product from './models/Product';

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Successfully connected to MongoDB');

    // Test basic operations
    console.log('📊 Testing database operations...');
    
    // Count documents
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log(`📈 Database statistics:`);
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Products: ${productCount}`);

    // Test a simple query
    const featuredProducts = await Product.find({ featured: true }).limit(3);
    console.log(`⭐ Featured products found: ${featuredProducts.length}`);

    // Test category with products
    const categoriesWithProducts = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' }
        }
      }
    ]);

    console.log('📋 Categories with product counts:');
    categoriesWithProducts.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.productCount} products`);
    });

    console.log('🎉 Database connection test completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection();
}

export default testConnection;
