import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Calm, editorial default easing/duration for scroll-triggered reveals —
// used everywhere instead of GSAP's bouncy defaults.
export const EASE = 'power3.out'
export const DURATION = 1.2

export { gsap, ScrollTrigger }
