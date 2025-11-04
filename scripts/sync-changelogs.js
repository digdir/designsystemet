import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const WWW = path.join(ROOT, 'apps/www/app/content/changelogs');

async function findPackages() {
  const dirs = ['packages'].map((p) => path.join(ROOT, p));
  const out = [];
  for (const d of dirs) {
    let entries = [];
    try {
      entries = await fs.readdir(d);
    } catch {}
    for (const name of entries) {
      const dir = path.join(d, name);
      try {
        const pkg = JSON.parse(
          await fs.readFile(path.join(dir, 'package.json'), 'utf8'),
        );
        out.push({ name: pkg.name, dir, version: pkg.version });
      } catch {}
    }
  }
  return out;
}

function parseChangelog(content, packageName) {
  // Truncate content at "## 0.101.0" - This is the first entry after version 1
  const cutoffIndex = content.indexOf('## 0.101.0');
  if (cutoffIndex !== -1) {
    content = content.substring(0, cutoffIndex);
  }

  // Remove "# Change Log" header
  const cleaned = content.replace(/^#\s+Change Log\s*\n*/i, '');

  // Split by version headers (## X.Y.Z)
  const versionRegex = /^##\s+(\d+\.\d+\.\d+)/gm;
  const versions = new Map();

  const matches = [];
  let match = versionRegex.exec(cleaned);
  while (match !== null) {
    matches.push({ version: match[1], index: match.index });
    match = versionRegex.exec(cleaned);
  }

  // Extract content for each version
  for (let i = 0; i < matches.length; i++) {
    const { version, index } = matches[i];
    const nextIndex =
      i < matches.length - 1 ? matches[i + 1].index : cleaned.length;
    let content = cleaned
      .substring(index, nextIndex)
      .replace(/^##\s+\d+\.\d+\.\d+\s*\n*/, '')
      .trim();

    // Adjust heading levels: ### (h3) -> #### (h4)
    content = content.replace(/^###\s+/gm, '#### ');

    if (!versions.has(version)) {
      versions.set(version, new Map());
    }
    versions.get(version).set(packageName, content);
  }

  return versions;
}

async function main() {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = await findPackages();

  // Collect all changelogs and parse them
  const allVersions = new Map();

  for (const pkg of pkgs) {
    const src = path.join(pkg.dir, 'CHANGELOG.md');
    try {
      const md = await fs.readFile(src, 'utf8');
      const versions = parseChangelog(md, pkg.name);

      // Merge versions into allVersions
      for (const [version, packages] of versions) {
        if (!allVersions.has(version)) {
          allVersions.set(version, new Map());
        }
        for (const [pkgName, content] of packages) {
          allVersions.get(version).set(pkgName, content);
        }
      }
    } catch {
      // skip
    }
  }

  // Build consolidated changelog
  let consolidatedContent = '';
  for (const version of Array.from(allVersions.keys())) {
    consolidatedContent += `<div style={{
  border: "1px solid var(--ds-color-neutral-border-subtle)",
  borderRadius: "var(--ds-border-radius-md)",
  padding: "var(--ds-size-5)",
  marginBottom: "var(--ds-size-4)"
  }}
>\n\n## ${version}\n\n`;
    const packages = allVersions.get(version);

    for (const [pkgName, content] of packages) {
      if (content) {
        consolidatedContent += `<Divider/>\n\n### ${pkgName}\n\n${content}\n\n`;
      }
    }

    consolidatedContent += `</div>\n\n`;
  }

  // Get latest version
  const latestVersion = pkgs[0]?.version;

  // Write consolidated changelog
  const dst = path.join(WWW, 'changelog.mdx');
  const content = `---
title: "Changelog"
latestVersion: ${latestVersion}
---

${consolidatedContent}`;

  await fs.writeFile(dst, content, 'utf8');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
