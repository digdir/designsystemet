/**
 * Builds the body for an aggregated GitHub release from the CHANGELOG.md of
 * every package that was just published, mirroring the output of the old
 * `createGithubReleases: aggregate` mode from dotansimha/changesets-action.
 *
 * Usage:
 *   node scripts/aggregate-release-notes.mjs '<published-packages JSON>' > notes.md
 *
 * `published-packages` is the output of changesets/action:
 *   [{ "name": "@digdir/designsystemet-react", "version": "1.20.1" }, ...]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PACKAGE_DIRS = ['packages'];

async function findPackageDirs() {
  const byName = new Map();
  for (const base of PACKAGE_DIRS) {
    let entries = [];
    try {
      entries = await fs.readdir(path.join(ROOT, base));
    } catch {}
    for (const entry of entries) {
      const dir = path.join(ROOT, base, entry);
      try {
        const pkg = JSON.parse(
          await fs.readFile(path.join(dir, 'package.json'), 'utf8'),
        );
        if (pkg.name) byName.set(pkg.name, dir);
      } catch {}
    }
  }
  return byName;
}

/** Returns the markdown under the `## <version>` heading, without the heading itself. */
function extractVersionSection(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((line) => line.trim() === `## ${version}`);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
}

async function main() {
  const raw = process.argv[2] ?? '';
  let published = [];
  try {
    published = JSON.parse(raw || '[]');
  } catch {
    console.error('Could not parse published packages JSON:', raw);
    process.exit(1);
  }
  if (!Array.isArray(published) || published.length === 0) {
    console.error('No published packages given.');
    process.exit(1);
  }

  const dirs = await findPackageDirs();
  const sections = [];

  for (const { name, version } of [...published].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const dir = dirs.get(name);
    let body = null;
    if (dir) {
      try {
        body = extractVersionSection(
          await fs.readFile(path.join(dir, 'CHANGELOG.md'), 'utf8'),
          version,
        );
      } catch {}
    }
    if (body === null) {
      console.error(`Warning: no changelog entry found for ${name}@${version}`);
      body = '_No changelog entry found._';
    }
    sections.push(`## ${name}@${version}\n\n${body}`);
  }

  process.stdout.write(`${sections.join('\n\n')}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
