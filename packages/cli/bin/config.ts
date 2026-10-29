import type { Command, OptionValues } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import {
  type ConfigSchema,
  type ConfigSchemaThemes,
  configSchema,
  type ExternalConfigSchema,
  externalConfigSchema,
} from '../src/schemas/schema.ts';
import { warnDeprecatedFields } from '../src/schemas/schema-output.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { getCliOption } from './options.ts';

/** Returns the themes of a validated config, or exits with an error if there are none. */
export function requireThemes(config: Pick<ConfigSchema, 'themes'>): ConfigSchemaThemes {
  if (!config.themes) {
    console.error(
      pc.redBright(
        `No themes found in config file. Add ${pc.blue('themes')}, or set ${pc.blue('tokensDir')} on the ${pc.blue('css')} or ${pc.blue('types')} outputs to build them from existing design tokens.`,
      ),
    );
    process.exit(1);
  }

  return config.themes;
}

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
 * Parses and validates the configuration file for `tokens create`.
 * `outDir` and `clean` fall back to the `--out-dir` and `--clean` CLI options when the config file doesn't set them.
 *
 * @param configFile - The content of the config file as a string.
 * @param options - An object containing the CLI command and config file path.
 * @returns The validated configuration schema.
 */
export async function parseValidateAndOptsConfig(
  configFile: string,
  options: { cmd: Command<unknown[], OptionValues>; configFilePath: string },
): Promise<ConfigSchema> {
  const { cmd, configFilePath } = options;

  let configParsed = {} as ConfigSchema;

  try {
    configParsed = parseConfig<ConfigSchema>(configFile);
    warnDeprecatedFields(configParsed);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while parsing config file';
    console.error(pc.redBright(`Failed parsing config  file at ${pc.red(configFilePath)}`));
    console.error(pc.red(errorMessage));
    process.exit(1);
  }

  const unvalidatedConfig = R.reject(R.isNil, {
    outDir: configParsed?.outDir ?? getCliOption(cmd, 'outDir'),
    clean: configParsed?.clean ?? getCliOption(cmd, 'clean'),
    themes: configParsed?.themes,
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
