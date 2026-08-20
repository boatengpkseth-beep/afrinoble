/**
 * Journal — CMS shape. Editorial copy pending final review.
 *
 * Article bodies are lorem-adjacent filler, not real reporting. Categories
 * match the master spec. Replace `author` with real bylines before launch.
 */
export const journalCategories = [
  'African Fashion',
  'Heritage',
  'Fabric',
  'Style',
  'Wedding',
  'Craftsmanship',
  'Behind the Scenes',
  'Culture',
  'Fashion Trends',
]

export const journalArticles = [
  {
    slug: 'the-language-of-kente',
    title: 'The Language of Kente',
    category: 'Fabric',
    author: 'The Afrinoble Journal',
    date: '2026-02-14',
    readingTime: '6 min read',
    heroImage: '/media/look-01.jpg',
    excerpt: 'Kente is not decorated — it speaks. Each named pattern carries a proverb, an occasion, a stance.',
    body: [
      'Before it is fashion, kente is language. Woven strip by strip on narrow looms, each pattern has a name, and each name has something to say — about patience, about lineage, about how a life should be carried.',
      'That is why the cloth appears at graduations and weddings rather than in wardrobes of convenience. You do not simply wear kente; you quote it.',
      'When we cut kente into a modern silhouette, the tailoring is deliberately quiet. The cloth has already said the important thing.',
    ],
  },
  {
    slug: 'inside-the-atelier',
    title: 'Inside the Atelier: A Season in Progress',
    category: 'Behind the Scenes',
    author: 'The Afrinoble Journal',
    date: '2026-01-30',
    readingTime: '4 min read',
    heroImage: '/media/look-26.jpg',
    excerpt: 'A season does not arrive — it is assembled, fitting by fitting, bolt by bolt.',
    body: [
      'A collection begins as a stack of cloth and a wall of sketches. For weeks the two stare at each other until the first toile gives way.',
      'The real editing happens on the body. A sleeve that photographed beautifully is recut twice because it argued with the drape of the robe beneath it.',
      'By the time a piece reaches the lookbook it has been handled by more people than will ever be photographed wearing it. That is the arithmetic of an atelier.',
    ],
  },
  {
    slug: 'wedding-traditions-reimagined',
    title: 'Wedding Traditions, Reimagined',
    category: 'Wedding',
    author: 'The Afrinoble Journal',
    date: '2026-01-12',
    readingTime: '5 min read',
    heroImage: '/media/look-21.jpg',
    excerpt: 'The ceremony changes cities; the cloth keeps its meaning.',
    body: [
      'A wedding is the one day most families still dress by tradition — the day the old cloths come out and the old rules apply, joyfully.',
      'Our wedding commissions begin with questions rather than measurements: whose traditions meet at this ceremony, what colours carry the families, what will the photographs need to say in thirty years.',
      'The answer is usually a wardrobe, not a garment — coordinated without matching, traditional without costume.',
    ],
  },
  {
    slug: 'the-hands-that-weave',
    title: 'The Hands That Weave',
    category: 'Craftsmanship',
    author: 'The Afrinoble Journal',
    date: '2025-12-20',
    readingTime: '7 min read',
    heroImage: '/media/look-02.jpg',
    excerpt: 'Every strip of woven cloth is a record of hours you cannot fake.',
    body: [
      'Machine cloth is measured in metres per minute. Strip-woven cloth is measured in days per strip — and the difference is visible from across a room.',
      'The weaver works a few inches at a time, building pattern from memory. Errors are not corrected; they are prevented, by a lifetime of practice.',
      'This is why we insist on telling you what the cloth is. The price of a woven piece is mostly time, and the time is mostly skill.',
    ],
  },
  {
    slug: 'what-luxury-means-here',
    title: 'What Luxury Means Here',
    category: 'Culture',
    author: 'The Afrinoble Journal',
    date: '2025-12-02',
    readingTime: '5 min read',
    heroImage: '/media/look-10.jpg',
    excerpt: 'Not louder logos — longer stories.',
    body: [
      'Luxury has been marketed as scarcity of supply. We think of it as density of meaning: how much intention is carried in the thing you put on.',
      'A garment whose cloth has a name, whose embroidery took a week, whose silhouette has centuries of occasion behind it, holds more than a monogram ever will.',
      'That is the standard this house sets for itself: everything we make should be worth explaining.',
    ],
  },
  {
    slug: 'ss26-color-story',
    title: 'SS26: A Color Story',
    category: 'Fashion Trends',
    author: 'The Afrinoble Journal',
    date: '2025-11-18',
    readingTime: '3 min read',
    heroImage: '/media/look-32.jpg',
    excerpt: 'Seafoam, caramel, plum — the season leans warm and unhurried.',
    body: [
      'This season the palette starts from earth and water: caramel and tobacco on one side, seafoam and teal on the other, with plum holding the evening.',
      'Colour is applied the way our embroiderers apply thread — one deliberate passage on a quiet field, never an argument of prints.',
      'The result photographs calm and wears calmer. Colour you keep, not colour you survive.',
    ],
  },
]

export function getArticleBySlug(slug) {
  return journalArticles.find((a) => a.slug === slug)
}

export function getRelatedArticles(article, limit = 3) {
  return journalArticles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, limit)
}
