'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import { useThemeStore } from '@/src/store/theme.store'

export const ThemeToggleButton = () => {
  const { toggleTheme } = useThemeStore()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="overflow-hidden cursor-pointer rounded-full border-neutral-dark dark:border-neutral-light"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <SunIcon
        className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:-rotate-90 dark:scale-0'
      />
      <MoonIcon
        className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:rotate-0 dark:scale-100'
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}