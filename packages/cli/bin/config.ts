import type { Command, OptionValues } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import { type CreateConfigSchema, configFileCreateSchema } from '../src/schemas/v1.1/schema.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { getCliOption, getDefaultCliOption, getSuppliedCliOption, type OptionGetter } from './options.ts';

export { deprecatedCLIOptions } from '../src/schemas/helpers.ts';

export async function readConfigFile(configFilePath: string, allowFileNotFound = true): Promise<string> {
  let configFile: string;

  try {
    configFile = await dsfs.readFile(configFilePath, allowFileNotFound);
  } catch (err) {
    if (allowFileNotFound) {
      return '';
    }
    console.error(pc.redBright(`Could not read config file at ${pc.blue(configFilePath)}`));
    throw err;
  }

  if (configFile) {
    console.log(`Found config file: ${pc.green(configFilePath)}`);
  }

  return configFile;
}

/**
 * Parses and validates the create config file.
 * Merges the config file with CLI options, with CLI options taking precedence.
 *
 * @template T - The expected type of the parsed and validated config.
 * @param configFile - The content of the config file as a string.
 * @param options - An object containing the CLI command, theme name, and config file path.
 * @returns The validated create config schema.
 */
export async function parseCreateConfig(
  configFile: string,
  options: { theme: string; cmd: Command<unknown[], OptionValues>; configFilePath: string },
): Promise<CreateConfigSchema> {
  const { cmd, theme = 'theme', configFilePath } = options;

  let configParsed = {} as CreateConfigSchema;

  try {
    configParsed = parseConfig<CreateConfigSchema>(configFile);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while parsing config file';
    console.error(pc.redBright(`Failed parsing config  file at ${pc.red(configFilePath)}`));
    console.error(pc.red(errorMessage));
    process.exit(1);
  }

  /*
   * Create final config from JSON config file and command-line options
   */
  const noUndefined = R.reject(R.isNil);

  const getThemeOptions = (optionGetter: OptionGetter) =>
    noUndefined({
      colors: noUndefined({
        ...(optionGetter(cmd, 'mainColors') as Record<string, string>),
        ...(optionGetter(cmd, 'supportColors') as Record<string, string>),
        neutral: optionGetter(cmd, 'neutralColor') as string,
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

  let validatedConfig = {} as CreateConfigSchema;
  try {
    validatedConfig = validateConfig<CreateConfigSchema>(configFileCreateSchema, unvalidatedConfig);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while parsing config file';

    console.error(pc.redBright(`Invalid config  ${pc.red(configFilePath ? 'file at ' + configFilePath : 'string')}`));
    console.error(pc.red(errorMessage));
    process.exit(1);
  }

  return validatedConfig;
}
