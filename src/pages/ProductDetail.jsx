import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/data/products'
import { getCollectionBySlug } from '@/data/collections'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ProductCard from '@/components/ProductCard'
import NotFound from './NotFound'

const AVAILABILITY_LABEL = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'made-to-order': 'Made to Order',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) return <NotFound />

  const collection = getCollectionBySlug(product.collection)
  const related = getRelatedProducts(product)

  return (
    <div className="mx-auto max-w-8xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
      <nav className="label-eyebrow flex flex-wrap items-center gap-2 text-ivory-100/50">
        <Link to="/shop" className="hover:text-gold-300">Shop</Link>
        <span>/</span>
        {collection && (
          <>
            <Link to={`/collections/${collection.slug}`} className="hover:text-gold-300">
              {collection.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ivory-100/80">{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-ink-800">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/5] w-20 overflow-hidden border transition-colors duration-300 ${
                    activeImage === i ? 'border-gold-300' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Eyebrow>{product.fabric.replace(/-/g, ' ')}</Eyebrow>
          <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl text-gold-300">{formatPrice(product.price, product.currency)}</p>

          <span className="label-eyebrow mt-4 inline-block text-ivory-100/50">
            {AVAILABILITY_LABEL[product.availability]}
          </span>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory-100/60">
            {product.description}
          </p>

          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <p className="label-eyebrow text-ivory-100/50">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] border px-3 py-2 text-sm transition-colors duration-300 ${
                      selectedSize === size
                        ? 'border-gold-300 text-gold-300'
                        : 'border-ivory-100/25 text-ivory-100/80 hover:border-ivory-100/60'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="mt-10 w-full border border-ivory-100 py-4 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors duration-300 hover:bg-ivory-100 hover:text-ink-950 sm:w-auto sm:px-12"
          >
            Enquire
          </button>

          {product.story && (
            <div className="mt-12 border-t border-ivory-100/10 pt-8">
              <p className="label-eyebrow text-ivory-100/50">The Story</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory-100/60">{product.story}</p>
            </div>
          )}

          {product.care && (
            <div className="mt-8 border-t border-ivory-100/10 pt-8">
              <p className="label-eyebrow text-ivory-100/50">Care</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory-100/60">{product.care}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <Reveal>
            <Eyebrow>You May Also Like</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ivory-100">More from {collection?.title}</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
