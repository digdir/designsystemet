/**
 * Merge the authored layer into the generated twins.
 *
 * The authored layer (scripts/twins-authored.json) carries the rules that exist
 * only as prose on designsystemet.no: accessibility requirements, relations
 * ("use Radio instead"), and composition rules. Each rule cites a verbatim
 * quote from the documentation, and carries the result of its last
 * verification. `reviewedAgainst` records the package version a human
 * sign-off was made against.
 *
 * Default run is offline and deterministic (safe for site builds): it merges
 * the rules and their stored verification state into the twins produced by
 * generate-twins.mjs.
 *
 * `--verify` is the maintenance mode: it fetches every cited docs page,
 * rechecks that each quote still appears there, and writes the result back
 * into the data file. A quote that no longer verifies drops the component's
 * reviewed status and lands on the review sheet (registry/REVIEW.md), so a
 * documentation change surfaces on the next verify run instead of going
 * silently stale.
 *
 *   node scripts/merge-authored-twins.mjs [--out <registry-dir>] [--verify]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (flag, fallback) =>
  process.argv.includes(flag)
    ? process.argv[process.argv.indexOf(flag) + 1]
    : fallback;
const REGISTRY = join(ROOT, arg('--out', 'registry'), 'components');
const VERIFY = process.argv.includes('--verify');

const DATA_PATH = join(ROOT, 'scripts/twins-authored.json');
const AUTHORED = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

const SUBPAGES = ['overview', 'code', 'accessibility'];
const docsUrl = (slug, page) =>
  `https://designsystemet.no/en/components/docs/${slug}/${page}`;

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '-',
  mdash: '-',
};

/**
 * The page text and the quotes go through the same normalisation, or a quote
 * containing any transformed character could never match: typographic quotes
 * become ASCII, markdown/formatting characters are stripped, whitespace
 * collapses, and the space that tag-stripping strands before punctuation is
 * removed.
 */
function normalise(s) {
  return (s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[`*[\]"]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
    .toLowerCase();
}

async function pageText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const html = (await res.text())
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&([a-z]+);/g, (m, e) => ENTITIES[e] ?? m);
    return normalise(html);
  } catch {
    return '';
  }
}

const reviewRows = [];
let merged = 0;
let reviewed = 0;

for (const [slug, entry] of Object.entries(AUTHORED)) {
  const { name, reviewedAgainst, ...fields } = entry;
  const twinPath = join(REGISTRY, `${name}.json`);
  if (!existsSync(twinPath)) {
    console.warn(
      `  skip ${name}: no generated twin (run generate-twins.mjs first)`,
    );
    continue;
  }

  if (VERIFY) {
    const pages = {};
    for (const sub of SUBPAGES) pages[sub] = await pageText(docsUrl(slug, sub));
    for (const key of ['a11y', 'relations', 'composition']) {
      for (const rule of fields[key] ?? []) {
        const quotes = [rule.quote, rule.quote2].filter(Boolean).map(normalise);
        const found = SUBPAGES.find((sub) =>
          quotes.every((q) => pages[sub].includes(q)),
        );
        rule.verified = found !== undefined;
        rule.sourcePage = found ? docsUrl(slug, found) : null;
      }
    }
  }

  const rules = ['a11y', 'relations', 'composition'].flatMap((k) =>
    (fields[k] ?? []).map((r) => [k, r]),
  );
  const allVerified = rules.every(([, r]) => r.verified === true);
  for (const [key, rule] of rules) {
    if (!rule.verified) {
      reviewRows.push([
        name,
        key,
        rule.rule ?? `${rule.component}: ${rule.note ?? ''}`,
        rule.quote ?? '',
      ]);
    }
  }

  const twin = JSON.parse(readFileSync(twinPath, 'utf8'));
  const method =
    allVerified && reviewedAgainst
      ? `quote-verified against the cited page; human-reviewed against ${reviewedAgainst}`
      : 'quote-verified where marked; NOT yet human-reviewed';
  for (const key of ['a11y', 'relations', 'composition']) {
    if (!fields[key]) continue;
    twin[key] = {
      provenance: 'authored',
      source: docsUrl(slug, 'overview'),
      method,
      value: fields[key],
    };
  }
  twin.reviewedAgainst = allVerified ? (reviewedAgainst ?? null) : null;
  twin.needsReview = !(allVerified && reviewedAgainst);
  if (!twin.needsReview) reviewed += 1;
  writeFileSync(twinPath, `${JSON.stringify(twin, null, 2)}\n`, 'utf8');
  merged += 1;
}

if (VERIFY) {
  writeFileSync(DATA_PATH, `${JSON.stringify(AUTHORED, null, 2)}\n`, 'utf8');
  const sheet = [
    '# Authored-layer review sheet',
    '',
    'Rules whose quote no longer verifies against the cited documentation page.',
    'For each row, the question is: does the current documentation still support the rule?',
    '',
    ...(reviewRows.length
      ? [
          '| Component | Field | Rule | Quote |',
          '|---|---|---|---|',
          ...reviewRows.map(
            (r) =>
              `| ${r.map((c) => String(c).replace(/\|/g, '\\|').slice(0, 160)).join(' | ')} |`,
          ),
        ]
      : [
          'Nothing pending: every quote verifies and every component is human-reviewed.',
        ]),
    '',
  ];
  writeFileSync(join(ROOT, 'registry/REVIEW.md'), sheet.join('\n'));
}

console.log(
  `merged ${merged} components: ${reviewed} reviewed, ${reviewRows.length} rules pending review` +
    (VERIFY ? ' (verification state written back to twins-authored.json)' : ''),
);
