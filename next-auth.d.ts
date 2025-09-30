import NextAuth, { DefaultSession, User as NextAuthUser } from 'next-auth'; 
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName?: string | null;
      avatar?: string | null;
      idDocument?: string | null;
      phone?: string | null;
      address?: string | null;
      department?: string | null;
      city?: string | null;
      schoolId?: string | null;
      schoolSedeId?: string | null;
      degree?: string | null;
    } & DefaultSession['user'];
  }

  interface User extends NextAuthUser {
    role: string;
    firstName: string;
    lastName?: string | null;
    avatar?: string | null;
    idDocument?: string | null;
    phone?: string | null;
    address?: string | null;
    department?: string | null;
    city?: string | null;
    schoolId?: string | null;
      schoolSedeId?: string | null;
      degree?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id: string;
    role: string;
    firstName: string;
    lastName?: string | null;
    avatar?: string | null;
    idDocument?: string | null;
    phone?: string | null;
    address?: string | null;
    department?: string | null;
    city?: string | null;
    schoolId?: string | null;
      schoolSedeId?: string | null;
      degree?: string | null;
  }
}