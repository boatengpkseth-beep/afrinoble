import { Link } from 'react-router-dom'
import { useState } from 'react'

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { to: '/collections', label: 'Collections' },
      { to: '/shop', label: 'All Products' },
      { to: '/lookbook', label: 'Lookbook' },
    ],
  },
  {
    heading: 'Discover',
    links: [
      { to: '/craftsmanship', label: 'Craftsmanship' },
      { to: '/artisans', label: 'Artisans' },
      { to: '/journal', label: 'Journal' },
    ],
  },
  {
    heading: 'Afrinoble',
    links: [{ to: '/contact', label: 'Contact' }],
  },
]

export default function Footer() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <footer className="border-t border-ivory-100/10 bg-ink-950">
      <div className="mx-auto max-w-8xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="font-display text-2xl text-ivory-100">
              Afrinoble
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-100/60">
              Where generations of African craftsmanship meet contemporary luxury.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="label-eyebrow text-ivory-100/50">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-ivory-100/80 transition-colors duration-300 hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="label-eyebrow text-ivory-100/50">Newsletter</h3>
            <p className="mt-5 text-sm text-ivory-100/60">
              First word on new collections and the atelier.
            </p>
            {submitted ? (
              <p className="mt-4 text-sm text-gold-300">Thank you — you're on the list.</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex border-b border-ivory-100/30">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full bg-transparent py-2 text-sm text-ivory-100 placeholder:text-ivory-100/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="label-eyebrow shrink-0 py-2 text-ivory-100/70 transition-colors duration-300 hover:text-gold-300"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory-100/10 pt-8 text-xs text-ivory-100/40 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Afrinoble. All rights reserved.</p>
          <p>Site content is in development — imagery and copy are placeholders.</p>
        </div>
      </div>
    </footer>
  )
}
