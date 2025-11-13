'use client'

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const redirectByRole = (role: string | undefined, router: AppRouterInstance) => {
  
  if (role === 'ADMIN') {
    router.push('/dashboard/admin');
  } else if (role === 'ADMINSCHOOL') {
    router.push('/dashboard/school');
  } else if (role === 'USER') {
    router.push('/dashboard/user');
  } else {
    router.push('/auth/signin');
  }
};