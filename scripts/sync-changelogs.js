/**
 * Builds the consolidated changelog for www from the CHANGELOG.md of every
 * package. Aggregation lives in scripts/aggregate-changelogs.js; this file
 * only formats the result as MDX and writes it.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { aggregateChangelogs, findPackages } from './aggregate-changelogs.js';

const ROOT = process.cwd();
const WWW = path.join(ROOT, 'apps/www/app/content/components-docs');

// Stop at "## 0.101.0" - this is the first entry before version 1
const CUTOFF_VERSION = '0.101.0';

function formatVersion(version, packages) {
  let out = `<div style={{
  border: "1px solid var(--ds-color-neutral-border-subtle)",
  borderRadius: "var(--ds-border-radius-md)",
  padding: "var(--ds-size-5)",
  marginBottom: "var(--ds-size-4)"
  }}
>\n\n## ${version}\n\n`;

  for (const [pkgName, body] of packages) {
    if (!body) continue;
    // Adjust heading levels: ### (h3) -> #### (h4)
    const content = body.replace(/^###\s+/gm, '#### ');
    out += `<Divider/>\n\n### ${pkgName}\n\n${content}\n\n`;
  }

  return `${out}</div>\n\n`;
}

async function main() {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = [...(await findPackages()).values()];
  const allVersions = await aggregateChangelogs(pkgs, {
    until: CUTOFF_VERSION,
  });

  let consolidatedContent = '';
  for (const [version, packages] of allVersions) {
    consolidatedContent += formatVersion(version, packages);
  }

  const latestVersion = pkgs[0]?.version;

  const content = `---
title: "Changelog"
latestVersion: ${latestVersion}
---

${consolidatedContent}`;

  await fs.writeFile(path.join(WWW, 'changelog.mdx'), content, 'utf8');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
