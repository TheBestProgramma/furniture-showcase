#!/usr/bin/env node

/**
 * Environment Variables Checker
 * This script ensures all required environment variables are loaded before starting the app
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.error('Please create a .env.local file with the required environment variables.');
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
    'MONGODB_DB'
  ];

  const missingVars = [];
  const presentVars = [];

  requiredVars.forEach(varName => {
    if (!envVars[varName]) {
      missingVars.push(varName);
    } else {
      presentVars.push(varName);
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
    console.log('\nPlease add these variables to your .env.local file.');
    return false;
  }

  console.log('\n✅ All required environment variables are present!');
  return true;
}

// Main execution
function main() {
  console.log('🚀 Starting environment check...\n');
  
  try {
    const envVars = loadEnvFile();
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
