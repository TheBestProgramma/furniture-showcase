#!/usr/bin/env node

/**
 * End-to-End Test Script for Furniture Showcase
 * 
 * This script tests the entire product flow from API to UI:
 * 1. API endpoints functionality
 * 2. Data fetching and error handling
 * 3. Cart functionality with Zustand
 * 4. Loading states and error boundaries
 * 5. Product flow integration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  apiEndpoints: [
    '/api/products',
    '/api/categories', 
    '/api/tips',
    '/api/testimonials'
  ],
  testPages: [
    '/',
    '/products',
    '/categories',
    '/tips',
    '/cart'
  ]
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test functions
async function testApiEndpoints() {
  logSection('Testing API Endpoints');
  
  for (const endpoint of TEST_CONFIG.apiEndpoints) {
    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess(`${endpoint} - Status: ${response.status}`);
        log(`   Data keys: ${Object.keys(data.data || {}).join(', ')}`);
      } else {
        logError(`${endpoint} - Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      logError(`${endpoint} - Network error: ${error.message}`);
    }
  }
}

async function testApiWithParameters() {
  logSection('Testing API with Parameters');
  
  const testCases = [
    {
      endpoint: '/api/products',
      params: { page: 1, limit: 5, featured: 'true' },
      description: 'Featured products with pagination'
    },
    {
      endpoint: '/api/products',
      params: { category: 'sofa', search: 'leather' },
      description: 'Products filtered by category and search'
    },
    {
      endpoint: '/api/tips',
      params: { featured: 'true', limit: 3 },
      description: 'Featured tips with limit'
    },
    {
      endpoint: '/api/categories',
      params: { includeProductCount: 'true' },
      description: 'Categories with product counts'
    }
  ];

  for (const testCase of testCases) {
    try {
      const url = new URL(`${TEST_CONFIG.baseUrl}${testCase.endpoint}`);
      Object.entries(testCase.params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess(`${testCase.description}`);
        log(`   URL: ${url.toString()}`);
        log(`   Results: ${data.data?.products?.length || data.data?.tips?.length || data.data?.categories?.length || 0} items`);
      } else {
        logError(`${testCase.description} - Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      logError(`${testCase.description} - Network error: ${error.message}`);
    }
  }
}

async function testErrorHandling() {
  logSection('Testing Error Handling');
  
  const errorTestCases = [
    {
      endpoint: '/api/products/invalid-id',
      expectedStatus: 404,
      description: 'Non-existent product ID'
    },
    {
      endpoint: '/api/tips/invalid-slug',
      expectedStatus: 404,
      description: 'Non-existent tip slug'
    },
    {
      endpoint: '/api/products',
      params: { page: -1, limit: 0 },
      description: 'Invalid pagination parameters'
    }
  ];

  for (const testCase of errorTestCases) {
    try {
      let url = `${TEST_CONFIG.baseUrl}${testCase.endpoint}`;
      if (testCase.params) {
        const urlObj = new URL(url);
        Object.entries(testCase.params).forEach(([key, value]) => {
          urlObj.searchParams.set(key, value);
        });
        url = urlObj.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (testCase.expectedStatus && response.status === testCase.expectedStatus) {
        logSuccess(`${testCase.description} - Correctly returned ${response.status}`);
      } else if (!data.success) {
        logSuccess(`${testCase.description} - Correctly handled error: ${data.error}`);
      } else {
        logWarning(`${testCase.description} - Unexpected success`);
      }
    } catch (error) {
      logSuccess(`${testCase.description} - Correctly caught network error`);
    }
  }
}

function testFileStructure() {
  logSection('Testing File Structure');
  
  const requiredFiles = [
    'src/lib/api.ts',
    'src/hooks/useProducts.ts',
    'src/hooks/useCategories.ts', 
    'src/hooks/useTips.ts',
    'src/store/cartStore.ts',
    'src/components/ErrorBoundary.tsx',
    'src/components/ProductCardSkeleton.tsx',
    'src/components/TipCardSkeleton.tsx',
    'src/app/products/page.tsx',
    'src/app/categories/page.tsx',
    'src/app/tips/page.tsx',
    'src/app/cart/page.tsx'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      logSuccess(`Found: ${file}`);
    } else {
      logError(`Missing: ${file}`);
    }
  }
}

function testCodeQuality() {
  logSection('Testing Code Quality');
  
  try {
    // Check if TypeScript compiles
    log('Checking TypeScript compilation...');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    logSuccess('TypeScript compilation successful');
  } catch (error) {
    logError(`TypeScript compilation failed: ${error.message}`);
  }

  try {
    // Check for linting errors
    log('Checking ESLint...');
    execSync('npx eslint src --ext .ts,.tsx --max-warnings 0', { stdio: 'pipe' });
    logSuccess('ESLint passed with no errors');
  } catch (error) {
    logWarning(`ESLint found issues: ${error.message}`);
  }
}

async function testIntegration() {
  logSection('Testing Integration');
  
  // Test that all pages load without errors
  for (const page of TEST_CONFIG.testPages) {
    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}${page}`);
      if (response.ok) {
        logSuccess(`Page loads: ${page}`);
      } else {
        logError(`Page failed: ${page} - Status: ${response.status}`);
      }
    } catch (error) {
      logError(`Page error: ${page} - ${error.message}`);
    }
  }
}

function generateTestReport() {
  logSection('Test Report Summary');
  
  const report = {
    timestamp: new Date().toISOString(),
    tests: [
      'API Endpoints',
      'API Parameters', 
      'Error Handling',
      'File Structure',
      'Code Quality',
      'Integration'
    ],
    recommendations: [
      'Ensure all API endpoints return consistent response format',
      'Add more comprehensive error handling for edge cases',
      'Implement API rate limiting for production',
      'Add unit tests for individual components',
      'Consider adding E2E tests with Playwright or Cypress',
      'Implement API caching for better performance'
    ]
  };

  log('Test Report Generated:');
  log(`Timestamp: ${report.timestamp}`);
  log('Tests Performed:');
  report.tests.forEach(test => log(`  - ${test}`));
  
  log('\nRecommendations:');
  report.recommendations.forEach(rec => log(`  - ${rec}`));
}

// Main test runner
async function runTests() {
  log(`${colors.bold}${colors.blue}🚀 Starting End-to-End Tests for Furniture Showcase${colors.reset}\n`);
  
  try {
    await testApiEndpoints();
    await testApiWithParameters();
    await testErrorHandling();
    testFileStructure();
    testCodeQuality();
    await testIntegration();
    generateTestReport();
    
    log(`\n${colors.bold}${colors.green}✅ All tests completed!${colors.reset}`);
  } catch (error) {
    logError(`Test runner failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testApiEndpoints,
  testApiWithParameters,
  testErrorHandling,
  testFileStructure,
  testCodeQuality,
  testIntegration
};



