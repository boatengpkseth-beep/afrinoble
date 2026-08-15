import { Link } from 'react-router-dom'
import { artisans } from '@/data/artisans'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'

export default function Artisans() {
  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>The Hands Behind It</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Artisans</h1>
        <p className="mt-5 text-sm leading-relaxed text-ivory-100/60">
          Every Afrinoble piece passes through skilled hands before it reaches yours.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {artisans.map((artisan, i) => (
          <Reveal key={artisan.slug} delay={(i % 4) * 100}>
            <Link to={`/artisans/${artisan.slug}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-ink-800">
                <img
                  src={artisan.portrait}
                  alt={artisan.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
                />
              </div>
              <p className="label-eyebrow mt-4 text-gold-300">{artisan.craft}</p>
              <h3 className="mt-1 font-display text-xl text-ivory-100">{artisan.name}</h3>
              <p className="mt-1 text-xs text-ivory-100/50">{artisan.region}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
