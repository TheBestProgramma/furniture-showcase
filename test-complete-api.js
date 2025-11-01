const baseUrl = 'http://localhost:3000';

// Test helper function
async function testEndpoint(name, url, expectedStatus = 200, method = 'GET', body = null) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`📡 ${method} ${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name} - Status: ${response.status}`);
      if (data.data) {
        if (Array.isArray(data.data)) {
          console.log(`📊 Found ${data.data.length} items`);
        } else if (data.data.products) {
          console.log(`📊 Found ${data.data.products.length} products`);
        } else if (data.data.tips) {
          console.log(`📊 Found ${data.data.tips.length} tips`);
        } else if (data.data.orders) {
          console.log(`📊 Found ${data.data.orders.length} orders`);
        } else if (data.data.categories) {
          console.log(`📊 Found ${data.data.categories.length} categories`);
        } else if (data.data.settings) {
          console.log(`📊 Settings loaded successfully`);
        }
      }
      return data;
    } else {
      console.log(`❌ ${name} - Expected ${expectedStatus}, got ${response.status}`);
      console.log(`📊 Response:`, JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error:`, error.message);
    return null;
  }
}

// Test all endpoints
async function runCompleteTests() {
  console.log('🚀 Starting Complete API Tests for Furniture Showcase');
  console.log('=' .repeat(70));

  // Test 1: Products API
  console.log('\n📦 PRODUCTS API TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint(
    'Get All Products',
    `${baseUrl}/api/products`
  );

  await testEndpoint(
    'Get Products with Pagination',
    `${baseUrl}/api/products?page=1&limit=5`
  );

  await testEndpoint(
    'Search Products',
    `${baseUrl}/api/products?search=sofa`
  );

  await testEndpoint(
    'Filter Products by Category',
    `${baseUrl}/api/products?category=sofas`
  );

  await testEndpoint(
    'Filter Featured Products',
    `${baseUrl}/api/products?featured=true`
  );

  // Test 2: Categories API
  console.log('\n📂 CATEGORIES API TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint(
    'Get Categories',
    `${baseUrl}/api/categories`
  );

  await testEndpoint(
    'Get Categories with Product Count',
    `${baseUrl}/api/categories?includeProductCount=true`
  );

  await testEndpoint(
    'Get Categories with Products',
    `${baseUrl}/api/categories?includeProducts=true&limit=3`
  );

  // Test 3: Tips API
  console.log('\n💡 TIPS API TESTS');
  console.log('-'.repeat(30));
  
  const tipsData = await testEndpoint(
    'Get All Tips',
    `${baseUrl}/api/tips`
  );

  await testEndpoint(
    'Get Tips with Pagination',
    `${baseUrl}/api/tips?page=1&limit=5`
  );

  await testEndpoint(
    'Search Tips',
    `${baseUrl}/api/tips?search=furniture`
  );

  await testEndpoint(
    'Filter Tips by Category',
    `${baseUrl}/api/tips?category=furniture-care`
  );

  await testEndpoint(
    'Get Featured Tips',
    `${baseUrl}/api/tips?featured=true`
  );

  // Test 4: Single Item Tests
  console.log('\n🔍 SINGLE ITEM TESTS');
  console.log('-'.repeat(30));
  
  // Get single product
  const productsResponse = await fetch(`${baseUrl}/api/products?limit=1`);
  const productsData = await productsResponse.json();
  
  if (productsData.data && productsData.data.products && productsData.data.products.length > 0) {
    const productId = productsData.data.products[0]._id;
    await testEndpoint(
      'Get Single Product',
      `${baseUrl}/api/products/${productId}`
    );
  }

  // Get single tip
  if (tipsData && tipsData.data && tipsData.data.tips && tipsData.data.tips.length > 0) {
    const tipId = tipsData.data.tips[0]._id;
    await testEndpoint(
      'Get Single Tip',
      `${baseUrl}/api/tips/${tipId}`
    );
  }

  // Test 5: Orders API
  console.log('\n📋 ORDERS API TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint(
    'Get Orders',
    `${baseUrl}/api/orders`
  );

  await testEndpoint(
    'Get Orders with Pagination',
    `${baseUrl}/api/orders?page=1&limit=5`
  );

  // Test creating an order (mock data)
  const mockOrder = {
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    items: [
      {
        product: '507f1f77bcf86cd799439011', // Mock product ID
        quantity: 1
      }
    ],
    paymentMethod: 'credit_card',
    notes: 'Test order'
  };

  await testEndpoint(
    'Create Order (Mock)',
    `${baseUrl}/api/orders`,
    400, // Expected to fail due to invalid product ID
    'POST',
    mockOrder
  );

  // Test 6: Settings API
  console.log('\n⚙️ SETTINGS API TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint(
    'Get Settings',
    `${baseUrl}/api/settings`
  );

  // Test updating settings
  const settingsUpdate = {
    siteName: 'Updated Furniture Showcase',
    contactInfo: {
      email: 'updated@furnitureshowcase.com',
      phone: '+1 (555) 999-8888',
      address: {
        street: '456 Updated Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      }
    }
  };

  await testEndpoint(
    'Update Settings',
    `${baseUrl}/api/settings`,
    200,
    'PUT',
    settingsUpdate
  );

  // Test 7: Error Handling Tests
  console.log('\n❌ ERROR HANDLING TESTS');
  console.log('-'.repeat(30));
  
  await testEndpoint(
    'Get Invalid Product ID',
    `${baseUrl}/api/products/invalid-id`,
    400
  );

  await testEndpoint(
    'Get Invalid Tip ID',
    `${baseUrl}/api/tips/invalid-id`,
    400
  );

  await testEndpoint(
    'Get Non-existent Product',
    `${baseUrl}/api/products/507f1f77bcf86cd799439011`,
    404
  );

  await testEndpoint(
    'Get Non-existent Tip',
    `${baseUrl}/api/tips/507f1f77bcf86cd799439011`,
    404
  );

  console.log('\n🎉 Complete API Testing Finished!');
  console.log('=' .repeat(70));
  console.log('📋 Available Endpoints:');
  console.log('   - GET /api/products (with filtering, search, pagination)');
  console.log('   - GET /api/products/[id] (single product with related)');
  console.log('   - GET /api/categories (with product count/products)');
  console.log('   - GET /api/tips (with filtering, search, pagination)');
  console.log('   - GET /api/tips/[id] (single tip with related)');
  console.log('   - GET /api/orders (with filtering, pagination)');
  console.log('   - POST /api/orders (create new order)');
  console.log('   - PUT /api/orders/[id] (update order status)');
  console.log('   - GET /api/settings (get site settings)');
  console.log('   - PUT /api/settings (update site settings)');
}

// Run tests
runCompleteTests().catch(console.error);





