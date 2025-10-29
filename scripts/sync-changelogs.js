// scripts/sync-changelogs.ts
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

function toSlug(pkgName) {
  // e.g. @digdir/designsystemet-foo -> designsystemet-foo
  return pkgName
    .replace(/^@[^/]+\//, '')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase();
}

function getShortName(pkgName) {
  const nameMap = {
    '@digdir/designsystemet-react': 'react',
    '@digdir/designsystemet-css': 'css',
    '@digdir/designsystemet-theme': 'theme',
    '@digdir/designsystemet': 'cli',
  };
  return nameMap[pkgName] || pkgName;
}

async function main() {
  await fs.mkdir(WWW, { recursive: true });
  const pkgs = await findPackages();
  for (const pkg of pkgs) {
    const src = path.join(pkg.dir, 'CHANGELOG.md');
    try {
      const md = await fs.readFile(src, 'utf8');
      const dst = path.join(WWW, `${toSlug(pkg.name)}.mdx`);
      const content = `---
title: "${pkg.name}"
package: "${pkg.name}"
latestVersion: ${pkg.version}
url: ${pkg.name.replace('@digdir/', '')}
sidebarTitle: ${getShortName(pkg.name)}
---
${md.replace(`# Change Log`, '')}
`;
      await fs.writeFile(dst, content, 'utf8');
      console.log(`synced ${pkg.name}`);
    } catch {
      // skip
    }
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
