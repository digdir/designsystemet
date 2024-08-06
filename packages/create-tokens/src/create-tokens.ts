import { program } from '@commander-js/extra-typings';

import { makeInitCommand } from '../../cli/src/init';

program.name('npm create @digdir/tokens');
makeInitCommand(program);

void program.parseAsync(process.argv);
