import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '@/data/products'
import { collections } from '@/data/collections'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ProductCard from '@/components/ProductCard'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCollection = searchParams.get('collection') || 'all'

  const filtered = useMemo(() => {
    if (activeCollection === 'all') return products
    return products.filter((p) => p.collection === activeCollection)
  }, [activeCollection])

  function setFilter(slug) {
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ collection: slug })
    }
  }

  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>Shop All</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">The Full Catalog</h1>
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`label-eyebrow border px-4 py-2 transition-colors duration-300 ${
            activeCollection === 'all'
              ? 'border-gold-300 text-gold-300'
              : 'border-ivory-100/20 text-ivory-100/60 hover:border-ivory-100/50'
          }`}
        >
          All
        </button>
        {collections.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setFilter(c.slug)}
            className={`label-eyebrow border px-4 py-2 transition-colors duration-300 ${
              activeCollection === c.slug
                ? 'border-gold-300 text-gold-300'
                : 'border-ivory-100/20 text-ivory-100/60 hover:border-ivory-100/50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </Reveal>

      {filtered.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 4) * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-sm text-ivory-100/50">No pieces match this filter.</p>
      )}
    </div>
  )
}
