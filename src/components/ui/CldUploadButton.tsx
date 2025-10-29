'use client'

import { CldUploadButton as NextCldUploadButton } from 'next-cloudinary'
import { ReactNode } from 'react'

interface CldUploadButtonProps {
  onSuccess: (result: any) => void
  children: ReactNode
}

export function CldUploadButton({ onSuccess, children }: CldUploadButtonProps) {
  return (
    <NextCldUploadButton
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={onSuccess}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
    >
      {children}
    </NextCldUploadButton>
  )
}
