/**
 * Craft traditions — CMS shape.
 *
 * These entries describe real, well-documented West African craft
 * traditions rather than named individuals. When Afrinoble documents its
 * artisan partners (with their consent), replace these with real people.
 */
export const artisans = [
  {
    slug: 'artisan-1',
    name: 'The Strip-Loom Weavers',
    craft: 'Kente weaving',
    region: 'Ghana',
    bio: 'On narrow horizontal looms, weavers turn silk and cotton into named patterns a few inches at a time. The strips are sewn edge to edge into cloth worn for pride and celebration — a craft passed from master to apprentice for generations.',
    portrait: '/media/look-01.jpg',
    process: [
      '/media/look-06.jpg',
      '/media/look-17.jpg',
    ],
  },
  {
    slug: 'artisan-2',
    name: 'The Tailors of the Atelier',
    craft: 'Cutting and construction',
    region: 'West Africa',
    bio: 'Every Afrinoble silhouette passes through tailors trained in both traditional dress and modern construction — the hands that turn flat cloth into an agbada that falls correctly from the first wearing.',
    portrait: '/media/look-12.jpg',
    process: [
      '/media/look-09.jpg',
      '/media/look-19.jpg',
    ],
  },
  {
    slug: 'artisan-3',
    name: 'The Embroiderers',
    craft: 'Corded embroidery and beadwork',
    region: 'Nigeria and Ghana',
    bio: 'The chest panels on our kaftans and agbadas are built stitch by stitch — corded lines, medallions, studs and beads laid onto crisp cloth until ornament carries the garment.',
    portrait: '/media/look-02.jpg',
    process: [
      '/media/look-16.jpg',
      '/media/look-05.jpg',
    ],
  },
  {
    slug: 'artisan-4',
    name: 'The Dyers and Printers',
    craft: 'Resist-dyeing and wax print',
    region: 'West and East Africa',
    bio: 'From indigo baths to wax-resist printing, colour in this collection begins in dye houses where recipes are memory, not manuals.',
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
