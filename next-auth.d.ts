import { type DefaultSession, type User } from "next-auth";
import { type AdapterUser as BaseAdapterUser } from "next-auth/adapters";
import { Role } from "./src/generated/prisma";
import { JWT } from "next-auth/jwt";

type School = {
  id: string;
  name: string;
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    school: School | null;
    schoolId: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      school: School | null;
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
