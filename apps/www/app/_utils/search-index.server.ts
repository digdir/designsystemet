/** This file is largely AI-generated, but checked and modified by humans when needed */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import matter from 'gray-matter';
import i18n from '../i18n';
import { getFilesFromContentDir, getFoldersInContentDir } from './files.server';

export type SearchLang = 'en' | 'no';

export type SearchType =
  | 'intro'
  | 'component'
  | 'blog'
  | 'fundamentals'
  | 'best-practices'
  | 'patterns';

export type SearchIndexItem = {
  id: string;
  /** Title as shown in results, e.g. "Button – Code" */
  title: string;
  /** Kind of page for pages that share a title with others, e.g. "Code" */
  pageLabel: string;
  description: string;
  /** Full plain text of the page, used for matching and excerpts */
  content: string;
  url: string;
  type: SearchType;
  lang: SearchLang;
  keywords: string[];
  headings: string[];
  /** Ranking multiplier, e.g. to rank component sub-pages below the overview */
  boost: number;
};

export type SearchResult = Pick<
  SearchIndexItem,
  'id' | 'title' | 'description' | 'url' | 'type'
> & {
  /** Text surrounding the match, set when the description doesn't show why the page matched */
  excerpt?: string;
};

/** Index item with precomputed, normalized fields so each search is cheap */
type SearchDocument = SearchIndexItem & {
  norm: { title: string; description: string; content: string };
  fields: { tokens: string[]; weight: number; fuzzy: boolean }[];
  keywordPhrases: string[];
};

export type SearchIndex = SearchDocument[];

const LANGS = i18n.supportedLngs as SearchLang[];
const CONTENT_PATH = join(cwd(), './app/content');

const FIELD_WEIGHTS = {
  title: 200,
  keywords: 60,
  pageLabel: 20,
  headings: 30,
  description: 20,
  content: 5,
};

/* Blog posts are news, so they are always listed after documentation */
const isBlog = (document: SearchIndexItem) => document.type === 'blog';

const TITLE_SEPARATOR = ' – ';

const COMPONENT_PAGES = ['overview', 'code', 'accessibility'] as const;

/**
 * Lowercase and fold the accents we use in nynorsk/loanwords (lèt, idé), so
 * users don't need to type them. Every replacement is one character for one
 * character, which keeps offsets aligned with the original text for excerpts.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[óòô]/g, 'o')
    .replace(/[àáâ]/g, 'a')
    .replace(/[üú]/g, 'u');
}

/** Split normalized text into words. `data-size` becomes `data` and `size` */
export function tokenize(normalized: string): string[] {
  return normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

const uniqueTokens = (text: string) => [...new Set(tokenize(normalize(text)))];

/** Normalized words separated by single spaces, for comparing phrases */
const toPhrase = (text: string) => tokenize(normalize(text)).join(' ');

const stripInlineMarkdown = (text: string) =>
  text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images, keep alt text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links, keep text
    .replace(/\*\*|__|~~|\*|`/g, '');

/**
 * Convert an MDX body (without frontmatter) to plain text and a list of its
 * headings. Text inside JSX elements and inline code is kept, since that is
 * often what users search for (`data-size`, `aria-label` and so on).
 */
function mdxToText(body: string): { text: string; headings: string[] } {
  let text = body.replace(/\r\n/g, '\n');

  text = text.replace(/```[\s\S]*?```/g, ' '); // fenced code blocks
  text = text.replace(/^(import|export)\s.*$/gm, ' '); // ESM
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' '); // MDX comments

  // Repeat until fully removed, to also handle nested/overlapping comments
  let previous: string;
  do {
    previous = text;
    text = text.replace(/<!--[\s\S]*?-->/g, ' ');
  } while (text !== previous);

  // Protect tags in inline code (`<button>`), which are text and not markup
  text = text.replace(/`[^`\n]+`/g, (code) => code.replace(/</g, '\uE000'));
  text = text.replace(/<\/?[A-Za-z][^>]*>/g, ' '); // JSX/HTML tags, keep children
  text = text.replace(/\uE000/g, '<');

  const headings = [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, heading]) =>
    stripInlineMarkdown(heading).trim(),
  );

  text = stripInlineMarkdown(text)
    .replace(/^#{1,6}\s+/gm, '') // heading markers
    .replace(/^\s*(?:[-*+]|>)\s+/gm, '') // list and blockquote markers
    .replace(/\|/g, ' ') // table cells
    .replace(/\s+/g, ' ')
    .trim();

  return { text, headings };
}

