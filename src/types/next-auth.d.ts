import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
    };
  }

  interface Profile {
    id?: number;
    login?: string;
    avatar_url?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    githubId?: string;
    accessToken?: string;
  }
}
