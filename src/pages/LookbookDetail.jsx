import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSeasonBySlug } from '@/data/lookbook'
import { getCollectionBySlug } from '@/data/collections'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import Lightbox from '@/components/Lightbox'
import NotFound from './NotFound'

export default function LookbookDetail() {
  const { slug } = useParams()
  const season = getSeasonBySlug(slug)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  if (!season) return <NotFound />

  const collection = getCollectionBySlug(season.collection)

  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Link to="/lookbook" className="label-eyebrow text-ivory-100/60 hover:text-gold-300">
        &larr; All Seasons
      </Link>

      <Reveal className="mt-6 max-w-2xl">
        <Eyebrow>Lookbook</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">{season.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ivory-100/60">{season.caption}</p>
        {collection && (
          <Link
            to={`/collections/${collection.slug}`}
            className="label-eyebrow mt-5 inline-block border-b border-gold-300/50 pb-1 text-gold-300 hover:border-gold-300"
          >
            Shop the {collection.title} Collection &rarr;
          </Link>
        )}
      </Reveal>

      <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {season.images.map((image, i) => (
          <Reveal key={image.src} delay={(i % 3) * 100} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View look ${i + 1}`}
              className="group block w-full cursor-zoom-in"
            >
              <img
                src={image.src}
                alt={image.caption}
                loading="lazy"
                className="w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={season.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}
