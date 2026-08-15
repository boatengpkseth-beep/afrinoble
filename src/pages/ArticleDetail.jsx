import { Link, useParams } from 'react-router-dom'
import { getArticleBySlug, getRelatedArticles } from '@/data/journal'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ArticleCard from '@/components/ArticleCard'
import NotFound from './NotFound'

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) return <NotFound />

  const related = getRelatedArticles(article)

  return (
    <div>
      <section className="relative flex h-[55vh] min-h-[380px] items-end overflow-hidden">
        <img
          src={article.heroImage}
          alt=""
          className="iris-reveal absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
        <div className="relative mx-auto w-full max-w-3xl px-6 pb-14 md:px-10">
          <Link to="/journal" className="label-eyebrow text-ivory-100/60 hover:text-gold-300">
            &larr; Journal
          </Link>
          <Eyebrow className="mt-4 block">{article.category}</Eyebrow>
          <h1 className="fade-rise-in mt-3 font-display text-4xl text-ivory-100 md:text-5xl">
            {article.title}
          </h1>
          <p className="fade-rise-in mt-4 text-xs text-ivory-100/50" style={{ animationDelay: '150ms' }}>
            {article.author} &middot;{' '}
            {new Date(article.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            &middot; {article.readingTime}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:px-10">
        <Reveal className="space-y-6 text-sm leading-relaxed text-ivory-100/70">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-8xl px-6 pb-24 md:px-10">
          <Reveal>
            <Eyebrow>Related</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ivory-100">Continue Reading</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
