/**
 * Lookbook — CMS shape. brand captions pending final review.
 */
export const lookbookSeasons = [
  {
    slug: 'ss26',
    title: 'Spring/Summer 2026',
    caption:
      'Light cloth, long shadows — the season moves outdoors and takes its colour with it.',
    collection: 'women',
    images: [
      { src: '/media/look-03.jpg', caption: 'Cut generously, worn lightly.' },
      { src: '/media/look-07.jpg', caption: 'Pattern doing the quiet work.' },
      { src: '/media/look-04.jpg', caption: 'The drape decides the silhouette.' },
      { src: '/media/look-11.jpg', caption: 'Embroidery in place of jewellery.' },
      { src: '/media/look-10.jpg', caption: 'Colour held to one field.' },
      { src: '/media/look-13.jpg', caption: 'Cloth first, always.' },
      { src: '/media/look-05.jpg', caption: 'Structure without stiffness.' },
      { src: '/media/look-08.jpg', caption: 'Made for the photograph and the day after.' },
      { src: '/media/look-15.jpg', caption: 'Heritage, worn at street pace.' },
      { src: '/media/look-20.jpg', caption: 'One motif, total attention.' },
    ],
  },
  {
    slug: 'fw25',
    title: 'Fall/Winter 2025',
    caption:
      'Weight and structure: tailoring for the months that ask more of a garment.',
    collection: 'men',
    images: [
      { src: '/media/look-28.jpg', caption: 'Cut generously, worn lightly.' },
      { src: '/media/look-29.jpg', caption: 'Pattern doing the quiet work.' },
      { src: '/media/look-30.jpg', caption: 'The drape decides the silhouette.' },
      { src: '/media/look-31.jpg', caption: 'Embroidery in place of jewellery.' },
      { src: '/media/look-09.jpg', caption: 'Colour held to one field.' },
      { src: '/media/look-12.jpg', caption: 'Cloth first, always.' },
      { src: '/media/look-17.jpg', caption: 'Structure without stiffness.' },
      { src: '/media/look-33.jpg', caption: 'Made for the photograph and the day after.' },
    ],
  },
  {
    slug: 'wedding-edit',
    title: 'The Wedding Edit',
    caption:
      'Cloth for ceremonies — commissioned, coordinated, kept.',
    collection: 'wedding',
    images: [
      { src: '/media/look-34.jpg', caption: 'Heritage, worn at street pace.' },
      { src: '/media/look-21.jpg', caption: 'One motif, total attention.' },
      { src: '/media/look-22.jpg', caption: 'Cut generously, worn lightly.' },
      { src: '/media/look-06.jpg', caption: 'Pattern doing the quiet work.' },
      { src: '/media/look-14.jpg', caption: 'The drape decides the silhouette.' },
      { src: '/media/look-19.jpg', caption: 'Embroidery in place of jewellery.' },
    ],
  },
  {
    slug: 'accessories-edit',
    title: 'The Accessories Edit',
    caption:
      'The finishing details: woven, printed, carried.',
    collection: 'accessories',
    images: [
      { src: '/media/look-18.jpg', caption: 'Colour held to one field.' },
      { src: '/media/look-01.jpg', caption: 'Cloth first, always.' },
      { src: '/media/look-02.jpg', caption: 'Structure without stiffness.' },
      { src: '/media/look-23.jpg', caption: 'Made for the photograph and the day after.' },
    ],
  },
  {
    slug: 'limited-edition-capsule',
    title: 'The Limited Edition Capsule',
    caption:
      'One bolt, few pieces, no repeats.',
    collection: 'limited-edition',
    images: [
      { src: '/media/look-16.jpg', caption: 'Heritage, worn at street pace.' },
      { src: '/media/look-24.jpg', caption: 'One motif, total attention.' },
      { src: '/media/look-25.jpg', caption: 'Cut generously, worn lightly.' },
    ],
  },
  {
    slug: 'bespoke-atelier',
    title: 'The Bespoke Atelier',
    caption:
      'Made to measure, made to mean something.',
    collection: 'bespoke',
    images: [
      { src: '/media/look-27.jpg', caption: 'Pattern doing the quiet work.' },
      { src: '/media/look-26.jpg', caption: 'The drape decides the silhouette.' },
      { src: '/media/look-32.jpg', caption: 'Embroidery in place of jewellery.' },
    ],
  },
]

export function getSeasonBySlug(slug) {
  return lookbookSeasons.find((s) => s.slug === slug)
}
