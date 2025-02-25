import fs from 'node:fs/promises';
import path from 'node:path';

const DIRNAME: string = import.meta.dirname || __dirname;

const TARGET = path.join(DIRNAME, '../../../../design-tokens');
const INTERNAL = path.join(DIRNAME, '../../internal/design-tokens');

async function copyFiles() {
  // Not copying typography due to unsupported secondary typography tokens in CLI

  console.log('📁 Copying design tokens');
  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/color-scheme'),
    path.join(TARGET, 'primitives/modes/color-scheme'),
    { recursive: true },
  );

  await fs.cp(path.join(INTERNAL, 'primitives/modes/size'), path.join(TARGET, 'primitives/modes/size'), {
    recursive: true,
  });

  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/typography/size'),
    path.join(TARGET, 'primitives/modes/typography/size'),
    {
      recursive: true,
    },
  );

  await fs.cp(path.join(INTERNAL, 'primitives/globals.json'), path.join(TARGET, 'primitives/globals.json'));

  await fs.cp(path.join(INTERNAL, 'semantic'), path.join(TARGET, 'semantic'), { recursive: true });

  await fs.cp(path.join(INTERNAL, 'themes'), path.join(TARGET, 'themes'), { recursive: true });

  console.log('✅ Finished copying design tokens');
}

copyFiles();
