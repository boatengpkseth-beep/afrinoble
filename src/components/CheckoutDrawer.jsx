import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/data/products'
import { createCheckoutSession, loadStripe } from '@/lib/stripe'

/**
 * On-site checkout. Stripe's Embedded Checkout mounts inside this panel, so
 * the buyer never leaves afrinoble. If the site has no Stripe keys yet (or
 * Stripe cannot be reached), the panel offers the product's Payment Link
 * instead — a redirect, but never a dead end.
 */
export default function CheckoutDrawer({ product, size, onClose }) {
  const mountRef = useRef(null)
  const [phase, setPhase] = useState('loading') // loading | embedded | fallback | error
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let checkout = null
    let cancelled = false

    async function start() {
      try {
        const stripe = await loadStripe()
        if (!stripe) {
          setPhase('fallback')
          return
        }
        const clientSecret = await createCheckoutSession({ slug: product.slug, size })
        if (cancelled) return
        checkout = await stripe.initEmbeddedCheckout({ clientSecret })
        if (cancelled) {
          checkout.destroy()
          return
        }
        checkout.mount(mountRef.current)
        setPhase('embedded')
      } catch (err) {
        if (cancelled) return
        // A missing server key, or Stripe being unreachable, is not the
        // buyer's problem: hand them the hosted page instead.
        if (err.code === 'not_configured' || err.code === 'stripe_error' || /Stripe\.js/.test(err.message)) {
          setPhase('fallback')
        } else {
          setMessage(err.message)
          setPhase('error')
        }
      }
    }
    start()

    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      cancelled = true
      if (checkout) checkout.destroy()
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product.slug, size, onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={`Buy ${product.name}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden bg-ivory-100 text-ink-950 sm:mx-6">
        <div className="flex items-start justify-between gap-4 border-b border-ink-950/10 px-6 py-5">
          <div>
            <p className="label-eyebrow text-ink-950/50">Afrinoble · secure checkout</p>
            <h2 className="mt-1 font-display text-2xl">{product.name}</h2>
            <p className="mt-1 text-sm text-ink-950/60">
              {size ? `Size ${size} · ` : ''}
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm uppercase tracking-widest2 text-ink-950/60 hover:text-ink-950">
            Close
          </button>
        </div>

        <div className="min-h-[24rem] flex-1 overflow-y-auto bg-white">
          {phase === 'loading' && (
            <div className="flex h-full min-h-[24rem] items-center justify-center text-sm text-ink-950/50">
              Preparing your checkout…
            </div>
          )}
          <div ref={mountRef} className={phase === 'embedded' ? 'p-2' : 'hidden'} />
          {phase === 'fallback' && product.paymentLink && (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="max-w-sm text-sm leading-relaxed text-ink-950/70">
                Checkout opens on our secure payment page for this piece.
              </p>
              <a
                href={product.paymentLink}
                className="bg-ink-950 px-10 py-4 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors hover:bg-gold-300 hover:text-ink-950"
              >
                Continue to payment
              </a>
              {size && <p className="text-xs text-ink-950/50">Please mention size {size} in the order notes.</p>}
            </div>
          )}
          {phase === 'fallback' && !product.paymentLink && (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="max-w-sm text-sm leading-relaxed text-ink-950/70">
                Online payment for this piece is being prepared. Write to the atelier and we will take your order by hand.
              </p>
              <Link
                to="/contact"
                onClick={onClose}
                className="bg-ink-950 px-10 py-4 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors hover:bg-gold-300 hover:text-ink-950"
              >
                Contact the atelier
              </Link>
            </div>
          )}
          {phase === 'error' && (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="text-sm text-ink-950/70">We could not start checkout.</p>
              <p className="text-xs text-ink-950/50">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
