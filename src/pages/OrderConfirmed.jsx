import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchSessionStatus } from '@/lib/stripe'
import { formatPrice } from '@/data/products'
import Eyebrow from '@/components/Eyebrow'

/**
 * Where Embedded Checkout returns the buyer. The message is the house's own,
 * and it promises only what the atelier does: a receipt, a hand check, and
 * a note when the piece is ready to travel.
 */
export default function OrderConfirmed() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [session, setSession] = useState(undefined) // undefined = loading, null = unknown

  useEffect(() => {
    if (!sessionId) {
      setSession(null)
      return
    }
    fetchSessionStatus(sessionId).then(setSession).catch(() => setSession(null))
  }, [sessionId])

  const paid = session?.paymentStatus === 'paid' || session?.status === 'complete'
  const unpaid = session && !paid

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center md:px-10 md:pt-40">
      <Eyebrow>{unpaid ? 'Order not completed' : 'Order confirmed'}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ivory-100 md:text-5xl">
        {unpaid ? 'Your payment did not go through.' : 'Thank you — your Afrinoble order is confirmed.'}
      </h1>

      {session === undefined && <p className="mt-6 text-sm text-ivory-100/50">Checking your order…</p>}

      {paid && (
        <>
          {session.product && (
            <p className="mt-6 text-lg text-gold-300">
              {session.product}
              {session.size ? ` · size ${session.size}` : ''}
              {session.amountTotal != null && ` · ${formatPrice(session.amountTotal / 100, session.currency?.toUpperCase())}`}
            </p>
          )}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory-100/70">
            A receipt is on its way to {session.email ? <span className="text-ivory-100">{session.email}</span> : 'your email'}.
            Every piece leaves the atelier only after it has been checked by hand, so we will write to you once yours is ready to travel.
            Made-to-order pieces are cut to your measurements; if we need them, we will ask before any cloth is cut.
          </p>
        </>
      )}

      {session === null && (
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory-100/70">
          If you have just paid, a receipt is on its way to your email and we will write to you once your piece has
          been checked by hand and is ready to travel.
        </p>
      )}

      {unpaid && (
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory-100/70">
          Nothing has been charged. You can return to the piece and try again, or write to us and we will help.
        </p>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          to="/shop"
          className="border border-ivory-100 px-10 py-4 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors duration-300 hover:bg-ivory-100 hover:text-ink-950"
        >
          Continue shopping
        </Link>
        <Link to="/contact" className="px-6 py-4 text-sm uppercase tracking-widest2 text-ivory-100/60 hover:text-gold-300">
          Contact the atelier
        </Link>
      </div>
    </div>
  )
}
