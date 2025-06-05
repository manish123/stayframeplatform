import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthConfig, DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from 'next-auth';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Extend the User and Session types
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role?: string;
  }
}

export const authConfig: NextAuthConfig = {
  // Initialize the Prisma adapter
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.error('No email found in user object');
          return false;
        }

        // Check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create them
        if (!existingUser) {
          const role = user.email === 'msk.analyst@gmail.com' || user.email.startsWith('vinay') 
            ? 'admin' 
            : 'user';
            
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: role
            },
          });
        } else if (!existingUser.role) {
          // If user exists but has no role, update their role
          const role = user.email === 'msk.analyst@gmail.com' || user.email.startsWith('vinay') 
            ? 'admin' 
            : 'user';
            
          await prisma.user.update({
            where: { id: user.id },
            data: { role }
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Ensure role is always set, default to 'user' if not present
        session.user.role = user.role || 'user';
        
        // Log session for debugging (remove in production)
        console.log('Session data:', {
          id: user.id,
          email: user.email,
          role: session.user.role
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login/error"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Initialize NextAuth with the configuration
const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };
