/**
 * Lookbook — CMS shape. PLACEHOLDER imagery/captions.
 */
export const lookbookSeasons = [
  {
    slug: 'ss26',
    title: 'Spring/Summer 2026',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'women',
    images: [
      { src: '/media/look-03.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-07.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-04.jpg', caption: '[PLACEHOLDER caption 03]' },
      { src: '/media/look-11.jpg', caption: '[PLACEHOLDER caption 04]' },
      { src: '/media/look-10.jpg', caption: '[PLACEHOLDER caption 05]' },
      { src: '/media/look-13.jpg', caption: '[PLACEHOLDER caption 06]' },
      { src: '/media/look-05.jpg', caption: '[PLACEHOLDER caption 07]' },
      { src: '/media/look-08.jpg', caption: '[PLACEHOLDER caption 08]' },
      { src: '/media/look-15.jpg', caption: '[PLACEHOLDER caption 09]' },
      { src: '/media/look-20.jpg', caption: '[PLACEHOLDER caption 10]' },
    ],
  },
  {
    slug: 'fw25',
    title: 'Fall/Winter 2025',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'men',
    images: [
      { src: '/media/look-28.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-29.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-30.jpg', caption: '[PLACEHOLDER caption 03]' },
      { src: '/media/look-31.jpg', caption: '[PLACEHOLDER caption 04]' },
      { src: '/media/look-09.jpg', caption: '[PLACEHOLDER caption 05]' },
      { src: '/media/look-12.jpg', caption: '[PLACEHOLDER caption 06]' },
      { src: '/media/look-17.jpg', caption: '[PLACEHOLDER caption 07]' },
      { src: '/media/look-33.jpg', caption: '[PLACEHOLDER caption 08]' },
    ],
  },
  {
    slug: 'wedding-edit',
    title: 'The Wedding Edit',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'wedding',
    images: [
      { src: '/media/look-34.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-21.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-22.jpg', caption: '[PLACEHOLDER caption 03]' },
      { src: '/media/look-06.jpg', caption: '[PLACEHOLDER caption 04]' },
      { src: '/media/look-14.jpg', caption: '[PLACEHOLDER caption 05]' },
      { src: '/media/look-19.jpg', caption: '[PLACEHOLDER caption 06]' },
    ],
  },
  {
    slug: 'accessories-edit',
    title: 'The Accessories Edit',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'accessories',
    images: [
      { src: '/media/look-18.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-01.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-02.jpg', caption: '[PLACEHOLDER caption 03]' },
      { src: '/media/look-23.jpg', caption: '[PLACEHOLDER caption 04]' },
    ],
  },
  {
    slug: 'limited-edition-capsule',
    title: 'The Limited Edition Capsule',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'limited-edition',
    images: [
      { src: '/media/look-16.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-24.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-25.jpg', caption: '[PLACEHOLDER caption 03]' },
    ],
  },
  {
    slug: 'bespoke-atelier',
    title: 'The Bespoke Atelier',
    caption: '[PLACEHOLDER] Season caption / theme statement.',
    collection: 'bespoke',
    images: [
      { src: '/media/look-27.jpg', caption: '[PLACEHOLDER caption 01]' },
      { src: '/media/look-26.jpg', caption: '[PLACEHOLDER caption 02]' },
      { src: '/media/look-32.jpg', caption: '[PLACEHOLDER caption 03]' },
    ],
  },
]

export function getSeasonBySlug(slug) {
  return lookbookSeasons.find((s) => s.slug === slug)
}
