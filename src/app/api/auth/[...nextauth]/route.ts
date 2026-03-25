import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { db } from '@/lib/db';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const githubId = String(profile?.id ?? account?.providerAccountId ?? '');
        const email = user.email ?? '';
        const name = user.name ?? profile?.login ?? '';
        const avatarUrl = user.image ?? '';

        // Upsert user into Neon DB
        await db(
          `INSERT INTO users (github_id, email, name, avatar_url)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (github_id)
           DO UPDATE SET
             email = EXCLUDED.email,
             name = EXCLUDED.name,
             avatar_url = EXCLUDED.avatar_url`,
          [githubId, email, name, avatarUrl]
        );

        return true;
      } catch (err) {
        console.error('signIn DB error:', err);
        // Still allow sign-in even if DB write fails
        return true;
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubId = String(profile.id ?? account.providerAccountId ?? '');
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.githubId = token.githubId as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
