import { Link } from 'react-router-dom'
import { lookbookSeasons } from '@/data/lookbook'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'

export default function Lookbook() {
  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>By Season</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Lookbook</h1>
      </Reveal>

      <div className="mt-14 space-y-6">
        {lookbookSeasons.map((season, i) => (
          <Reveal key={season.slug} delay={i * 100}>
            <Link
              to={`/lookbook/${season.slug}`}
              className="group relative block overflow-hidden"
            >
              <div className="aspect-[21/9] overflow-hidden">
                <img
                  src={season.images[0].src}
                  alt={season.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <h2 className="font-display text-3xl text-ivory-100 md:text-4xl">{season.title}</h2>
                <p className="mt-2 max-w-md text-sm text-ivory-100/70">{season.caption}</p>
                <span className="label-eyebrow mt-4 inline-block text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View Season &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
