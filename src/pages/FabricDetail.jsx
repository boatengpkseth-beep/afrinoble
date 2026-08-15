import { Link, useParams } from 'react-router-dom'
import { getFabricBySlug } from '@/data/fabrics'
import { products } from '@/data/products'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import ProductCard from '@/components/ProductCard'
import NotFound from './NotFound'

export default function FabricDetail() {
  const { slug } = useParams()
  const fabric = getFabricBySlug(slug)

  if (!fabric) return <NotFound />

  const fabricProducts = products.filter((p) => p.fabric === slug)

  return (
    <div>
      <section className="relative flex h-[55vh] min-h-[380px] items-end overflow-hidden">
        <img
          src={fabric.image}
          alt=""
          className="iris-reveal absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/10" />
        <div className="relative mx-auto w-full max-w-8xl px-6 pb-14 md:px-10">
          <Link to="/craftsmanship" className="label-eyebrow text-ivory-100/60 hover:text-gold-300">
            &larr; Craftsmanship
          </Link>
          <h1 className="fade-rise-in mt-4 font-display text-5xl text-ivory-100 md:text-6xl">
            {fabric.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          <Reveal className="flex md:block">
            <img
              src={fabric.swatch}
              alt={`${fabric.name} swatch`}
              className="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-gold-300/40 md:h-40 md:w-40"
            />
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <Eyebrow>Origin</Eyebrow>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory-100/60">{fabric.origin}</p>
            </Reveal>
            <Reveal>
              <Eyebrow>Significance</Eyebrow>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory-100/60">
                {fabric.significance}
              </p>
            </Reveal>
            <Reveal>
              <Eyebrow>Craftsmanship</Eyebrow>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory-100/60">
                {fabric.craftsmanship}
              </p>
            </Reveal>
            <Reveal>
              <Eyebrow>At Afrinoble</Eyebrow>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory-100/60">
                {fabric.modernInterpretation}
              </p>
            </Reveal>
          </div>
        </div>

        {fabricProducts.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <Eyebrow>Pieces in {fabric.name}</Eyebrow>
              <h2 className="mt-3 font-display text-3xl text-ivory-100">Shop This Fabric</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {fabricProducts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 90}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
