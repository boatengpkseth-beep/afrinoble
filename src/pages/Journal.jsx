import { useMemo, useState } from 'react'
import { journalArticles, journalCategories } from '@/data/journal'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ArticleCard from '@/components/ArticleCard'

export default function Journal() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return journalArticles
    return journalArticles.filter((a) => a.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>Stories</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Journal</h1>
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`label-eyebrow border px-4 py-2 transition-colors duration-300 ${
            activeCategory === 'all'
              ? 'border-gold-300 text-gold-300'
              : 'border-ivory-100/20 text-ivory-100/60 hover:border-ivory-100/50'
          }`}
        >
          All
        </button>
        {journalCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`label-eyebrow border px-4 py-2 transition-colors duration-300 ${
              activeCategory === cat
                ? 'border-gold-300 text-gold-300'
                : 'border-ivory-100/20 text-ivory-100/60 hover:border-ivory-100/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {filtered.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {filtered.map((article, i) => (
            <Reveal key={article.slug} delay={(i % 3) * 100}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-sm text-ivory-100/50">No stories in this category yet.</p>
      )}
    </div>
  )
}
