import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collections } from '@/data/collections'
import { journalArticles } from '@/data/journal'
import { lookbookSeasons } from '@/data/lookbook'
import { fabrics } from '@/data/fabrics'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import CollectionCard from '@/components/CollectionCard'
import ArticleCard from '@/components/ArticleCard'

export default function Home() {
  const featuredCollections = collections.slice(0, 3)
  const latestArticles = journalArticles.slice(0, 3)
  const heroSeason = lookbookSeasons[0]
  // fabrics[2] (ankara) — the red print contrasts with the brown/gold hero
  // above; fabrics[0] would repeat the hero image on the same page.
  const featuredFabric = fabrics[2]

  // Reduced-motion users and browsers that fail to load the video both fall
  // back to the static poster frame rather than a broken/frozen player.
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[560px] items-end overflow-hidden">
        {reducedMotion || videoFailed ? (
          <img
            src="/media/look-01.jpg"
            alt=""
            className="iris-reveal absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/media/look-01.jpg"
            onError={() => setVideoFailed(true)}
            className="iris-reveal absolute inset-0 h-full w-full object-cover"
          >
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10" />
        <div className="relative mx-auto w-full max-w-8xl px-6 pb-16 md:px-10 md:pb-24">
          <Eyebrow className="fade-in">African Luxury, Reimagined</Eyebrow>
          <h1 className="fade-rise-in mt-4 max-w-2xl font-display text-5xl leading-[1.05] text-ivory-100 md:text-7xl">
            Heritage, tailored for the present.
          </h1>
          <p className="fade-rise-in mt-6 max-w-md text-ivory-100/70" style={{ animationDelay: '150ms' }}>
            Where generations of African craftsmanship meet contemporary luxury.
          </p>
          <div className="fade-rise-in mt-9 flex flex-wrap gap-4" style={{ animationDelay: '300ms' }}>
            <Link
              to="/collections"
              className="border border-ivory-100 px-8 py-3 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors duration-300 hover:bg-ivory-100 hover:text-ink-950"
            >
              Explore Collections
            </Link>
            <Link
              to="/lookbook"
              className="px-8 py-3 text-sm uppercase tracking-widest2 text-ivory-100/70 transition-colors duration-300 hover:text-gold-300"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="mx-auto max-w-8xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Featured</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ivory-100 md:text-4xl">Collections</h2>
          </div>
          <Link
            to="/collections"
            className="label-eyebrow hidden shrink-0 text-ivory-100/60 transition-colors duration-300 hover:text-gold-300 md:inline"
          >
            View All &rarr;
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredCollections.map((collection, i) => (
            <Reveal key={collection.slug} delay={i * 120}>
              <CollectionCard collection={collection} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Craftsmanship teaser */}
      <section className="relative overflow-hidden">
        <Reveal as="div" className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/3] md:aspect-auto">
            <img src={featuredFabric.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center bg-ink-900 px-6 py-16 md:px-16 md:py-0">
            <Eyebrow>Our Craft</Eyebrow>
            <h2 className="mt-3 max-w-md font-display text-3xl text-ivory-100 md:text-4xl">
              Textiles carried forward, not left behind.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory-100/60">
              Every piece begins with fabric traditions built over generations — {fabrics.length} textiles,
              reinterpreted for a contemporary silhouette.
            </p>
            <Link
              to="/craftsmanship"
              className="label-eyebrow mt-8 inline-block w-fit border-b border-gold-300/50 pb-1 text-gold-300 transition-colors duration-300 hover:border-gold-300"
            >
              Discover the Craft &rarr;
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Lookbook teaser */}
      <section className="mx-auto max-w-8xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>{heroSeason.title}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ivory-100 md:text-4xl">Lookbook</h2>
          </div>
          <Link
            to={`/lookbook/${heroSeason.slug}`}
            className="label-eyebrow hidden shrink-0 text-ivory-100/60 transition-colors duration-300 hover:text-gold-300 md:inline"
          >
            View Season &rarr;
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {heroSeason.images.slice(0, 4).map((img, i) => (
            <Reveal key={img.src} delay={i * 100} className="aspect-[4/5] overflow-hidden">
              <Link to={`/lookbook/${heroSeason.slug}`}>
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial hover:scale-105"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Journal teaser */}
      <section className="mx-auto max-w-8xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ivory-100 md:text-4xl">Latest Stories</h2>
          </div>
          <Link
            to="/journal"
            className="label-eyebrow hidden shrink-0 text-ivory-100/60 transition-colors duration-300 hover:text-gold-300 md:inline"
          >
            View All &rarr;
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          {latestArticles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 120}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
