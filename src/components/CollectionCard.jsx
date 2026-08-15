import { Link } from 'react-router-dom'

export default function CollectionCard({ collection, size = 'default' }) {
  return (
    <Link to={`/collections/${collection.slug}`} className="group relative block overflow-hidden">
      <div className={`overflow-hidden ${size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
        <img
          src={collection.image}
          alt={collection.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-2xl text-ivory-100 md:text-3xl">{collection.title}</h3>
        <p className="mt-1 text-sm text-ivory-100/70">{collection.subtitle}</p>
        <span className="label-eyebrow mt-4 inline-block text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore &rarr;
        </span>
      </div>
    </Link>
  )
}
