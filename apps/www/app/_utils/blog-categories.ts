/* Set in a post's frontmatter, e.g. `categories: [case]`. The order here is the order of the filter chips. */
export const blogCategories = ['case', 'updates', 'in-depth', 'about'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const isBlogCategory = (value: string): value is BlogCategory =>
  (blogCategories as readonly string[]).includes(value);
