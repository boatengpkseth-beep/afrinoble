import { useCallback, useEffect } from 'react'

/**
 * Full-screen image viewer for lookbook seasons.
 *
 * Controlled component: parent owns the open index and passes navigation
 * callbacks. Keyboard: Escape closes, arrow keys navigate. Scroll is locked
 * on the root element while open (Lenis scrolls the window, so hiding
 * overflow there is enough; data-lenis-prevent stops wheel hijacking on
 * the overlay itself).
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const count = images.length
  const image = images[index]

  const prev = useCallback(() => onNavigate((index - 1 + count) % count), [index, count, onNavigate])
  const next = useCallback(() => onNavigate((index + 1) % count), [index, count, onNavigate])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, prev, next])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [])

  if (!image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Look ${index + 1} of ${count}`}
      data-lenis-prevent
      className="fade-in fixed inset-0 z-50 flex flex-col bg-ink-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="label-eyebrow text-ivory-100/60">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="label-eyebrow text-ivory-100/60 transition-colors duration-300 hover:text-gold-300"
        >
          Close &times;
        </button>
      </div>

      {/* Image stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 md:px-24">
        <img
          key={image.src}
          src={image.src}
          alt={image.caption}
          className="fade-in max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous look"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-0 top-0 flex h-full w-16 items-center justify-center text-2xl text-ivory-100/40 transition-colors duration-300 hover:text-gold-300 md:w-24"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Next look"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-0 top-0 flex h-full w-16 items-center justify-center text-2xl text-ivory-100/40 transition-colors duration-300 hover:text-gold-300 md:w-24"
            >
              &rarr;
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      <div className="px-6 py-5 text-center md:px-10">
        <p className="mx-auto max-w-lg text-sm text-ivory-100/60">{image.caption}</p>
      </div>
    </div>
  )
}
