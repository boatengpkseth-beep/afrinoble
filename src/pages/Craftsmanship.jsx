import { Link } from 'react-router-dom'
import { fabrics } from '@/data/fabrics'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'

export default function Craftsmanship() {
  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>Our Craft</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Craftsmanship</h1>
        <p className="mt-5 text-sm leading-relaxed text-ivory-100/60">
          Every collection draws from a documented textile tradition. Explore the fabrics behind the
          silhouettes.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-ivory-100/10 sm:grid-cols-2 lg:grid-cols-3">
        {fabrics.map((fabric, i) => (
          <Reveal key={fabric.slug} delay={(i % 3) * 100}>
            <Link to={`/craftsmanship/${fabric.slug}`} className="group relative block bg-ink-950">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-ivory-100">{fabric.name}</h3>
                <span className="label-eyebrow mt-2 inline-block text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
