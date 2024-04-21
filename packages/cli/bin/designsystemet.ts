#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import migrations from './../src/codemods/migrations.js';
import { run } from './../src/tokens/build.js';

const pickBrands = (x: string | number): x is string => typeof x === 'string';

void yargs(hideBin(process.argv))
  .command(
    'tokens',
    'run Designsystemet token builder',
    (yargs) =>
      yargs.options({
        brands: {
          type: 'array',
          default: [],
          describe: 'Brand files to build',
          alias: 'b',
        },
        tokens: {
          type: 'string',
          describe: 'Location for design-tokens',
          demandOption: true,
          alias: 't',
        },
        preview: {
          alias: 'p',
          type: 'boolean',
          describe: 'Generate typescript token preview files',
        },
      }),
    (argv) => {
      // Typescript 🤯
      const brands = argv.brands.filter(pickBrands).filter(pickBrands);
      return run({ brands, tokens: argv.tokens });
    },
  )
  .command(
    'migrate <migration>',
    'run Designsystemet migrations',
    (yargs) =>
      yargs.positional('migration', {
        type: 'string',
        demandOption: true,
        choices: Object.keys(migrations),
      }),
    (argv) => {
      const migrationKey = argv.migration as keyof typeof migrations;
      const migration = migrations[migrationKey];
      if (!migration) {
        console.error('Migration not found!');
        throw 'Aborting';
      }
      migration?.();
    },
  )
  .demandCommand(1)
  .showHelpOnFail(true)
  .parse();
