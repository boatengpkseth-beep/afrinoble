import { Link, useParams } from 'react-router-dom'
import { getCollectionBySlug } from '@/data/collections'
import { getProductsByCollection } from '@/data/products'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'
import NotFound from './NotFound'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = getCollectionBySlug(slug)

  if (!collection) return <NotFound />

  const products = getProductsByCollection(slug)

  return (
    <div>
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden">
        <img
          src={collection.heroImage}
          alt=""
          className="iris-reveal absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10" />
        <div className="relative mx-auto w-full max-w-8xl px-6 pb-14 md:px-10">
          <Link to="/collections" className="label-eyebrow text-ivory-100/60 hover:text-gold-300">
            &larr; All Collections
          </Link>
          <h1 className="fade-rise-in mt-4 font-display text-5xl text-ivory-100 md:text-6xl">
            {collection.title}
          </h1>
          <p className="fade-rise-in mt-3 max-w-lg text-ivory-100/70" style={{ animationDelay: '150ms' }}>
            {collection.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-6 py-24 md:px-10">
        <Reveal className="max-w-2xl text-sm leading-relaxed text-ivory-100/60">
          {collection.description}
        </Reveal>

        {products.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-14 text-sm text-ivory-100/50">
            No pieces published for this collection yet.
          </p>
        )}
      </section>
    </div>
  )
}
