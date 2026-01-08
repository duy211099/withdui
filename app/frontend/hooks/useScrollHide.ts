import { useEffect, useRef, useState } from 'react'

interface UseScrollHideOptions {
  threshold?: number
}

export default function useScrollHide(options: UseScrollHideOptions = {}) {
  const { threshold = 80 } = options
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const isTicking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isTicking.current) return
      isTicking.current = true

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        const scrollingDown = currentY > lastScrollY.current
        const pastThreshold = currentY > threshold

        setHidden(scrollingDown && pastThreshold)
        lastScrollY.current = currentY
        isTicking.current = false
      })
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return hidden
}
