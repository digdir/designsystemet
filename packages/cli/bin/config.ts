import path from 'node:path';
import type { Command, OptionValues } from '@commander-js/extra-typings';
import chalk from 'chalk';
import * as R from 'ramda';
import {
  type ConfigSchemaBuild,
  type ConfigSchemaCreate,
  configFileBuildSchema,
  configFileCreateSchema,
  parseConfig,
  validateConfig,
} from '../src/schema.js';
import { readFile } from '../src/utils.js';
import { type OptionGetter, getCliOption, getDefaultCliOption, getSuppliedCliOption } from './options.js';

export async function readConfigFile(configPath: string, allowFileNotFound = true): Promise<string> {
  const resolvedPath = path.resolve(process.cwd(), configPath);
  let configFile: string;

  try {
    configFile = await readFile(resolvedPath, false, allowFileNotFound);
  } catch (err) {
    if (allowFileNotFound) {
      return '';
    }
    console.error(chalk.redBright(`Could not read config file at ${chalk.blue(resolvedPath)}`));
    throw err;
  }

  if (configFile) {
    console.log(`Found config file: ${chalk.green(resolvedPath)}`);
  }

  return configFile;
}

export async function parseCreateConfig(
  configFile: string,
  options: { theme: string; cmd: Command<unknown[], OptionValues>; configPath: string },
): Promise<ConfigSchemaCreate> {
  const { cmd, theme = 'theme', configPath } = options;

  const configParsed: ConfigSchemaCreate = parseConfig<ConfigSchemaCreate>(
    configFileCreateSchema,
    configFile,
    configPath,
  );

  /*
   * Check that we're not creating multiple themes with different color names.
   * For the themes' modes to work in Figma and when building css, the color names must be consistent
   */
  const themeColors = Object.values(configParsed?.themes ?? {}).map(
    (x) => new Set([...R.keys(x.colors.main), ...R.keys(x.colors.support)]),
  );
  if (!R.all(R.equals(R.__, themeColors[0]), themeColors)) {
    console.error(chalk.redBright(`In config, all themes must have the same custom color names, but we found:`));
    const themeNames = R.keys(configParsed.themes ?? {});
    themeColors.forEach((colors, index) => {
      const colorNames = Array.from(colors);
      console.log(`  - ${themeNames[index]}: ${colorNames.join(', ')}`);
    });
    console.log();
    process.exit(1);
  }

  /*
   * Create final config from JSON config file and command-line options
   */
  const noUndefined = R.reject(R.isNil);

  const getThemeOptions = (optionGetter: OptionGetter) =>
    noUndefined({
      colors: noUndefined({
        main: optionGetter(cmd, 'mainColors'),
        support: optionGetter(cmd, 'supportColors'),
        neutral: optionGetter(cmd, 'neutralColor'),
      }),
      typography: noUndefined({
        fontFamily: optionGetter(cmd, 'fontFamily'),
      }),
      borderRadius: optionGetter(cmd, 'borderRadius'),
      defaultColor: optionGetter(cmd, 'defaultColor'),
    });

  const unvalidatedConfig = noUndefined({
    outDir: configParsed?.outDir ?? getCliOption(cmd, 'outDir'),
    clean: configParsed?.clean ?? getCliOption(cmd, 'clean'),
    themes: configParsed?.themes
      ? R.map((jsonThemeValues) => {
          // For each theme specified in the JSON config, we resolve the option values in the following order:
          // - default value
          // - config value
          // - CLI value
          // With later values overriding earlier values
          const defaultThemeValues = getThemeOptions(getDefaultCliOption);
          const cliThemeValues = getThemeOptions(getSuppliedCliOption);
          const mergedConfigs = R.mergeDeepRight(defaultThemeValues, R.mergeDeepRight(jsonThemeValues, cliThemeValues));
          return mergedConfigs;
        }, configParsed.themes)
      : // If there are no themes specified in the JSON config, we use both explicit
        // and default theme options from the CLI.
        {
          [theme]: getThemeOptions(getCliOption),
        },
  });

  return validateConfig<ConfigSchemaCreate>(configFileCreateSchema, unvalidatedConfig, configPath);
}

export async function parseBuildConfig(
  configFile: string,
  { configPath }: { configPath: string },
): Promise<ConfigSchemaBuild> {
  const configParsed: ConfigSchemaBuild = parseConfig<ConfigSchemaBuild>(configFileBuildSchema, configFile, configPath);

  return validateConfig<ConfigSchemaBuild>(configFileBuildSchema, configParsed, configPath);
}
