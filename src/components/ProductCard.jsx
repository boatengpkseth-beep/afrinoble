import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatPrice } from '@/data/products'

const AVAILABILITY_LABEL = {
  'in-stock': null,
  'low-stock': 'Low Stock',
  'made-to-order': 'Made to Order',
}

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const secondImage = product.images[1]
  const badge = AVAILABILITY_LABEL[product.availability]

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            hovered && secondImage ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {secondImage && (
          <img
            src={secondImage}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {badge && (
          <span className="label-eyebrow absolute left-3 top-3 bg-ink-950/80 px-2 py-1 text-[0.6rem] text-ivory-100">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ivory-100">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-ivory-100/50">
            {product.fabric.replace(/-/g, ' ')}
          </p>
        </div>
        <p className="shrink-0 text-sm text-gold-300">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  )
}
