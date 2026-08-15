import { Link } from 'react-router-dom'

export default function ArticleCard({ article }) {
  return (
    <Link to={`/journal/${article.slug}`} className="group block">
      <div className="aspect-[16/11] overflow-hidden bg-ink-800">
        <img
          src={article.heroImage}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <p className="label-eyebrow text-gold-300">{article.category}</p>
        <h3 className="mt-2 font-display text-xl text-ivory-100">{article.title}</h3>
        <p className="mt-2 text-xs text-ivory-100/50">
          {new Date(article.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          &middot; {article.readingTime}
        </p>
      </div>
    </Link>
  )
}
