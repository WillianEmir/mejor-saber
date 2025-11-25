import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import * as bcrypt from "bcrypt";
import { z } from "zod";
import prisma from "./src/lib/prisma";
import { Role } from "./src/generated/prisma";
import { Adapter } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        const parsedCredentials = z.object({
          email: z.string().email(),
          password: z.string(),
        }).safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() },
            });
            return user;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT strategy
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // This callback is used to enrich the session object with data from the token.
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.schoolId = token.schoolId as string | null;
      }
      return session;
    },
    // This callback is used to add custom data to the JWT.
    async jwt({ token, user }) {
      if (user) {
        // On sign-in, `user` object is available.
        // Persist the custom data to the token.
        token.role = user.role;
        token.schoolId = user.schoolId;
      }
      return token;
    },
  },
});
