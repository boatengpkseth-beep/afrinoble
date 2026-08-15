import { collections } from '@/data/collections'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'
import CollectionCard from '@/components/CollectionCard'

export default function Collections() {
  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <Reveal className="max-w-2xl">
        <Eyebrow>The Full Range</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Collections</h1>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {collections.map((collection, i) => (
          <Reveal key={collection.slug} delay={(i % 2) * 100}>
            <CollectionCard collection={collection} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
