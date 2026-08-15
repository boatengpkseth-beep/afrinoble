/**
 * Fabrics — CMS shape.
 *
 * PLACEHOLDER CONTENT. Per project instruction, no real cultural/historical
 * claims are fabricated here — origin/significance/craftsmanship copy is
 * marked [PLACEHOLDER] and must be replaced with verified information
 * (ideally reviewed with cultural consultants/artisan partners) before
 * publishing. The fabric NAMES are real, well-documented textile
 * traditions; the descriptive copy is not sourced and must not be treated
 * as fact.
 */
export const fabrics = [
  {
    slug: 'kente',
    name: 'Kente',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance:
      '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship:
      '[PLACEHOLDER] Description of the weaving process and craftsmanship.',
    modernInterpretation:
      '[PLACEHOLDER] How Afrinoble reinterprets this textile in a contemporary silhouette.',
    image: '/media/look-01.jpg',
    swatch: '/media/look-01.jpg',
  },
  {
    slug: 'adinkra',
    name: 'Adinkra',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance: '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship: '[PLACEHOLDER] Description of the stamping/printing process.',
    modernInterpretation: '[PLACEHOLDER] Contemporary application in the collection.',
    image: '/media/look-03.jpg',
    swatch: '/media/look-03.jpg',
  },
  {
    slug: 'ankara',
    name: 'Ankara',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance: '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship: '[PLACEHOLDER] Description of the wax-print process.',
    modernInterpretation: '[PLACEHOLDER] Contemporary application in the collection.',
    image: '/media/look-11.jpg',
    swatch: '/media/look-11.jpg',
  },
  {
    slug: 'aso-oke',
    name: 'Aso Oke',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance: '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship: '[PLACEHOLDER] Description of the strip-weaving process.',
    modernInterpretation: '[PLACEHOLDER] Contemporary application in the collection.',
    image: '/media/look-02.jpg',
    swatch: '/media/look-02.jpg',
  },
  {
    slug: 'bogolan',
    name: 'Bogolan',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance: '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship: '[PLACEHOLDER] Description of the mud-cloth dyeing process.',
    modernInterpretation: '[PLACEHOLDER] Contemporary application in the collection.',
    image: '/media/look-06.jpg',
    swatch: '/media/look-06.jpg',
  },
  {
    slug: 'kitenge',
    name: 'Kitenge',
    origin: '[PLACEHOLDER — origin/region to confirm]',
    significance: '[PLACEHOLDER] Cultural significance to be written with verified sourcing.',
    craftsmanship: '[PLACEHOLDER] Description of the printing process.',
    modernInterpretation: '[PLACEHOLDER] Contemporary application in the collection.',
    image: '/media/look-07.jpg',
    swatch: '/media/look-07.jpg',
  },
]

export function getFabricBySlug(slug) {
  return fabrics.find((f) => f.slug === slug)
}
