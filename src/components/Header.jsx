import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/collections', label: 'Collections' },
  { to: '/shop', label: 'Shop' },
  { to: '/craftsmanship', label: 'Craftsmanship' },
  { to: '/artisans', label: 'Artisans' },
  { to: '/journal', label: 'Journal' },
  { to: '/lookbook', label: 'Lookbook' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen ? 'bg-ink-950/95 backdrop-blur-sm hairline' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/"
          className="font-display text-2xl tracking-wide text-ivory-100 md:text-3xl"
        >
          Afrinoble
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `label-eyebrow transition-colors duration-300 ${
                  isActive ? 'text-gold-300' : 'text-ivory-100/70 hover:text-ivory-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            to="/contact"
            className="label-eyebrow hidden text-ivory-100/70 transition-colors duration-300 hover:text-ivory-100 md:inline"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={`h-px w-6 bg-ivory-100 transition-transform duration-300 ${
                menuOpen ? 'translate-y-[3px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-ivory-100 transition-transform duration-300 ${
                menuOpen ? '-translate-y-[3px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-ivory-100/10 px-6 pb-8 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-b border-ivory-100/10 py-4 font-display text-xl ${
                  isActive ? 'text-gold-300' : 'text-ivory-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `py-4 font-display text-xl ${isActive ? 'text-gold-300' : 'text-ivory-100'}`
            }
          >
            Contact
          </NavLink>
        </nav>
      )}
    </header>
  )
}
