import mongoose from 'mongoose';

// Use Next.js environment variables with fallback
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://kiptoosolomon07_db_user:2G6Wxh9dldyYTqT7@cluster0.vb1x2md.mongodb.net/furniture-showcase?retryWrites=true&w=majority&appName=Cluster0';
const mongoDb = process.env.MONGODB_DB || 'furniture-showcase';

// Debug environment variables
console.log('Environment check:');
console.log('MONGODB_URI exists:', !!mongoUri);
console.log('MONGODB_DB exists:', !!mongoDb);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check environment variables at runtime, not during build
  if (!mongoUri) {
    console.error('MONGODB_URI is not defined, using fallback');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (!mongoDb) {
    console.error('MONGODB_DB is not defined, using fallback');
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to establish MongoDB connection:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;