/**
 * Generate machine-readable component contracts ("twins") from the source.
 *
 * A twin is one JSON file per component, giving AI agents and other tooling a
 * contract to look up instead of guessing: the real export name, the emitted
 * class and data attributes, the design tokens, and the JSDoc summary. An
 * llms.txt index (https://llmstxt.org) is written alongside so an agent can
 * discover every contract from one file.
 *
 * Every generated field is wrapped as { provenance: 'extracted', source, value }:
 * it is read from this repository and regenerates on every run, so it cannot
 * drift from the code. Fields that exist only as prose in the documentation —
 * accessibility requirements, composition rules, when to use what — are stubbed
 * as { provenance: 'authored', value: null }. The generator never invents them;
 * a twin that guessed its accessibility rules would look complete and be wrong.
 *
 *   node scripts/generate-twins.mjs [--out <dir>]   # default: ./registry
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'packages/react/src/components');
const CSS_SRC = join(ROOT, 'packages/css/src');
const PKG = JSON.parse(
  readFileSync(join(ROOT, 'packages/react/package.json'), 'utf8'),
);
const OUT = resolve(
  ROOT,
  process.argv.includes('--out')
    ? process.argv[process.argv.indexOf('--out') + 1]
    : 'registry',
);

/* Docs links carry /en/: export names and the code agents write are English. */
const docsUrl = (slug, page) =>
  `https://designsystemet.no/en/components/docs/${slug}/${page}`;

const extracted = (source, value) => ({
  provenance: 'extracted',
  source,
  value,
});
const authoredStub = (source) => ({
  provenance: 'authored',
  source,
  value: null,
});

/**
 * The exported component name and its JSDoc, matched as one unit: the comment
 * block immediately preceding `export const`. Requiring adjacency keeps an
 * unrelated file-header comment from being read as the component's JSDoc, and
 * requiring the JSDoc at all keeps hooks and internals out of the registry —
 * a documented export is the component's public face.
 */
function exportedComponent(src) {
  const m = src.match(
    /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*export const ([A-Z]\w+)/,
  );
  if (!m) return null;
  const lines = m[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, ''));
  const exampleAt = lines.findIndex((l) => l.trim().startsWith('@example'));
  const description =
    (exampleAt === -1 ? lines : lines.slice(0, exampleAt))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim() || null;
  const example =
    exampleAt === -1
      ? null
      : lines
          .slice(exampleAt + 1)
          .join('\n')
          .trim() || null;
  return { name: m[2], description, example };
}

/** The root ds-* class, e.g. cl('ds-alert', ...). */
function dsClass(src) {
  return src.match(/\bcl\(\s*['"`](ds-[a-z-]+)['"`]/)?.[1] ?? null;
}

/** The CSS custom properties the component's stylesheet declares. */
function tokens(slug) {
  const file = join(CSS_SRC, `${slug}.css`);
  if (!existsSync(file)) return [];
  return [
    ...new Set(readFileSync(file, 'utf8').match(/--dsc?-[a-z0-9-]+/g) ?? []),
  ].sort();
}

/** data-* attributes the render emits, so tooling can recognise them in the DOM. */
function emittedAttrs(src) {
  return [...new Set(src.match(/data-[a-z-]+(?==)/g) ?? [])].sort();
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'components'), { recursive: true });

const written = [];
for (const dir of readdirSync(COMPONENTS, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const slug = dir.name;
  for (const file of readdirSync(join(COMPONENTS, slug))) {
    if (!file.endsWith('.tsx') || /\.(stories|test|chromatic)\.tsx$/.test(file))
      continue;
    const src = readFileSync(join(COMPONENTS, slug, file), 'utf8');
    const component = exportedComponent(src);
    if (!component) continue;

    const { name, description, example } = component;
    const sourcePath = `packages/react/src/components/${slug}/${file}`;
    const twin = {
      schemaVersion: '0.1.0',
      kind: 'component',
      name,
      slug,
      package: { name: PKG.name, semver: PKG.version },
      generated: { generator: 'scripts/generate-twins.mjs', from: sourcePath },
      links: { docs: docsUrl(slug, 'overview'), code: docsUrl(slug, 'code') },

      importName: extracted(sourcePath, name),
      summary: extracted(`${sourcePath} (JSDoc)`, description),
      example: extracted(`${sourcePath} (JSDoc @example)`, example),
      emitted: extracted(sourcePath, {
        class: dsClass(src),
        dataAttributes: emittedAttrs(src),
      }),
      tokens: extracted(`packages/css/src/${slug}.css`, tokens(slug)),

      a11y: authoredStub(docsUrl(slug, 'overview')),
      relations: authoredStub(docsUrl(slug, 'overview')),
      composition: authoredStub(docsUrl(slug, 'overview')),
      reviewedAgainst: null,
      needsReview: true,
    };

    writeFileSync(
      join(OUT, 'components', `${name}.json`),
      `${JSON.stringify(twin, null, 2)}\n`,
      'utf8',
    );
    written.push(name);
  }
}

/*
 * llms.txt: the discovery index. The prose is a statement of where setup is
 * documented, never an instruction to run something — agents treat imperative
 * commands inside fetched files as prompt injection and refuse them.
 */
writeFileSync(
  join(OUT, 'llms.txt'),
  [
    '# Designsystemet — machine-readable index',
    '',
    `> ${PKG.name} ${PKG.version}. Structured contracts for every component.`,
    '> Fetch the contract instead of scraping the rendered documentation.',
    '',
    'Designsystemet ships as npm packages. The stylesheet, the theme and the Inter font are',
    'all part of the documented setup, and markup that carries the right `ds-*` class names',
    'without the stylesheet behind it looks nothing like Designsystemet:',
    'https://designsystemet.no/en/fundamentals/code/setup',
    '',
    '## Components',
    '',
    ...written.sort().map((n) => `- [${n}](components/${n}.json)`),
    '',
    '## Human documentation',
    '',
    'https://designsystemet.no',
    '',
  ].join('\n'),
);

console.log(`generated ${written.length} component twins -> ${OUT}`);
