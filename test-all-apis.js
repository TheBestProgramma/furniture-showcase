const baseUrl = 'http://localhost:3000';

// Test helper function
async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
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
        } else if (data.data.categories) {
          console.log(`📊 Found ${data.data.categories.length} categories`);
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
async function runTests() {
  console.log('🚀 Starting Comprehensive API Tests for Furniture Showcase');
  console.log('=' .repeat(60));

  // Test 1: Get all products
  await testEndpoint(
    'Get All Products',
    `${baseUrl}/api/products`
  );

  // Test 2: Get products with pagination
  await testEndpoint(
    'Get Products with Pagination',
    `${baseUrl}/api/products?page=1&limit=5`
  );

  // Test 3: Search products
  await testEndpoint(
    'Search Products',
    `${baseUrl}/api/products?search=sofa`
  );

  // Test 4: Filter by category
  await testEndpoint(
    'Filter Products by Category',
    `${baseUrl}/api/products?category=sofas`
  );

  // Test 5: Get categories
  const categoriesData = await testEndpoint(
    'Get Categories',
    `${baseUrl}/api/categories`
  );

  // Test 6: Get categories with product count
  await testEndpoint(
    'Get Categories with Product Count',
    `${baseUrl}/api/categories?includeProductCount=true`
  );

  // Test 7: Get categories with products
  await testEndpoint(
    'Get Categories with Products',
    `${baseUrl}/api/categories?includeProducts=true&limit=3`
  );

  // Test 8: Get all tips
  const tipsData = await testEndpoint(
    'Get All Tips',
    `${baseUrl}/api/tips`
  );

  // Test 9: Get tips with pagination
  await testEndpoint(
    'Get Tips with Pagination',
    `${baseUrl}/api/tips?page=1&limit=5`
  );

  // Test 10: Search tips
  await testEndpoint(
    'Search Tips',
    `${baseUrl}/api/tips?search=furniture`
  );

  // Test 11: Filter tips by category
  await testEndpoint(
    'Filter Tips by Category',
    `${baseUrl}/api/tips?category=furniture-care`
  );

  // Test 12: Get featured tips
  await testEndpoint(
    'Get Featured Tips',
    `${baseUrl}/api/tips?featured=true`
  );

  // Test 13: Get single tip (if we have tips)
  if (tipsData && tipsData.data && tipsData.data.tips && tipsData.data.tips.length > 0) {
    const tipId = tipsData.data.tips[0]._id;
    await testEndpoint(
      'Get Single Tip',
      `${baseUrl}/api/tips/${tipId}`
    );
  }

  // Test 14: Get single product (if we have products)
  const productsResponse = await fetch(`${baseUrl}/api/products?limit=1`);
  const productsData = await productsResponse.json();
  
  if (productsData.data && productsData.data.products && productsData.data.products.length > 0) {
    const productId = productsData.data.products[0]._id;
    await testEndpoint(
      'Get Single Product',
      `${baseUrl}/api/products/${productId}`
    );
  }

  // Test 15: Test invalid IDs
  await testEndpoint(
    'Get Invalid Tip ID',
    `${baseUrl}/api/tips/invalid-id`,
    400
  );

  await testEndpoint(
    'Get Invalid Product ID',
    `${baseUrl}/api/products/invalid-id`,
    400
  );

  // Test 16: Test non-existent IDs
  await testEndpoint(
    'Get Non-existent Tip ID',
    `${baseUrl}/api/tips/507f1f77bcf86cd799439011`,
    404
  );

  await testEndpoint(
    'Get Non-existent Product ID',
    `${baseUrl}/api/products/507f1f77bcf86cd799439011`,
    404
  );

  console.log('\n🎉 Comprehensive API Testing Complete!');
  console.log('=' .repeat(60));
  console.log('📋 Available Endpoints:');
  console.log('   - GET /api/products (with filtering, search, pagination)');
  console.log('   - GET /api/products/[id] (single product with related)');
  console.log('   - GET /api/categories (with product count/products)');
  console.log('   - GET /api/tips (with filtering, search, pagination)');
  console.log('   - GET /api/tips/[id] (single tip with related)');
}

// Run tests
runTests().catch(console.error);
