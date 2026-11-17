import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Automatically links Google to an existing Email/Password account with the same email
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Please provide your email/phone and password.');
        }

        const identifier = credentials.identifier.trim();
        const isEmail = identifier.includes('@');

        // Look up user by Email OR Phone Number
        const user = await prisma.user.findFirst({
          where: isEmail
            ? { email: identifier.toLowerCase() }
            : { phone: identifier },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials or account uses Google sign-in.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle linking Google to an already logged-in Phone-only user
      if (account?.provider === 'google') {
        const currentSession = await auth();
        if (currentSession?.user?.id && currentSession.user.id !== user.id) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            // Attach Google OAuth to the currently signed-in phone user
            await prisma.account.create({
              data: {
                userId: currentSession.user.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });

            // Sync email/image to the phone user if they don't have one yet
            await prisma.user.update({
              where: { id: currentSession.user.id },
              data: {
                email: currentSession.user.email || user.email,
                image: currentSession.user.image || user.image,
              },
            });

            return '/profile?linked=google';
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      // Allow live session updates when user links email/phone in Profile
      if (trigger === 'update' && session) {
        if (session.email !== undefined) token.email = session.email;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.name !== undefined) token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
});