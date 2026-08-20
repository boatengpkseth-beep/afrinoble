/**
 * Products — CMS shape.
 *
 * Catalog copy is brand copy pending the house's final review —
 * replace with the real catalog (ideally via a commerce backend query)
 * before launch. `collection` and `fabric` are slug references into
 * collections.js / fabrics.js, matching how a real CMS would relate
 * entries.
 */
export const products = [
  {
    slug: 'adaeze-wrap-gown',
    name: 'Adaeze Wrap Gown',
    collection: 'women',
    fabric: 'kente',
    price: 75,
    currency: 'USD',
    description:
      'A wrap gown with a deep V neckline and a skirt cut to move. The waist ties to your shape; the hem falls just below the knee.',
    story:
      'Named for grace, the Adaeze pairs heritage cloth with the easiest silhouette in the collection — one piece, one tie, endlessly worn.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availability: 'in-stock',
    images: [
      '/media/look-07.jpg',
      '/media/look-11.jpg',
      '/media/look-04.jpg',
    ],
    care: 'Dry clean only. Store on a padded hanger.',
  },
  {
    slug: 'obi-tailored-coat',
    name: 'Obi Tailored Coat',
    collection: 'men',
    fabric: 'aso-oke',
    price: 80,
    currency: 'USD',
    description:
      'A structured coat with sharp lapels and a clean tapered line, cut close through the shoulder and easy through the body.',
    story:
      'The Obi takes the discipline of classic tailoring and lets the cloth do the talking.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: [
      '/media/look-06.jpg',
      '/media/look-27.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'nia-ceremonial-set',
    name: 'Nia Ceremonial Set',
    collection: 'wedding',
    fabric: 'aso-oke',
    price: 120,
    currency: 'USD',
    description:
      'A ceremonial two-piece of woven cloth, finished with hand-rolled edges — made to be photographed and kept.',
    story:
      'Commissioned pieces like the Nia are cut only after your measurements arrive; no two sets leave the atelier identical.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availability: 'made-to-order',
    images: [
      '/media/look-30.jpg',
      '/media/look-21.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'kwame-two-piece',
    name: 'Kwame Two-Piece',
    collection: 'men',
    fabric: 'kente',
    price: 80,
    currency: 'USD',
    description:
      'A relaxed two-piece: boxy shirt, drawstring trouser, one continuous pattern across both.',
    story:
      'The Kwame is our everyday argument that heritage cloth belongs in daylight, not only at ceremonies.',
    sizes: ['46', '48', '50', '52'],
    availability: 'in-stock',
    images: [
      '/media/look-08.jpg',
      '/media/look-23.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'amara-silk-blouse',
    name: 'Amara Silk Blouse',
    collection: 'women',
    fabric: 'adinkra',
    price: 75,
    currency: 'USD',
    description:
      'A fluid blouse with covered buttons and a soft point collar, light enough to forget.',
    story:
      'The Amara borrows its geometry from stamped symbols and lets silk soften every line.',
    sizes: ['XS', 'S', 'M', 'L'],
    availability: 'low-stock',
    images: [
      '/media/look-11.jpg',
      '/media/look-07.jpg',
    ],
    care: 'Hand wash cold.',
  },
  {
    slug: 'zola-column-dress',
    name: 'Zola Column Dress',
    collection: 'limited-edition',
    fabric: 'bogolan',
    price: 75,
    currency: 'USD',
    description:
      'A floor-length column with a high neck and a controlled side slit — spare, graphic, unhurried.',
    story:
      'Cut in earthy cloth, the Zola is the quietest piece in the room and usually the most looked at.',
    sizes: ['XS', 'S', 'M', 'L'],
    availability: 'low-stock',
    images: [
      '/media/look-03.jpg',
      '/media/look-04.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'sena-woven-clutch',
    name: 'Sena Woven Clutch',
    collection: 'accessories',
    fabric: 'kente',
    price: 380,
    currency: 'USD',
    description:
      'A structured clutch faced in handwoven cloth over a rigid shell, with a magnetic closure and cotton lining.',
    story:
      'One strip of cloth, chosen for its pattern run, faces each clutch — the weave decides the design.',
    sizes: ['One Size'],
    availability: 'in-stock',
    images: [
      '/media/look-01.jpg',
      '/media/look-18.jpg',
    ],
    care: 'Wipe clean with a dry cloth.',
  },
  {
    slug: 'tobi-silk-scarf',
    name: 'Tobi Silk Scarf',
    collection: 'accessories',
    fabric: 'ankara',
    price: 240,
    currency: 'USD',
    description:
      'A generous silk square with hand-finished edges, printed in a saturated wax-print motif.',
    story:
      'Worn at the neck, the head, or the handle of a bag — the Tobi is the fastest route into the collection.',
    sizes: ['One Size'],
    availability: 'in-stock',
    images: [
      '/media/look-07.jpg',
      '/media/look-11.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'folasade-evening-caftan',
    name: 'Folasade Evening Caftan',
    collection: 'women',
    fabric: 'kitenge',
    price: 75,
    currency: 'USD',
    description:
      'A floor-sweeping caftan with bell sleeves and a beaded neckline, cut generously and finished light.',
    story:
      'The Folasade is evening ease — one garment, zero effort, full presence.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availability: 'in-stock',
    images: [
      '/media/look-04.jpg',
      '/media/look-03.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'ekon-formal-agbada',
    name: 'Ekon Formal Agbada',
    collection: 'wedding',
    fabric: 'aso-oke',
    price: 120,
    currency: 'USD',
    description:
      'A full formal agbada: flowing outer robe, inner tunic and tailored trouser, with embroidery at the neckline.',
    story:
      'Made to order for grooms and celebrants, the Ekon is cut to your measurements and finished by hand.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: [
      '/media/look-05.jpg',
      '/media/look-15.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'chidinma-mini-dress',
    name: 'Chidinma Mini Dress',
    collection: 'limited-edition',
    fabric: 'adinkra',
    price: 75,
    currency: 'USD',
    description:
      'A sharp mini with a structured bodice and A-line skirt — youthful, graphic, precise.',
    story:
      'The Chidinma reworks symbol-stamped cloth at mini length: heritage, abbreviated.',
    sizes: ['XS', 'S', 'M'],
    availability: 'low-stock',
    images: [
      '/media/look-11.jpg',
      '/media/look-03.jpg',
    ],
    care: 'Dry clean only.',
  },
  {
    slug: 'malik-linen-shirt',
    name: 'Malik Linen Shirt',
    collection: 'men',
    fabric: 'bogolan',
    price: 80,
    currency: 'USD',
    description:
      'A relaxed linen shirt with a camp collar and a mud-cloth inspired placket detail.',
    story:
      'The Malik is the shirt you travel with — breathable linen carrying a trace of our boldest cloth.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: 'in-stock',
    images: [
      '/media/look-32.jpg',
      '/media/look-09.jpg',
    ],
    care: 'Machine wash cold, line dry.',
  },
  {
    slug: 'tunde-agbada-set',
    name: 'Tunde Agbada Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A crisp white three-piece set with a teal corded-embroidery neckline, side pockets and a matching tailored trouser.',
    story:
      'Worn with a teal fila, the Tunde is made for the moments a photograph will outlive — white kept simple, colour kept deliberate.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-37.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'sefa-kaftan-set',
    name: 'Sefa Kaftan Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A seafoam kaftan set with a mandarin collar and a pleated multi-stripe placket that curves into the chest, over a matching trouser.',
    story:
      'The Sefa bends a straight line on purpose — quiet cloth, one confident gesture of colour.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-38.jpg'],
    care: 'Dry clean only.',
  },
  {
    slug: 'adom-agbada-set',
    name: 'Adom Agbada Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A sage set with bold green-and-cream corded embroidery circling the neckline and running to a medallion at the chest.',
    story:
      'The Adom lets one motif carry the whole garment — embroidery as jewellery.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-35.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'odum-senator-set',
    name: 'Odum Senator Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A tan micro-suede senator set with a graphic three-wolf chest print and half sleeves, over a slim matching trouser.',
    story:
      'The Odum is the collection at its most contemporary — soft cloth, hard graphic, no ceremony required.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-36.jpg'],
    care: 'Dry clean only. Do not iron the print.',
  },
  {
    slug: 'kwabena-medallion-set',
    name: 'Kwabena Medallion Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A charcoal kaftan set with three descending gold medallions embroidered down the chest and a bar-detail neckline.',
    story:
      'Three suns on dark cloth — the Kwabena is evening wear that works before sunset.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-39.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'jide-agbada-set',
    name: 'Jide Agbada Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A deep teal-blue set with a gold diamond-and-crescent embroidery at the chest, worn over a matching trouser.',
    story:
      'The Jide pairs our richest blue with a single ornament of gold — presence without noise.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'in-stock',
    images: ['/media/look-40.jpg'],
    care: 'Dry clean only.',
  },
  {
    slug: 'ayo-leisure-set',
    name: 'Ayo Leisure Set',
    collection: 'men',
    fabric: 'brocade',
    price: 80,
    currency: 'USD',
    description:
      'A white textured co-ord: oversized tee with a birdcage motif at the chest and a pleated relaxed trouser.',
    story:
      'The Ayo is the off-duty piece — cut loose, printed once, worn everywhere.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: 'in-stock',
    images: ['/media/look-41.jpg'],
    care: 'Machine wash cold, line dry.',
  },
  {
    slug: 'chike-agbada',
    name: 'Chike Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A midnight-navy three-piece agbada with an interlocking geometric panel of bronze, blue and gold squares at the chest.',
    story:
      'Architecture on cloth — the Chike squares its shoulders and lets the geometry speak.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-42.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'emeka-agbada',
    name: 'Emeka Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A black three-piece agbada with a textured bib framed in champagne piping and an isometric gold cube motif.',
    story:
      'The Emeka draws with a single line of gold on black — quiet mathematics, full ceremony.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-43.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'dele-agbada',
    name: 'Dele Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'An all-black three-piece agbada with a tonal beaded bib and matching cap — black on black, texture on texture.',
    story:
      'The Dele is for the man who wants the room to lean in closer.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-44.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'oba-agbada',
    name: 'Oba Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A white three-piece agbada with a sweeping basketweave-embroidered bib traced in gold studs, curving from shoulder to hem line.',
    story:
      'The Oba is our most formal white — woven light, worn like a title.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-45.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'obasi-agbada',
    name: 'Obasi Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'An olive three-piece agbada with a gold interlocking-rings bib bordered in fine chain embroidery.',
    story:
      'The Obasi carries its gold like a family heirloom — front and centre, nothing else needed.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-46.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'segun-agbada',
    name: 'Segun Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A black three-piece agbada with a grid of square gold studs across the bib and an echoing cluster below, finished with a matching cap.',
    story:
      'Shown on the stand and on the street — the Segun holds its line either way.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-47.jpg', '/media/look-47b.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'kunle-agbada',
    name: 'Kunle Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A maroon three-piece agbada with a chest panel of embroidered check diamonds in red and black.',
    story:
      'The Kunle is depth of colour first — one field of maroon, one panel of pattern.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-48.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'osei-agbada',
    name: 'Osei Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A caramel three-piece agbada with an abstract appliqué chest panel — triangles, crescents and squares in tobacco and gold.',
    story:
      'The Osei treats the bib like a canvas; every shape is stitched, none is printed.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-49.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'adisa-agbada',
    name: 'Adisa Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'An olive-green three-piece agbada with tonal diamond embroidery descending the chest, styled with cap and beads.',
    story:
      'The Adisa dresses like an occasion even before the accessories arrive.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-50.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'bayo-agbada',
    name: 'Bayo Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A royal-blue three-piece agbada with a single tonal diamond motif at the chest and a matching soft cap.',
    story:
      'One colour, worn completely — the Bayo is as direct as luxury gets.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-51.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'nkem-agbada',
    name: 'Nkem Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A deep green three-piece agbada with a teal mosaic-embroidered bib falling to a point at the chest.',
    story:
      'The Nkem sets stone-quiet green against a bib that catches every light in the room.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-52.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'rotimi-agbada',
    name: 'Rotimi Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A rose three-piece agbada with a framed bib of tile-work embroidery and scattered crystal points.',
    story:
      'The Rotimi proves softness and ceremony are not opposites.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-53.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'chidi-agbada',
    name: 'Chidi Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A plum three-piece agbada with tonal embroidery — a laddered placket, diamond band and circular medallion, all in self-colour.',
    story:
      'The Chidi whispers its ornament; you see the work only when you are close enough to greet.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-54.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'jaja-agbada',
    name: 'Jaja Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A champagne three-piece agbada with a fretwork bib carrying an embroidered lion at its centre.',
    story:
      'The Jaja wears its courage quietly — a lion in thread, not in volume.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-55.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'mansa-agbada',
    name: 'Mansa Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A mocha three-piece agbada with chain-link embroidery over the shoulders and a looped rosette knot at the chest.',
    story:
      'The Mansa builds its presence from one continuous line of thread.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-56.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'kobina-agbada',
    name: 'Kobina Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A chocolate three-piece agbada with a cross-stitch sampler bib in cream and cocoa falling to a rounded point.',
    story:
      'The Kobina looks hand-counted because it is meant to — pattern with a pulse.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-57.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'okon-agbada',
    name: 'Okon Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A black three-piece agbada with rows of gold-tipped tassel embroidery on the bib and a corded rosette, with matching cap.',
    story:
      'The Okon moves and the gold moves with it — ornament designed for a room in motion.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-58.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'wale-agbada',
    name: 'Wale Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A gold-ochre three-piece agbada with a honeycomb-embroidered bib outlined in black, with matching cap.',
    story:
      'The Wale is warmth as a statement — honey tones, sharpened by black.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-59.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
  {
    slug: 'tunji-agbada',
    name: 'Tunji Agbada — Three Piece',
    collection: 'men',
    fabric: 'brocade',
    price: 120,
    currency: 'USD',
    description:
      'A burgundy three-piece agbada edged in gold piping with a serpentine beaded panel cascading down the chest.',
    story:
      'The Tunji earns the light it catches — every bead set by hand.',
    sizes: ['46', '48', '50', '52', '54'],
    availability: 'made-to-order',
    images: ['/media/look-60.jpg'],
    care: 'Dry clean only. Press embroidery from the reverse.',
  },
]

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCollection(collectionSlug) {
  return products.filter((p) => p.collection === collectionSlug)
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.slug !== product.slug && p.collection === product.collection)
    .slice(0, limit)
}

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}
