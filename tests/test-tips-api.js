#!/usr/bin/env node

/**
 * Quick test script for Tips API
 */

// Using built-in fetch (Node.js 18+)

async function testTipsAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Tips API...\n');
  
  try {
    // Test basic tips endpoint
    console.log('1. Testing /api/tips...');
    const response = await fetch(`${baseUrl}/api/tips`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Data keys: ${Object.keys(data.data || {}).join(', ')}`);
    
    if (data.data && data.data.tips) {
      console.log(`   Tips count: ${data.data.tips.length}`);
    }
    
    if (data.error) {
      console.log(`   Error: ${data.error}`);
    }
    
    console.log('\n2. Testing /api/tips with parameters...');
    const paramsResponse = await fetch(`${baseUrl}/api/tips?featured=true&limit=3`);
    const paramsData = await paramsResponse.json();
    
    console.log(`   Status: ${paramsResponse.status}`);
    console.log(`   Success: ${paramsData.success}`);
    
    if (paramsData.data && paramsData.data.tips) {
      console.log(`   Featured tips count: ${paramsData.data.tips.length}`);
    }
    
    console.log('\n✅ Tips API test completed!');
    
  } catch (error) {
    console.error('❌ Tips API test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - The development server is running (npm run dev)');
    console.log('   - The database is connected');
    console.log('   - The tips are seeded (npm run seed-tips)');
  }
}

testTipsAPI();

