/**
 * Artisans — CMS shape. PLACEHOLDER PEOPLE.
 *
 * No real names, biographies or quotes exist yet — every entry here is a
 * clearly-marked stand-in. Do not publish this file's copy as fact; it
 * exists to prove out the layout until real artisan partners are
 * documented and have consented to be featured.
 */
export const artisans = [
  {
    slug: 'artisan-1',
    name: '[PLACEHOLDER NAME]',
    craft: 'Master Weaver',
    region: '[PLACEHOLDER REGION]',
    bio: '[PLACEHOLDER] Short biography — years of practice, how the craft was learned, what they bring to Afrinoble.',
    portrait: '/media/look-01.jpg',
    process: [
      '/media/look-06.jpg',
      '/media/look-17.jpg',
    ],
  },
  {
    slug: 'artisan-2',
    name: '[PLACEHOLDER NAME]',
    craft: 'Tailor',
    region: '[PLACEHOLDER REGION]',
    bio: '[PLACEHOLDER] Short biography.',
    portrait: '/media/look-12.jpg',
    process: [
      '/media/look-09.jpg',
      '/media/look-19.jpg',
    ],
  },
  {
    slug: 'artisan-3',
    name: '[PLACEHOLDER NAME]',
    craft: 'Embroiderer',
    region: '[PLACEHOLDER REGION]',
    bio: '[PLACEHOLDER] Short biography.',
    portrait: '/media/look-02.jpg',
    process: [
      '/media/look-16.jpg',
      '/media/look-05.jpg',
    ],
  },
  {
    slug: 'artisan-4',
    name: '[PLACEHOLDER NAME]',
    craft: 'Dyer',
    region: '[PLACEHOLDER REGION]',
    bio: '[PLACEHOLDER] Short biography.',
    portrait: '/media/look-07.jpg',
    process: [
      '/media/look-11.jpg',
      '/media/look-13.jpg',
    ],
  },
]

export function getArtisanBySlug(slug) {
  return artisans.find((a) => a.slug === slug)
}
