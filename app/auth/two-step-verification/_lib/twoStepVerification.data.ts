'use server'

import { TwoFactorToken } from "@/src/generated/prisma";
import prisma from "@/src/lib/prisma";

export async function getTwoFactorTokenByToken(token: string) : Promise<TwoFactorToken | null> {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({ 
      where: { token },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
