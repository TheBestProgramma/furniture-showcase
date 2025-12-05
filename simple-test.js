// Simple API test - run this after starting the dev server
const baseUrl = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Furniture Showcase API...\n');

  try {
    // Test 1: Get all products
    console.log('1. Testing GET /api/products');
    const response = await fetch(`${baseUrl}/api/products`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success! Found', data.data.products.length, 'products');
      console.log('📊 Pagination:', data.data.pagination);
    } else {
      console.log('❌ Error:', data.error);
    }

    // Test 2: Get categories
    console.log('\n2. Testing GET /api/categories');
    const catResponse = await fetch(`${baseUrl}/api/categories`);
    const catData = await catResponse.json();
    
    if (catResponse.ok) {
      console.log('✅ Success! Found', catData.data.categories.length, 'categories');
    } else {
      console.log('❌ Error:', catData.error);
    }

    // Test 3: Search products
    console.log('\n3. Testing search functionality');
    const searchResponse = await fetch(`${baseUrl}/api/products?search=sofa`);
    const searchData = await searchResponse.json();
    
    if (searchResponse.ok) {
      console.log('✅ Search success! Found', searchData.data.products.length, 'sofa products');
    } else {
      console.log('❌ Search error:', searchData.error);
    }

    // Test 4: Filter by price
    console.log('\n4. Testing price filtering');
    const priceResponse = await fetch(`${baseUrl}/api/products?minPrice=100&maxPrice=500`);
    const priceData = await priceResponse.json();
    
    if (priceResponse.ok) {
      console.log('✅ Price filter success! Found', priceData.data.products.length, 'products in price range');
    } else {
      console.log('❌ Price filter error:', priceData.error);
    }

    console.log('\n🎉 API testing complete!');
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('💡 Make sure the dev server is running: npm run dev');
  }
}

testAPI();








