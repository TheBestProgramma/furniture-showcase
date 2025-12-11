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
      console.log(`📊 Response:`, JSON.stringify(data, null, 2));
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
  console.log('🚀 Starting API Tests for Furniture Showcase');
  console.log('=' .repeat(50));

  // Test 1: Get all products (basic)
  await testEndpoint(
    'Get All Products (Basic)',
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
    'Filter by Category',
    `${baseUrl}/api/products?category=sofas`
  );

  // Test 5: Filter by price range
  await testEndpoint(
    'Filter by Price Range',
    `${baseUrl}/api/products?minPrice=100&maxPrice=500`
  );

  // Test 6: Filter featured products
  await testEndpoint(
    'Filter Featured Products',
    `${baseUrl}/api/products?featured=true`
  );

  // Test 7: Filter on-sale products
  await testEndpoint(
    'Filter On-Sale Products',
    `${baseUrl}/api/products?onSale=true`
  );

  // Test 8: Filter in-stock products
  await testEndpoint(
    'Filter In-Stock Products',
    `${baseUrl}/api/products?inStock=true`
  );

  // Test 9: Sort products
  await testEndpoint(
    'Sort Products by Price (Ascending)',
    `${baseUrl}/api/products?sortBy=price&sortOrder=asc`
  );

  // Test 10: Complex filtering
  await testEndpoint(
    'Complex Filtering',
    `${baseUrl}/api/products?category=chairs&minPrice=200&maxPrice=800&featured=true&sortBy=price&sortOrder=desc`
  );

  // Test 11: Get categories
  const categoriesData = await testEndpoint(
    'Get Categories',
    `${baseUrl}/api/categories`
  );

  // Test 12: Get categories with product count
  await testEndpoint(
    'Get Categories with Product Count',
    `${baseUrl}/api/categories?includeProductCount=true`
  );

  // Test 13: Get single product (if we have products)
  if (categoriesData && categoriesData.data && categoriesData.data.categories.length > 0) {
    // First get a product ID
    const productsResponse = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (productsData.data && productsData.data.products.length > 0) {
      const productId = productsData.data.products[0]._id;
      await testEndpoint(
        'Get Single Product',
        `${baseUrl}/api/products/${productId}`
      );
    }
  }

  // Test 14: Test invalid product ID
  await testEndpoint(
    'Get Invalid Product ID',
    `${baseUrl}/api/products/invalid-id`,
    404
  );

  // Test 15: Test non-existent product ID
  await testEndpoint(
    'Get Non-existent Product ID',
    `${baseUrl}/api/products/507f1f77bcf86cd799439011`,
    404
  );

  console.log('\n🎉 API Testing Complete!');
  console.log('=' .repeat(50));
}

// Run tests
runTests().catch(console.error);

