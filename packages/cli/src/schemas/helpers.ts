import pc from 'picocolors';
import * as R from 'ramda';
import type { z } from 'zod';
import { fromError } from 'zod-validation-error';

export const deprecatedCLIOptions = {
  outDir: 'out-dir',
  clean: 'clean',
  tailwind: 'tailwind',
  theme: {
    colors: {
      main: 'main-colors',
      support: 'support-colors',
      neutral: 'neutral-color',
    },
    typography: {
      fontFamily: 'font-family',
    },
    borderRadius: 'border-radius',
  },
} as const;

function mapPathToOptionName(path: PropertyKey[]) {
  // replace "themes.some-theme-name" with "theme" to match cliOptions object
  const normalisedPath = path[0] === 'themes' ? ['theme', ...R.drop(2, path)] : path;
  const option = R.path(normalisedPath as Array<string | number>, deprecatedCLIOptions);
  if (typeof option !== 'string') {
    return;
  }
  return option;
}

function makeFriendlyError(err: unknown) {
  try {
    return fromError(err, {
      messageBuilder: (issues) =>
        issues
          .map((issue) => {
            const issuePath = issue.path.join('.');
            const optionName = mapPathToOptionName(issue.path);

            const errorCode = `(error code: ${issue.code})`;
            const optionMessage = optionName ? ` or CLI option --${optionName}` : '';
            return `  - Error in JSON value ${pc.red(issuePath)}${optionMessage}:
      ${issue.message} ${pc.dim(errorCode)}`;
          })
          .join('\n'),
    });
  } catch (_err2) {
    console.error(pc.red(err instanceof Error ? err.message : 'Unknown error occurred while parsing config file'));
    console.error(err instanceof Error ? err.stack : 'No stack trace available');
  }
}

/**
 * Validates a configuration object against a provided Zod schema.
 *
 * @template T - The expected type of the validated configuration.
 * @param schema - A Zod schema used to validate the configuration object.
 * @param unvalidatedConfig - The configuration object to validate.
 * @returns The validated configuration object, typed as T.
 * @throws Exits the process with code 1 if validation fails, after logging a friendly error message.
 */
export function validateConfig<T>(
  schema: z.ZodType<T>,
  unvalidatedConfig: Record<string, unknown>,
  configFilePath: string,
): T {
  try {
    return schema.parse(unvalidatedConfig) as T;
  } catch (err) {
    console.error(pc.redBright(`Invalid config file at ${pc.red(configFilePath)}`));

    const validationError = makeFriendlyError(err);
    console.error(validationError?.toString());
    process.exit(1);
  }
}

export function parseConfig<T>(configFile: string, configFilePath: string): T {
  if (!configFile) {
    return {} as T;
  }

  try {
    return JSON.parse(configFile) as T;
  } catch (err) {
    console.error(pc.redBright(`Failed parsing config file at ${pc.red(configFilePath)}`));

    const validationError = makeFriendlyError(err);
    console.error(validationError?.toString());

    process.exit(1);
  }
}
