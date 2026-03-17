import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, 'apps/www/app/content/schemas/cli');
const CLI_ROOT = path.join(ROOT, 'packages/cli');

// find the current schema file from dist
async function findCurrentSchema() {
  const entries = await fs.readdir(CLI_ROOT + '/dist');

  const schema = entries.find((entry) => entry.endsWith('config.schema.json'));

  return schema;
}

async function getCurrentVersion() {
  const pkgJsonPath = path.join(CLI_ROOT, 'package.json');
  const pkgJsonContent = await fs.readFile(pkgJsonPath, 'utf8');
  const pkg = JSON.parse(pkgJsonContent);
  return pkg.version;
}

async function main() {
  await fs.mkdir(SCHEMAS_DIR, { recursive: true });
  const schemaFile = await findCurrentSchema();
  if (!schemaFile) {
    console.error('No schema file found in dist directory');
    process.exit(1);
  }
  const src = path.join(CLI_ROOT, 'dist', schemaFile);
  const dst = path.join(SCHEMAS_DIR, `${await getCurrentVersion()}.json`);
  await fs.copyFile(src, dst);
  console.log(`Copied schema file to ${dst}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