const toKeywords = (searchTerms: unknown): string[] => {
  const terms = Array.isArray(searchTerms)
    ? searchTerms
    : typeof searchTerms === 'string'
      ? searchTerms.split(',')
      : [];
  return terms.map((term) => String(term).trim()).filter(Boolean);
};

function createDocument(item: SearchIndexItem): SearchDocument {
  // Without the page label, so that searching for "code" doesn't rank the
  // code page of every component as a title match
  const baseTitle = item.pageLabel
    ? item.title.slice(0, item.title.lastIndexOf(TITLE_SEPARATOR))
    : item.title;

  return {
    ...item,
    norm: {
      title: toPhrase(item.title),
      description: toPhrase(item.description),
      content: normalize(item.content),
    },
    keywordPhrases: item.keywords.map(toPhrase),
    fields: [
      { weight: FIELD_WEIGHTS.title, fuzzy: true, text: baseTitle },
      { weight: FIELD_WEIGHTS.pageLabel, fuzzy: false, text: item.pageLabel },
      {
        weight: FIELD_WEIGHTS.keywords,
        fuzzy: true,
        text: item.keywords.join(' '),
      },
      {
        weight: FIELD_WEIGHTS.headings,
        fuzzy: true,
        text: item.headings.join(' '),
      },
      {
        weight: FIELD_WEIGHTS.description,
        fuzzy: false,
        text: item.description,
      },
      { weight: FIELD_WEIGHTS.content, fuzzy: false, text: item.content },
    ].map(({ text, ...field }) => ({ ...field, tokens: uniqueTokens(text) })),
  };
}

type PageOptions = {
  fileContent: string;
  url: string;
  type: SearchType;
  lang: SearchLang;
  fallbackTitle: string;
  fallbackDescription?: string;
  pageLabel?: string;
  boost?: number;
};

