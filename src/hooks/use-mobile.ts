
'use client'

import { useEffect, useState } from 'react'

/**
 * A hook to determine if the current screen size is mobile.
 *
 * @param query The media query to use for mobile detection. Defaults to `(max-width: 768px)`.
 * @returns `true` if the screen size matches the mobile query, `false` otherwise.
 */
export function useIsMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)
    const handleChange = () => {
      setIsMobile(mediaQuery.matches)
    }

    // Add a listener to handle changes in the media query's state.
    mediaQuery.addEventListener('change', handleChange)

    // Set the initial state.
    handleChange()

    // Clean up the listener when the component unmounts.
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return isMobile
}
