'use client'

import { useEffect, useState } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { Button } from '@/src/components/ui/Button'
import { cn } from '@/src/lib/utils.client'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => { 
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        size="icon"
        onClick={scrollToTop}
        className={cn(
          'rounded-full shadow-lg transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
          'bg-blue-600 hover:bg-blue-700 text-white'
        )}
        aria-label="Go to top"
      >
        <ArrowUpIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}
