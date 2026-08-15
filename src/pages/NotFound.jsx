import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="label-eyebrow text-gold-300">404</p>
      <h1 className="mt-4 font-display text-4xl text-ivory-100 md:text-5xl">Page Not Found</h1>
      <p className="mt-4 max-w-sm text-sm text-ivory-100/60">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-8 border border-ivory-100 px-8 py-3 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors duration-300 hover:bg-ivory-100 hover:text-ink-950"
      >
        Return Home
      </Link>
    </div>
  )
}
