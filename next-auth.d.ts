import { DefaultSession, User as NextAuthUser } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      schoolId?: string | null;
    } & DefaultSession['user'];
  }

  interface User extends NextAuthUser {
    role: string;
    schoolId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id: string;
    role: string;
    schoolId?: string | null;
  }
} 