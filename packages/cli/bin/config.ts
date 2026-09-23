import type { Command, OptionValues } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import {
  type ConfigSchema,
  configSchema,
  type ExternalConfigSchema,
  externalConfigSchema,
} from '../src/schemas/schema.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { getCliOption, getDefaultCliOption, getSuppliedCliOption, type OptionGetter } from './options.ts';

export { deprecatedCLIOptions } from '../src/schemas/helpers.ts';

// Default config files to auto-detect when no --config is supplied, in order of precedence.
export const DEFAULT_CONFIG_FILEPATHS = ['designsystemet.config.json', 'designsystemet.config.jsonc'];
export const DEFAULT_CONFIG_FILEPATH = DEFAULT_CONFIG_FILEPATHS[0];

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
 * Parses and validates the configuration file.
 * Merges the config file with CLI options, with CLI options taking precedence.
 *
 * @template T - The expected type of the parsed and validated config.
 * @param configFile - The content of the config file as a string.
 * @param options - An object containing the CLI command, theme name, and config file path.
 * @returns The validated configuration schema.
 */
export async function parseValidateAndOptsConfig(
  configFile: string,
  options: { theme: string; cmd: Command<unknown[], OptionValues>; configFilePath: string },
): Promise<ConfigSchema> {
  const { cmd, theme = 'theme', configFilePath } = options;

  let configParsed = {} as ConfigSchema;

  try {
    configParsed = parseConfig<ConfigSchema>(configFile);
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

  // Only apply the deprecated --font-family option when explicitly supplied: typography may also be
  // defined as named sets, and merging the CLI default into that form would produce an invalid config.
  const suppliedFontFamily = getSuppliedCliOption(cmd, 'fontFamily') as string | undefined;

  const getThemeOptions = (optionGetter: OptionGetter) =>
    noUndefined({
      colors: noUndefined({
        ...(optionGetter(cmd, 'mainColors') as Record<string, string>),
        ...(optionGetter(cmd, 'supportColors') as Record<string, string>),
        neutral: optionGetter(cmd, 'neutralColor') as string,
      }),
      typography: suppliedFontFamily ? { fontFamily: suppliedFontFamily } : undefined,
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

  let validatedConfig = {} as ConfigSchema;
  try {
    const externalConfig = validateConfig<ExternalConfigSchema>(externalConfigSchema, unvalidatedConfig);
    validatedConfig = validateConfig<ConfigSchema>(configSchema, externalConfig);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while parsing config file';

    console.error(pc.redBright(`Invalid config  ${pc.red(configFilePath ? 'file at ' + configFilePath : 'string')}`));
    console.error(pc.red(errorMessage));
    process.exit(1);
  }

  return validatedConfig;
}

export async function getConfigFile(userConfigFilePath: string | undefined) {
  if (!R.isNil(userConfigFilePath)) {
    // A config path was supplied explicitly. It's allowed to not exist only if it's one of the defaults.
    const allowFileNotFound = DEFAULT_CONFIG_FILEPATHS.includes(userConfigFilePath);
    const configFile = await readConfigFile(userConfigFilePath, allowFileNotFound);

    return { configFile, configFilePath: userConfigFilePath };
  }

  // No config path supplied: auto-detect the default config files (.json, then .jsonc).
  for (const configFilePath of DEFAULT_CONFIG_FILEPATHS) {
    const configFile = await readConfigFile(configFilePath, true);
    if (configFile) {
      return { configFile, configFilePath };
    }
  }

  // None found - return empty config using the canonical default path for messaging.
  return { configFile: '', configFilePath: DEFAULT_CONFIG_FILEPATH };
}
