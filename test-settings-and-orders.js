/**
 * Test script for Admin Settings and Order Management
 * Run with: node test-settings-and-orders.js
 */

const BASE_URL = 'http://localhost:3000';

// You'll need to provide admin credentials or session token
// For now, this is a basic test structure

async function testSettingsAPI() {
  console.log('\n=== Testing Settings API ===\n');

  try {
    // Test 1: Get settings (public endpoint)
    console.log('1. Testing GET /api/settings (public)...');
    const publicResponse = await fetch(`${BASE_URL}/api/settings`);
    const publicData = await publicResponse.json();
    console.log('   Status:', publicResponse.status);
    console.log('   Success:', publicData.success);
    if (publicData.success) {
      console.log('   Site Name:', publicData.data?.settings?.siteName);
      console.log('   Has WhatsApp Phone:', !!publicData.data?.settings?.whatsappPhone);
      console.log('   Has Return Policy:', !!publicData.data?.settings?.returnPolicy);
    }

    // Test 2: Get admin settings (protected)
    console.log('\n2. Testing GET /api/admin/settings (admin only)...');
    const adminGetResponse = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const adminGetData = await adminGetResponse.json();
    console.log('   Status:', adminGetResponse.status);
    console.log('   Response:', adminGetData.error || 'Requires authentication');

    // Test 3: Update settings (protected)
    console.log('\n3. Testing PUT /api/admin/settings (admin only)...');
    const updateData = {
      siteName: 'Furniture Showcase - Updated',
      siteDescription: 'Updated business description for testing',
      whatsappPhone: '+254712345678',
      returnPolicy: 'Updated return policy: We offer a 30-day return policy for unused items in original packaging. Custom furniture and personalized items are not eligible for returns. Please contact us for return instructions.',
    };

    const adminPutResponse = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const adminPutData = await adminPutResponse.json();
    console.log('   Status:', adminPutResponse.status);
    console.log('   Response:', adminPutData.error || adminPutData.message || 'Requires authentication');

    console.log('\n✅ Settings API tests completed (authentication required for admin endpoints)');
  } catch (error) {
    console.error('❌ Error testing Settings API:', error.message);
  }
}

async function testOrdersAPI() {
  console.log('\n=== Testing Orders API ===\n');

  try {
    // Test 1: Get orders (admin only)
    console.log('1. Testing GET /api/admin/orders (admin only)...');
    const ordersResponse = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const ordersData = await ordersResponse.json();
    console.log('   Status:', ordersResponse.status);
    console.log('   Response:', ordersData.error || 'Requires authentication');
    if (ordersData.success) {
      console.log('   Orders Count:', ordersData.data?.orders?.length || 0);
      console.log('   Total:', ordersData.data?.total || 0);
    }

    // Test 2: Get order by ID (admin only)
    console.log('\n2. Testing GET /api/admin/orders/[id] (admin only)...');
    const testOrderId = 'test-order-id';
    const orderResponse = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const orderData = await orderResponse.json();
    console.log('   Status:', orderResponse.status);
    console.log('   Response:', orderData.error || 'Requires authentication or order not found');

    // Test 3: Update order status (admin only)
    console.log('\n3. Testing PUT /api/admin/orders/[id] (admin only)...');
    const statusUpdate = {
      status: 'processing',
      paymentStatus: 'paid',
    };

    const updateResponse = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusUpdate),
    });
    const updateData = await updateResponse.json();
    console.log('   Status:', updateResponse.status);
    console.log('   Response:', updateData.error || updateData.message || 'Requires authentication');

    console.log('\n✅ Orders API tests completed (authentication required for admin endpoints)');
  } catch (error) {
    console.error('❌ Error testing Orders API:', error.message);
  }
}

async function testPublicSettings() {
  console.log('\n=== Testing Public Settings Endpoint ===\n');

  try {
    const response = await fetch(`${BASE_URL}/api/settings`);
    const data = await response.json();

    if (data.success) {
      const settings = data.data?.settings;
      console.log('✅ Public settings endpoint working');
      console.log('   Business Name:', settings?.siteName || 'Not set');
      console.log('   Business Description:', settings?.siteDescription?.substring(0, 50) + '...' || 'Not set');
      console.log('   WhatsApp Phone:', settings?.whatsappPhone || settings?.contactInfo?.phone || 'Not set');
      console.log('   Return Policy:', settings?.returnPolicy?.substring(0, 50) + '...' || 'Not set');
    } else {
      console.log('❌ Public settings endpoint error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing public settings:', error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Settings and Orders Management Tests\n');
  console.log('='.repeat(60));

  await testPublicSettings();
  await testSettingsAPI();
  await testOrdersAPI();

  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Note: Admin endpoints require authentication.');
  console.log('   To test admin endpoints, you need to:');
  console.log('   1. Log in through /admin/login');
  console.log('   2. Use a browser session or API client with cookies');
  console.log('   3. Or use a test script that handles NextAuth session cookies\n');
}

// Run tests
runTests().catch(console.error);

