/**
 * Environment Variables Configuration
 * Centralized environment variable management with validation
 */

// Load environment variables with proper validation
function loadEnvVars() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return {
      NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000',
      NEXTAUTH_SECRET: undefined, // Never expose secret to client
    };
  }

  // Server-side environment loading
  const requiredVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB || 'furniture-showcase',
  };

  // Validate required variables
  const missingVars: string[] = [];
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value && key !== 'NEXTAUTH_URL' && key !== 'MONGODB_DB') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env.local file and ensure all required variables are set.');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return requiredVars;
}

// Export validated environment variables
export const env = loadEnvVars();

// Export individual variables for convenience
export const {
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
  MONGODB_URI,
  MONGODB_DB,
} = env;

// Validation function for debugging
export function validateEnvironment() {
  try {
    loadEnvVars();
    console.log('✅ Environment variables loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    return false;
  }
}

