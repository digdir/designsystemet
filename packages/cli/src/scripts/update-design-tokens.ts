import fs from 'node:fs/promises';
import path from 'node:path';

const DIRNAME: string = import.meta.dirname || __dirname;

const TARGET = path.join(DIRNAME, '../../../../design-tokens');
const INTERNAL = path.join(DIRNAME, '../../internal/design-tokens');

const options = { recursive: true };

async function copyFiles() {
  console.log('📁 Copying design tokens');
  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/color-scheme'),
    path.join(TARGET, 'primitives/modes/color-scheme'),
    options,
  );

  await fs.cp(path.join(INTERNAL, 'primitives/modes/size'), path.join(TARGET, 'primitives/modes/size'), options);

  // Not copying secondary typography due to unsupported secondary typography tokens in CLI
  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/typography/primary'),
    path.join(TARGET, 'primitives/modes/typography/primary'),
    options,
  );

  await fs.cp(
    path.join(INTERNAL, 'primitives/modes/typography/size'),
    path.join(TARGET, 'primitives/modes/typography/size'),
    options,
  );

  await fs.cp(path.join(INTERNAL, 'primitives/globals.json'), path.join(TARGET, 'primitives/globals.json'), options);

  await fs.cp(path.join(INTERNAL, 'semantic'), path.join(TARGET, 'semantic'), options);

  await fs.cp(path.join(INTERNAL, 'themes'), path.join(TARGET, 'themes'), options);

  console.log('✅ Finished copying design tokens');
}

copyFiles();
