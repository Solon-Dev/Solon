import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { db } from '@/lib/db'

export const authOptions = {
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
    async signIn({ user, account, profile }: any) {
      try {
        await db`
          INSERT INTO users (github_id, email, name, avatar_url)
          VALUES (${String(profile.id)}, ${user.email}, ${user.name}, ${user.image})
          ON CONFLICT (github_id) DO UPDATE
          SET email = ${user.email}, name = ${user.name}, avatar_url = ${user.image}
        `
        return true
      } catch (error) {
        console.error('Error saving user:', error)
        return false
      }
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.sub = String(profile.id)
      }
      return token
    },
    async session({ session, token }: any) {
      session.user.githubId = token.sub
      session.user.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
