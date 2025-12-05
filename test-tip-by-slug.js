#!/usr/bin/env node

/**
 * Test script for individual tip API endpoint
 */

async function testTipBySlug() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Tip by Slug API...\n');
  
  try {
    // First, get a list of tips to get a valid slug
    console.log('1. Getting tips list to find a valid slug...');
    const tipsResponse = await fetch(`${baseUrl}/api/tips?limit=1`);
    const tipsData = await tipsResponse.json();
    
    if (!tipsData.success || !tipsData.data.tips.length) {
      console.log('❌ No tips found to test with');
      return;
    }
    
    const tip = tipsData.data.tips[0];
    const slug = tip.slug;
    
    console.log(`   Found tip: "${tip.title}" with slug: "${slug}"`);
    
    // Test the individual tip endpoint
    console.log(`\n2. Testing /api/tips/${slug}...`);
    const response = await fetch(`${baseUrl}/api/tips/${slug}`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    
    if (data.success && data.data && data.data.tip) {
      console.log(`   Tip title: ${data.data.tip.title}`);
      console.log(`   Tip author: ${data.data.tip.author}`);
      console.log(`   Tip category: ${data.data.tip.category}`);
      console.log(`   Tip featured: ${data.data.tip.featured}`);
    } else {
      console.log(`   Error: ${data.error || data.message}`);
    }
    
    // Test with invalid slug
    console.log(`\n3. Testing with invalid slug...`);
    const invalidResponse = await fetch(`${baseUrl}/api/tips/invalid-slug-123`);
    const invalidData = await invalidResponse.json();
    
    console.log(`   Status: ${invalidResponse.status}`);
    console.log(`   Success: ${invalidData.success}`);
    console.log(`   Error: ${invalidData.error || invalidData.message}`);
    
    console.log('\n✅ Tip by Slug API test completed!');
    
  } catch (error) {
    console.error('❌ Tip by Slug API test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - The development server is running (npm run dev)');
    console.log('   - The database is connected');
    console.log('   - The tips are seeded (npm run seed-tips)');
  }
}

testTipBySlug();







