import { type DefaultSession, type User } from "next-auth";
import { type AdapterUser as BaseAdapterUser } from "next-auth/adapters";
import { Role } from "./src/generated/prisma";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    schoolId: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      schoolId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    schoolId: string | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends BaseAdapterUser {
    role: Role;
    schoolId: string | null;
  }
}
