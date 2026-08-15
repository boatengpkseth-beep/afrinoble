import { useEffect, useRef, useState } from 'react'

/**
 * Adds the site's CSS entrance-animation classes only once an element
 * scrolls into view (IntersectionObserver), rather than on mount — keeps
 * above-the-fold content from animating before the user can see it, and
 * keeps below-the-fold content from playing its entrance off-screen.
 */
export default function Reveal({
  as: Tag = 'div',
  animation = 'fade-rise-in',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${visible ? animation : 'opacity-0'} ${className}`}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
