'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />
    } else if (theme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />
    } else {
      // system - show sun/moon based on actual system preference
      const isDark = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark ?
        <Moon className="h-[1.2rem] w-[1.2rem]" /> :
        <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getTitle = () => {
    if (theme === 'light') {
      return 'Switch to dark mode'
    } else if (theme === 'dark') {
      return 'Switch to system mode'
    } else {
      return 'Switch to light mode'
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={getTitle()}
      className="relative"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}