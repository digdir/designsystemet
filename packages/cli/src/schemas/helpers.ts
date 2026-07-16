import { type ParseError, parse as parseJsoncRaw, printParseErrorCode } from 'jsonc-parser';
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
/** @deprecated  options support will be removed */
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

            const optionMessage = optionName ? ` or CLI option --${optionName}` : '';
            return `Error in value ${pc.red(issuePath)}${optionMessage}:
      ${issue.message}`;
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
 * @throws Throws an Error with a friendly, user-facing validation message if validation fails.
 */
export function validateConfig<T>(schema: z.ZodType<T>, unvalidatedConfig: Record<string, unknown>): T {
  try {
    return schema.parse(unvalidatedConfig) as T;
  } catch (err) {
    const validationError = makeFriendlyError(err);
    throw new Error(validationError?.toString());
  }
}

/**
 * Parses a JSONC string (JSON with comments and trailing commas).
 *
 * @template T - The expected type of the parsed value.
 * @param content - The JSONC string to parse.
 * @returns The parsed value, typed as T.
 * @throws SyntaxError if the content contains syntax errors.
 */
export function parseJsonc<T>(content: string): T {
  const errors: ParseError[] = [];
  const result = parseJsoncRaw(content, errors, { allowTrailingComma: true }) as T;

  if (errors.length > 0) {
    const message = errors
      .map((error) => {
        const before = content.slice(0, error.offset);
        const line = before.split(/\r?\n/).length;
        const col = before.length - before.lastIndexOf('\n');
        return `${printParseErrorCode(error.error)} at ${line}:${col} (offset ${error.offset})`;
      })
      .join(', ');
    throw new SyntaxError(message);
  }

  return result;
}

export function parseConfig<T>(configFile: string): T {
  if (!configFile) {
    return {} as T;
  }

  try {
    return parseJsonc<T>(configFile);
  } catch (err) {
    const validationError = makeFriendlyError(err);
    throw new Error(validationError?.toString());
  }
}
