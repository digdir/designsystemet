import matter from 'gray-matter';

// Cache parsed frontmatter by source content, mirroring generate-from-mdx.ts.
const frontmatterCache = new Map<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: frontmatter shape varies per content type
  { [key: string]: any }
>();

/**
 * Parses only the YAML frontmatter from an MDX file using gray-matter — the same
 * parser bundleMDX uses internally, so values keep their types (e.g. `order` as a
 * number, `published` as a boolean).
 *
 * Index/layout loaders only need frontmatter, never the compiled MDX. Compiling
 * every file with bundleMDX in a loop is far too slow and blows React Router v8's
 * 10s prerender timeout on content-heavy sections; this is the cheap alternative.
 */
export const getFrontmatter = (
  fileContent: string,
  // biome-ignore lint/suspicious/noExplicitAny: frontmatter shape varies per content type
): { [key: string]: any } => {
  const cached = frontmatterCache.get(fileContent);
  if (cached) return cached;

  const { data } = matter(fileContent);
  frontmatterCache.set(fileContent, data);
  return data;
};
