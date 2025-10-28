import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './mongodb';
import User from './models/User';
import { NEXTAUTH_SECRET, NEXTAUTH_URL, validateEnvironment } from './env';

// Validate environment before proceeding
if (!validateEnvironment()) {
  throw new Error('Environment validation failed. Please check your .env.local file.');
}

console.log('✅ NextAuth configuration loaded successfully');
console.log(`NEXTAUTH_URL: ${NEXTAUTH_URL}`);
console.log(`NEXTAUTH_SECRET: ${NEXTAUTH_SECRET ? '***' + NEXTAUTH_SECRET.slice(-4) : 'NOT SET'}`);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          // Find user by email and include password
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');

          if (!user) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          // Compare password
          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await User.updateLastLogin(user._id);

          // Return user object (password will be excluded due to select: false)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: null
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login?error=AuthenticationError'
  },
  secret: NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