function indexPage({
  fileContent,
  url,
  type,
  lang,
  fallbackTitle,
  fallbackDescription = '',
  pageLabel = '',
  boost = 1,
}: PageOptions): SearchDocument | null {
  const { data: frontmatter, content: body } = matter(fileContent);

  // Unpublished pages are hidden from navigation, so keep them out of search too
  if (frontmatter.published === false) return null;

  const { text, headings } = mdxToText(body);
  const description = String(frontmatter.description || fallbackDescription);

  return createDocument({
    id: url,
    title: `${frontmatter.title || fallbackTitle}${pageLabel && TITLE_SEPARATOR}${pageLabel}`,
    pageLabel,
    description: description.replace(/`/g, ''),
    content: text,
    url,
    type,
    lang,
    keywords: toKeywords(frontmatter.search_terms),
    headings,
    boost,
  });
}

/** Index every MDX file in `content/<folder>/<lang>` */
function indexSection(
  folder: string,
  type: SearchType,
  urlPrefix = folder,
): SearchDocument[] {
  return LANGS.flatMap((lang) =>
    getFilesFromContentDir(join(folder, lang)).flatMap((file) => {
      const slug = file.relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

      return (
        indexPage({
          fileContent: readFileSync(file.path, 'utf-8'),
          url: `/${lang}/${urlPrefix}/${slug}`,
          type,
          lang,
          fallbackTitle: slug.split('/').pop() || slug,
        }) ?? []
      );
    }),
  );
}

type ComponentMetadata = Partial<
  Record<SearchLang, { title?: string; subtitle?: string }>
>;

function loadComponentMetadata(component: string): ComponentMetadata {
  const path = join(CONTENT_PATH, 'components', component, 'metadata.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    console.warn(`Could not parse ${path}`);
    return {};
  }
}

/** Index the overview, code and accessibility page of every component */
function indexComponents(): SearchDocument[] {
  return getFoldersInContentDir('components').flatMap((component) => {
    const metadata = loadComponentMetadata(component);

    return LANGS.flatMap((lang) => {
      const pageLabels = i18n.resources[lang].component;

      return COMPONENT_PAGES.flatMap((page) => {
        const filePath = join(
          CONTENT_PATH,
          'components',
          component,
          lang,
          `${page}.mdx`,
        );
        if (!existsSync(filePath)) return [];
        const isOverview = page === 'overview';

        return (
          indexPage({
            fileContent: readFileSync(filePath, 'utf-8'),
            url: `/${lang}/components/docs/${component}/${page}`,
            type: 'component',
            lang,
            fallbackTitle:
              metadata[lang]?.title ||
              component.charAt(0).toUpperCase() + component.slice(1),
            fallbackDescription: metadata[lang]?.subtitle,
            pageLabel: isOverview ? '' : pageLabels[page],
            // Rank the overview above the code and accessibility pages
            boost: isOverview ? 1 : 0.6,
          }) ?? []
        );
      });
    });
  });
}

export function buildSearchIndex(): SearchIndex {
  return [
    ...indexComponents(),
    // Shared component docs: general accessibility, hooks and utilities
    ...indexSection('components-docs', 'component', 'components'),
    ...indexSection('intro', 'intro'),
    ...indexSection('fundamentals', 'fundamentals'),
    ...indexSection('best-practices', 'best-practices'),
    ...indexSection('patterns', 'patterns'),
    ...indexSection('blog', 'blog'),
  ];
}

/** Levenshtein distance, bailing out when it exceeds `max` */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }

  return previous[b.length];
}

/**
 * How well a search term matches the best token in a field, from 0 to 1.
 * Substring matches are needed for Norwegian compounds ("knapp" in
 * "radioknapp"), and prefix matches for search-as-you-type.
 */
function matchQuality(term: string, tokens: string[]): number {
  let best = 0;
  for (const token of tokens) {
    if (token === term) return 1;
    if (token.startsWith(term)) best = Math.max(best, 0.75);
    else if (term.length >= 4 && token.includes(term))
      best = Math.max(best, 0.5);
  }
  return best;
}

function fuzzyQuality(term: string, tokens: string[]): number {
  if (term.length < 4) return 0;
  const maxDistance = term.length < 8 ? 1 : 2;
  return tokens.some(
    (token) => editDistance(term, token, maxDistance) <= maxDistance,
  )
    ? 0.4
    : 0;
}

/** Score every document for a single search term. Documents without a match are left out */
function scoreTerm(
  documents: SearchDocument[],
  term: string,
): Map<SearchDocument, number> {
  const scores = new Map<SearchDocument, number>();
  const run = (
    quality: (tokens: string[]) => number,
    includeField: (field: SearchDocument['fields'][number]) => boolean,
  ) => {
    for (const document of documents) {
      let score = 0;
      for (const field of document.fields) {
        if (includeField(field)) score += field.weight * quality(field.tokens);
      }
      if (score > 0) scores.set(document, score);
    }
  };

  run(
    (tokens) => matchQuality(term, tokens),
    () => true,
  );

  // Only assume a typo when the term doesn't match anything as written.
  // Otherwise "card" would also give results for "hard".
  if (scores.size === 0) {
    run(
      (tokens) => fuzzyQuality(term, tokens),
      (field) => field.fuzzy,
    );
  }

  return scores;
}

function getExcerpt(
  document: SearchDocument,
  query: string,
  terms: string[],
): string | undefined {
  const { title, description, content } = document.norm;
  // Terms the user can't already see in the result
  const hiddenTerms = terms.filter(
    (term) =>
      !title.includes(term) &&
      !description.includes(term) &&
      !document.keywordPhrases.some((keyword) => keyword.includes(term)),
  );
  if (!hiddenTerms.length) return undefined;
  // Offsets are only valid when normalizing didn't change the length
  if (content.length !== document.content.length) return undefined;

  const start = [query, ...hiddenTerms]
    .map((needle) => content.indexOf(needle))
    .find((index) => index !== -1);
  if (start === undefined) return undefined;

  const text = document.content;
  let from = Math.max(0, start - 60);
  let to = Math.min(text.length, start + 140);
  // Snap to whole words
  if (from > 0) from = text.indexOf(' ', from) + 1;
  if (to < text.length) to = Math.max(text.lastIndexOf(' ', to), start);

  return `${from > 0 ? '… ' : ''}${text.slice(from, to)}${to < text.length ? ' …' : ''}`;
}

/**
 * Search the index. All terms must match a document. If no document matches
 * all terms, documents matching most of the terms are returned instead.
 */
export function searchIndex(
  index: SearchIndex,
  rawQuery: string,
  lang: SearchLang,
  limit = 20,
): SearchResult[] {
  const query = toPhrase(rawQuery);
  const terms = [...new Set(query.split(' ').filter(Boolean))];
  if (!terms.length) return [];

  const documents = index.filter((document) => document.lang === lang);
  const termScores = terms.map((term) => scoreTerm(documents, term));

  const rank = (requireAll: boolean) =>
    documents.flatMap((document) => {
      let score = 0;
      let matched = 0;
      termScores.forEach((scores, i) => {
        const termScore = scores.get(document);
        if (!termScore) return;
        // Very short words ("i", "of") say little when not all terms match
        if (requireAll || terms[i].length > 2) matched++;
        score += termScore;
      });

      if (requireAll ? matched < terms.length : matched === 0) return [];
      if (!requireAll) score *= (matched / terms.length) ** 2;

      const { title, description, content } = document.norm;
      if (title === query) score += 300;
      else if (title.startsWith(query)) score += 150;
      if (document.keywordPhrases.includes(query)) score += 100;
      if (terms.length > 1) {
        if (title.includes(query)) score += 100;
        if (description.includes(query) || content.includes(query)) score += 40;
      }

      score *= document.boost;
      return { document, score };
    });

  let ranked = rank(true);
  if (!ranked.length && terms.length > 1) ranked = rank(false);

  return ranked
    .sort(
      (a, b) =>
        Number(isBlog(a.document)) - Number(isBlog(b.document)) ||
        b.score - a.score ||
        a.document.title.localeCompare(b.document.title),
    )
    .slice(0, limit)
    .map(({ document }) => ({
      id: document.id,
      title: document.title,
      description: document.description,
      url: document.url,
      type: document.type,
      excerpt: getExcerpt(document, query, terms),
    }));
}

const DEVELOPMENT = process.env.NODE_ENV === 'development';
/* Content only changes on deploy in production, but is edited live in development */
const DEVELOPMENT_MAX_AGE = 5000;

let cachedIndex: { index: SearchIndex; builtAt: number } | null = null;

/**
 * Get or build the search index (with caching)
 */
export function getSearchIndex(): SearchIndex {
  const isStale =
    DEVELOPMENT &&
    cachedIndex &&
    Date.now() - cachedIndex.builtAt > DEVELOPMENT_MAX_AGE;

  if (!cachedIndex || isStale) {
    cachedIndex = { index: buildSearchIndex(), builtAt: Date.now() };
  }
  return cachedIndex.index;
}
