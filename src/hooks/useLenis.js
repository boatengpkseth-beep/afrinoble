import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '@/lib/gsap'

/**
 * Wires Lenis smooth scroll into GSAP's ScrollTrigger so scroll-driven
 * animations stay in sync with the smoothed scroll position instead of the
 * raw (jumpy) native scroll. Mount once at the app root.
 *
 * Respects prefers-reduced-motion by skipping smoothing entirely — native
 * scroll behaves fine for ScrollTrigger on its own.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let frameId
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    const ticker = (time) => lenis.raf(time * 1000)
    gsapTicker(ticker)

    return () => {
      cancelAnimationFrame(frameId)
      removeGsapTicker(ticker)
      lenis.destroy()
    }
  }, [])
}

// gsap.ticker integration kept separate/optional so a missing gsap ticker
// API in a future version can't break the raf loop above.
import { gsap } from '@/lib/gsap'
function gsapTicker(fn) {
  gsap.ticker.add(fn)
  gsap.ticker.lagSmoothing(0)
}
function removeGsapTicker(fn) {
  gsap.ticker.remove(fn)
}
