import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        try {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://soar-api-2pmz2r36bq-uc.a.run.app/api/v1';
          const API_KEY = process.env.SOAR_API_KEY;

          // Authenticate with headless backend
          const formData = new URLSearchParams();
          formData.append('username', credentials.email);
          formData.append('password', credentials.password);

          const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'POST',
            headers: {
              'X-API-Key': API_KEY || '',
            },
            body: formData,
          });

          if (!response.ok) {
            return null;
          }

          const tokenData = await response.json();
          
          // Get user info
          const userResponse = await fetch(`${API_BASE_URL}/users?id=${tokenData.user_id}`, {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'X-API-Key': API_KEY || '',
            },
          });

          if (!userResponse.ok) {
            return null;
          }

          const users = await userResponse.json();
          const user = Array.isArray(users) ? users[0] : users;

          return {
            id: user.id || tokenData.user_id,
            email: user.email,
            name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Note: Google OAuth integration with headless backend would need to be implemented
    // The backend has /api/v1/auth/google endpoint that accepts a token
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 