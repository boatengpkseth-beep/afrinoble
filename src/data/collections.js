/**
 * Collections — CMS shape.
 *
 * Images reference the brand photo set in /public/media (refined from the
 * shared Drive folder). Copy is intentionally plain, not brand voice.
 *
 * Fields mirror what a headless CMS entry would carry, so this file can be
 * replaced by a real data-fetching layer (Sanity/Contentful/Shopify/etc.)
 * without touching component code — components only read this shape.
 */
export const collections = [
  {
    slug: 'women',
    title: 'Women',
    subtitle: 'Silhouettes rooted in heritage, cut for the present.',
    description:
      'Gowns, blouses and caftans cut from kente, adinkra and kitenge — silhouettes that honour the cloth and flatter the wearer, from the everyday to the exceptional.',
    image: '/media/look-03.jpg',
    heroImage: '/media/look-04.jpg',
    accent: 'burgundy',
  },
  {
    slug: 'men',
    title: 'Men',
    subtitle: 'Tailoring built on generations of craft.',
    description:
      'Senator sets, kaftans and three-piece agbadas — crisp cloth, deliberate embroidery, tailoring that stands as straight in a boardroom as at a ceremony.',
    image: '/media/look-33.jpg',
    heroImage: '/media/look-28.jpg',
    accent: 'forest',
  },
  {
    slug: 'wedding',
    title: 'Wedding',
    subtitle: 'For the ceremonies that carry a family forward.',
    description:
      'Ceremonial dress made to order: agbadas, aso-oke sets and coordinated looks for couples and families, cut to measurement and finished by hand.',
    image: '/media/look-21.jpg',
    heroImage: '/media/look-34.jpg',
    accent: 'gold',
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    subtitle: 'The finishing detail.',
    description:
      'Clutches, scarves and finishing details faced in handwoven and printed cloth — the fastest way to carry the collection with you.',
    image: '/media/look-18.jpg',
    heroImage: '/media/look-01.jpg',
    accent: 'bronze',
  },
  {
    slug: 'limited-edition',
    title: 'Limited Edition',
    subtitle: 'Small runs. Singular pieces.',
    description:
      'Small runs and single-cloth experiments — pieces that exist because one bolt of fabric demanded it, and retire when the bolt ends.',
    image: '/media/look-16.jpg',
    heroImage: '/media/look-24.jpg',
    accent: 'terracotta',
  },
  {
    slug: 'bespoke',
    title: 'Bespoke',
    subtitle: 'Made for one person only.',
    description:
      'The atelier service: your measurements, your cloth, your occasion. Every bespoke commission begins with a conversation and ends with a garment no one else owns.',
    image: '/media/look-27.jpg',
    heroImage: '/media/look-26.jpg',
    accent: 'chocolate',
  },
]

export function getCollectionBySlug(slug) {
  return collections.find((c) => c.slug === slug)
}
