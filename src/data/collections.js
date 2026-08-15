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
      '[PLACEHOLDER] A description of the Women’s collection — fabric focus, seasonal theme, or design philosophy.',
    image: '/media/look-03.jpg',
    heroImage: '/media/look-04.jpg',
    accent: 'burgundy',
  },
  {
    slug: 'men',
    title: 'Men',
    subtitle: 'Tailoring built on generations of craft.',
    description:
      '[PLACEHOLDER] A description of the Men’s collection — fabric focus, seasonal theme, or design philosophy.',
    image: '/media/look-33.jpg',
    heroImage: '/media/look-28.jpg',
    accent: 'forest',
  },
  {
    slug: 'wedding',
    title: 'Wedding',
    subtitle: 'For the ceremonies that carry a family forward.',
    description:
      '[PLACEHOLDER] A description of the Wedding collection — bespoke ceremonial wear, fabric, and process.',
    image: '/media/look-21.jpg',
    heroImage: '/media/look-34.jpg',
    accent: 'gold',
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    subtitle: 'The finishing detail.',
    description: '[PLACEHOLDER] A description of the Accessories collection.',
    image: '/media/look-18.jpg',
    heroImage: '/media/look-01.jpg',
    accent: 'bronze',
  },
  {
    slug: 'limited-edition',
    title: 'Limited Edition',
    subtitle: 'Small runs. Singular pieces.',
    description: '[PLACEHOLDER] A description of the Limited Edition collection.',
    image: '/media/look-16.jpg',
    heroImage: '/media/look-24.jpg',
    accent: 'terracotta',
  },
  {
    slug: 'bespoke',
    title: 'Bespoke',
    subtitle: 'Made for one person only.',
    description: '[PLACEHOLDER] A description of the Bespoke offering.',
    image: '/media/look-27.jpg',
    heroImage: '/media/look-26.jpg',
    accent: 'chocolate',
  },
]

export function getCollectionBySlug(slug) {
  return collections.find((c) => c.slug === slug)
}
