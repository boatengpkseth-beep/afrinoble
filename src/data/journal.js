/**
 * Journal — CMS shape. PLACEHOLDER EDITORIAL.
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
    author: '[PLACEHOLDER Author]',
    date: '2026-02-14',
    readingTime: '6 min read',
    heroImage: '/media/look-01.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: [
      '[PLACEHOLDER] Opening paragraph of the article.',
      '[PLACEHOLDER] Second paragraph — development of the idea.',
      '[PLACEHOLDER] Closing paragraph.',
    ],
  },
  {
    slug: 'inside-the-atelier',
    title: 'Inside the Atelier: A Season in Progress',
    category: 'Behind the Scenes',
    author: '[PLACEHOLDER Author]',
    date: '2026-01-30',
    readingTime: '4 min read',
    heroImage: '/media/look-26.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: [
      '[PLACEHOLDER] Opening paragraph of the article.',
      '[PLACEHOLDER] Second paragraph.',
    ],
  },
  {
    slug: 'wedding-traditions-reimagined',
    title: 'Wedding Traditions, Reimagined',
    category: 'Wedding',
    author: '[PLACEHOLDER Author]',
    date: '2026-01-12',
    readingTime: '5 min read',
    heroImage: '/media/look-21.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: ['[PLACEHOLDER] Opening paragraph.', '[PLACEHOLDER] Closing paragraph.'],
  },
  {
    slug: 'the-hands-that-weave',
    title: 'The Hands That Weave',
    category: 'Craftsmanship',
    author: '[PLACEHOLDER Author]',
    date: '2025-12-20',
    readingTime: '7 min read',
    heroImage: '/media/look-02.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: ['[PLACEHOLDER] Opening paragraph.', '[PLACEHOLDER] Closing paragraph.'],
  },
  {
    slug: 'what-luxury-means-here',
    title: 'What Luxury Means Here',
    category: 'Culture',
    author: '[PLACEHOLDER Author]',
    date: '2025-12-02',
    readingTime: '5 min read',
    heroImage: '/media/look-10.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: ['[PLACEHOLDER] Opening paragraph.', '[PLACEHOLDER] Closing paragraph.'],
  },
  {
    slug: 'ss26-color-story',
    title: 'SS26: A Color Story',
    category: 'Fashion Trends',
    author: '[PLACEHOLDER Author]',
    date: '2025-11-18',
    readingTime: '3 min read',
    heroImage: '/media/look-32.jpg',
    excerpt: '[PLACEHOLDER] A short excerpt introducing the piece.',
    body: ['[PLACEHOLDER] Opening paragraph.', '[PLACEHOLDER] Closing paragraph.'],
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
