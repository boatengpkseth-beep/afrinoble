import { Link, useParams } from 'react-router-dom'
import { getArtisanBySlug } from '@/data/artisans'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import NotFound from './NotFound'

export default function ArtisanDetail() {
  const { slug } = useParams()
  const artisan = getArtisanBySlug(slug)

  if (!artisan) return <NotFound />

  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Link to="/artisans" className="label-eyebrow text-ivory-100/60 hover:text-gold-300">
        &larr; All Artisans
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
        <Reveal className="aspect-[3/4] overflow-hidden bg-ink-800">
          <img src={artisan.portrait} alt={artisan.name} className="h-full w-full object-cover" />
        </Reveal>

        <div>
          <Eyebrow>{artisan.craft}</Eyebrow>
          <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">{artisan.name}</h1>
          <p className="mt-2 text-sm text-ivory-100/50">{artisan.region}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory-100/60">{artisan.bio}</p>

          {artisan.process?.length > 0 && (
            <div className="mt-12">
              <Eyebrow>The Process</Eyebrow>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {artisan.process.map((img) => (
                  <div key={img} className="aspect-[4/3] overflow-hidden bg-ink-800">
                    <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
