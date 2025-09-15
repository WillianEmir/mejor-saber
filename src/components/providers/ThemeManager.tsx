'use client'

import { useEffect } from 'react' 
import { useThemeStore } from '@/src/store/theme.store'

export function ThemeManager() {
  const { theme } = useThemeStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return null
}
