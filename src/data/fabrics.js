/**
 * Fabrics — CMS shape.
 *
 * Descriptive copy is written at a general, widely-documented level and
 * kept free of specific historical claims. Recommend review with cultural
 * consultants/artisan partners before final launch.
 */
export const fabrics = [
  {
    slug: 'kente',
    name: 'Kente',
    origin: 'Ghana — woven by Asante and Ewe weavers',
    significance:
      'Kente is among the best-known cloths of West Africa: strips woven on narrow looms and sewn together, historically associated with Asante royalty and worn today at graduations, weddings and moments of pride across the diaspora.',
    craftsmanship:
      'Woven strip by strip on a narrow horizontal loom, then joined — each named pattern carries its own meaning and occasion.',
    modernInterpretation:
      'Afrinoble uses kente as a statement panel and facing cloth, letting a single woven strip carry a modern silhouette.',
    image: '/media/look-01.jpg',
    swatch: '/media/look-01.jpg',
  },
  {
    slug: 'adinkra',
    name: 'Adinkra',
    origin: 'Ghana — associated with the Asante, notably Ntonso',
    significance:
      'Adinkra symbols form a visual vocabulary of proverbs and values; cloth stamped with them has long been worn at significant occasions.',
    craftsmanship:
      'Stamps carved from calabash are dipped in a dye traditionally made from tree bark and pressed onto the cloth in measured grids.',
    modernInterpretation:
      'We echo adinkra geometry in embroidery and print, keeping symbols legible and treated with respect.',
    image: '/media/look-03.jpg',
    swatch: '/media/look-03.jpg',
  },
  {
    slug: 'ankara',
    name: 'Ankara',
    origin: 'West and Central Africa — wax-resist printed cotton',
    significance:
      'Ankara wax prints are a shared visual language across the region: saturated colour, emphatic pattern, and names and meanings that travel with the cloth.',
    craftsmanship:
      'Colour is built through wax-resist printing on cotton, giving equally vivid faces on both sides of the fabric.',
    modernInterpretation:
      'Ankara supplies our boldest colourways — cut into structured silhouettes so the print stays the loudest voice.',
    image: '/media/look-11.jpg',
    swatch: '/media/look-11.jpg',
  },
  {
    slug: 'aso-oke',
    name: 'Aso Oke',
    origin: 'Nigeria — handwoven by Yoruba weavers',
    significance:
      'Aso-oke is the Yoruba prestige cloth, woven for weddings, chieftaincy and celebration, and often commissioned for a specific occasion.',
    craftsmanship:
      'Woven in narrow strips on traditional looms, frequently with metallic threads and openwork patterns, then sewn edge to edge.',
    modernInterpretation:
      'Our ceremonial pieces use aso-oke where it has always belonged — at the centre of the occasion.',
    image: '/media/look-02.jpg',
    swatch: '/media/look-02.jpg',
  },
  {
    slug: 'bogolan',
    name: 'Bogolan',
    origin: 'Mali — mud-dyed cotton associated with Bamana communities',
    significance:
      'Bogolan, or mudcloth, carries earthy geometry built from fermented mud and plant dyes; its patterns have long carried local meaning.',
    craftsmanship:
      'Cotton strips are dyed with plant baths and painted with iron-rich mud, then washed to reveal the pattern in relief.',
    modernInterpretation:
      'We borrow bogolan geometry for prints and accents, pairing its earth palette with linen and clean tailoring.',
    image: '/media/look-06.jpg',
    swatch: '/media/look-06.jpg',
  },
  {
    slug: 'kitenge',
    name: 'Kitenge',
    origin: 'East Africa — printed cotton worn across the region',
    significance:
      'Kitenge is everyday elegance across East Africa — printed cotton exchanged as gifts, worn at celebrations and tailored to personal taste.',
    craftsmanship:
      'Rotary and wax-style printing lay saturated pattern onto cotton that softens with wear.',
    modernInterpretation:
      'Kitenge brings ease into the collection — fluid caftans and separates that move with the body.',
    image: '/media/look-07.jpg',
    swatch: '/media/look-07.jpg',
  },
  {
    slug: 'brocade',
    name: 'Brocade & Embroidery',
    origin: 'Contemporary ateliers across West Africa',
    significance:
      'Structured polished cottons and brocades are the modern canvas of West African menswear — the ground on which embroidered bibs, medallions and studwork announce an occasion.',
    craftsmanship:
      'Machine- and hand-embroidery, corded appliqué and beadwork are laid onto crisp cloth, most often concentrated at the chest and neckline of kaftans and agbadas.',
    modernInterpretation:
      'Our senator sets and three-piece agbadas are cut from these cloths — quiet fields of colour carrying one deliberate passage of ornament.',
    image: '/media/look-45.jpg',
    swatch: '/media/look-49.jpg',
  },
]

export function getFabricBySlug(slug) {
  return fabrics.find((f) => f.slug === slug)
}
