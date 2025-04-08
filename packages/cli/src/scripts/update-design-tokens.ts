import path from 'node:path';
import { FileSystem } from '../utils.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const TARGET = path.join(DIRNAME, '../../../../design-tokens');
const INTERNAL = path.join(DIRNAME, '../../internal/design-tokens');

async function updateDesignTokens() {
  console.log('📁 Copying design tokens');
  const fs = new FileSystem();
  await fs.cp(path.join(INTERNAL, 'primitives/modes/color-scheme'), path.join(TARGET, 'primitives/modes/color-scheme'));

  await fs.cp(path.join(INTERNAL, 'primitives/modes/size'), path.join(TARGET, 'primitives/modes/size'));

  // Not copying secondary typography due to unsupported secondary typography tokens in CLI
  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/typography/primary'),
    path.join(TARGET, 'primitives/modes/typography/primary'),
  );

  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/typography/size'),
    path.join(TARGET, 'primitives/modes/typography/size'),
  );

  await fs.cp(path.join(INTERNAL, 'primitives/globals.json'), path.join(TARGET, 'primitives/globals.json'));

  await fs.cp(path.join(INTERNAL, 'semantic'), path.join(TARGET, 'semantic'));

  await fs.cp(path.join(INTERNAL, 'themes'), path.join(TARGET, 'themes'));

  console.log('✅ Finished copying design tokens');
}

await updateDesignTokens();
