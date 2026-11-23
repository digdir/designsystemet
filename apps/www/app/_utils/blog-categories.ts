/**
 * Categories used to filter blog posts.
 * Set them in a post's frontmatter, e.g. `categories: [case]`.
 * The order here is the order the filter chips are shown in.
 * Labels live in the locale files under `blog.categories`.
 */
export const blogCategories = ['case', 'updates', 'in-depth', 'about'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const isBlogCategory = (value: string): value is BlogCategory =>
  (blogCategories as readonly string[]).includes(value);

/* Accepts both a YAML list (`categories: [case, changes]`) and a comma-separated string */
export const parseBlogCategories = (value: unknown): BlogCategory[] => {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  return raw.map((category) => String(category).trim()).filter(isBlogCategory);
};
