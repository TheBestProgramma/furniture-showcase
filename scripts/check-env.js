#!/usr/bin/env node

/**
 * Environment Variables Checker
 * This script ensures all required environment variables are loaded before starting the app
 * Works in both local development (.env.local) and CI/CD environments (Vercel, etc.)
 */

const fs = require('fs');
const path = require('path');

// Check if we're in a CI/CD environment (Vercel, GitHub Actions, etc.)
function isCIEnvironment() {
  return !!(
    process.env.VERCEL ||
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.NETLIFY ||
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RENDER
  );
}

// Load environment variables from .env.local (local development only)
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    // In CI/CD, environment variables come from the environment, not files
    if (isCIEnvironment()) {
      console.log('📦 CI/CD environment detected - using environment variables from platform');
      return {};
    }
    
    console.error('❌ .env.local file not found!');
    console.error('Please create a .env.local file with the required environment variables.');
    console.error('Or ensure environment variables are set in your deployment platform (Vercel, etc.)');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  // Handle both Windows (\r\n) and Unix (\n) line endings
  const envLines = envContent.replace(/\r\n/g, '\n').split('\n');
  
  const envVars = {};
  envLines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();
        if (key && value) {
          envVars[key] = value;
        }
      }
    }
  });

  return envVars;
}

// Check required environment variables
function checkRequiredEnvVars(envVars) {
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'MONGODB_URI',
    'MONGODB_DB',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missingVars = [];
  const presentVars = [];

  // In CI/CD, check process.env directly; otherwise use loaded envVars
  const checkSource = isCIEnvironment() ? process.env : envVars;

  requiredVars.forEach(varName => {
    const value = checkSource[varName];
    if (!value) {
      missingVars.push(varName);
    } else {
      presentVars.push(varName);
      // Store in envVars for display
      envVars[varName] = value;
    }
  });

  console.log('🔍 Environment Variables Check:');
  console.log('================================');
  
  presentVars.forEach(varName => {
    const value = envVars[varName];
    const displayValue = varName.includes('SECRET') || varName.includes('URI') 
      ? '***' + value.slice(-4) 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  });

  if (missingVars.length > 0) {
    console.log('\n❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    
    if (isCIEnvironment()) {
      console.log('\n💡 Tip: Add these variables in your deployment platform:');
      console.log('   - Vercel: Settings → Environment Variables');
      console.log('   - Other platforms: Check their environment variable documentation');
    } else {
      console.log('\nPlease add these variables to your .env.local file.');
    }
    return false;
  }

  console.log('\n✅ All required environment variables are present!');
  return true;
}

// Main execution
function main() {
  console.log('🚀 Starting environment check...\n');
  
  try {
    // Load from file (local) or use process.env (CI/CD)
    const envVars = isCIEnvironment() ? {} : loadEnvFile();
    const allPresent = checkRequiredEnvVars(envVars);
    
    if (!allPresent) {
      process.exit(1);
    }
    
    console.log('\n🎉 Environment check passed! You can now start your application.');
  } catch (error) {
    console.error('❌ Error during environment check:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadEnvFile, checkRequiredEnvVars };
