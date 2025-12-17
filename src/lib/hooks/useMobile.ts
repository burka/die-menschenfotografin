import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Hook for detecting mobile viewport
 * Supports ?mobile=true URL parameter for testing
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const forceMobile = urlParams.get('mobile') === 'true'
      setIsMobile(forceMobile || window.innerWidth <= MOBILE_BREAKPOINT)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
