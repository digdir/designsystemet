import path from 'node:path';
import { cp } from '../utils.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const TARGET = path.join(DIRNAME, '../../../../design-tokens');
const INTERNAL = path.join(DIRNAME, '../../temp/digdir/design-tokens');

async function updateDesignTokens() {
  console.log('\n📁 Copying design tokens');
  await cp(path.join(INTERNAL, 'primitives/modes/color-scheme'), path.join(TARGET, 'primitives/modes/color-scheme'));

  await cp(path.join(INTERNAL, 'primitives/modes/size'), path.join(TARGET, 'primitives/modes/size'));

  // Not copying secondary typography due to unsupported secondary typography tokens in CLI
  await cp(
    path.join(INTERNAL, 'primitives/modes/typography/primary'),
    path.join(TARGET, 'primitives/modes/typography/primary'),
  );

  await cp(
    path.join(INTERNAL, 'primitives/modes/typography/size'),
    path.join(TARGET, 'primitives/modes/typography/size'),
  );

  await cp(path.join(INTERNAL, 'primitives/globals.json'), path.join(TARGET, 'primitives/globals.json'));

  await cp(path.join(INTERNAL, 'semantic'), path.join(TARGET, 'semantic'));

  await cp(path.join(INTERNAL, 'themes'), path.join(TARGET, 'themes'));
  await cp(path.join(INTERNAL, '$designsystemet.json'), path.join(TARGET, '$designsystemet.json'));

  console.log('✅ Finished copying design tokens');
}

await updateDesignTokens();
