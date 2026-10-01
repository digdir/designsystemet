// biome-ignore-all lint/suspicious/noExplicitAny: the deprecated fields are no longer in the schema types, so we need to use any here
import path from 'node:path';
import { applyEdits, findNodeAtLocation, modify, parseTree } from 'jsonc-parser';
import pc from 'picocolors';
import { parseJsonc } from '../schemas/helpers.ts';
import { outputConfigShape } from '../schemas/schema-output.ts';

const formattingOptions = { insertSpaces: true, tabSize: 2 } as const;

const deprecatedFields = ['outDir', 'clean'] as const;

type MigrationContext = {
  /** Path of the config file being migrated. */
  configFilePath?: string;
  /** Directory the CLI was run from. Defaults to `process.cwd()`. */
  cwd?: string;
};

type Automigrate = {
  name: string;
  check: (config: string) => boolean;
  message: string;
  yes: (config: string, context?: MigrationContext) => string;
  no: (config: string) => string;
};

/**
 * Removes a top-level property and its comma, leaving surrounding comments and formatting intact.
 * `modify(text, [key], undefined)` removes everything up to the next property, including comments.
 */
const removeProperty = (text: string, key: string): string => {
  const tree = parseTree(text);
  const property = tree && findNodeAtLocation(tree, [key])?.parent;
  if (!property) {
    return text;
  }

  let start = property.offset;
  let end = property.offset + property.length;

  const trailingComma = /^\s*,/.exec(text.slice(end));
  if (trailingComma) {
    end += trailingComma[0].length;
  } else {
    // Last property: remove the comma before it instead.
    const leadingComma = /,\s*$/.exec(text.slice(0, start));
    if (leadingComma) {
      start -= leadingComma[0].length;
    }
  }

  // Remove the whole line when the property is on its own line.
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  if (trailingComma && /^[ \t]*$/.test(text.slice(lineStart, start)) && text[end] === '\n') {
    start = lineStart;
    end += 1;
  }

  return text.slice(0, start) + text.slice(end);
};

const hasDeprecatedFields = (config: string): boolean => {
  const currentConfig = parseJsonc<any>(config);

  return deprecatedFields.some((key) => key in currentConfig);
};

const defaultOutDir = outputConfigShape.outDir.parse(undefined);

/**
 * Builds an `output` equivalent to the deprecated `outDir` and `clean` fields.
 * Returns `undefined` when both have default behaviour, since the default `output` covers it.
 *
 * `cleanDir` defaults to `true`, so an explicit `clean: false` is carried over as `cleanDir: false` on every output.
 * Otherwise the migrated config would delete output directories the user opted out of cleaning.
 * A missing `clean` or `clean: true` uses the new default.
 */
export const toOutput = (outDir: string | undefined, { clean }: { clean?: boolean } = {}) => {
  const isDefaultDir = outDir === undefined || path.posix.normalize(outDir) === path.posix.normalize(defaultOutDir);
  const keepFiles = clean === false;

  if (isDefaultDir && !keepFiles) {
    return undefined;
  }

  const cleanDir = keepFiles ? { cleanDir: false } : {};

  return [
    { type: 'design-tokens' as const, ...(!isDefaultDir && { dir: outDir }), ...cleanDir },
    // CSS is built from the design tokens, so it must read them from the same directory.
    { type: 'css' as const, ...(!isDefaultDir && { tokensDir: outDir }), ...cleanDir },
  ];
};

/**
 * `outDir` was resolved from the directory the CLI was run from, while `output` paths are resolved from the
 * config file's directory. Rewrites `outDir` so it points to the same directory when resolved from the config file.
 * Paths always use forward slashes, so the config works on any OS.
 */
const toConfigRelative = (outDir: string, { configFilePath, cwd = process.cwd() }: MigrationContext): string => {
  if (!configFilePath) {
    return outDir;
  }

  const configDir = path.dirname(path.resolve(cwd, configFilePath));
  const relative = path.relative(configDir, path.resolve(cwd, outDir)) || '.';

  return relative.split(path.sep).join('/');
};

export const migrateToOutputField = (config: string, context: MigrationContext = {}): string => {
  const currentConfig = parseJsonc<any>(config);

  // Apply targeted edits to the original text instead of re-serializing the whole
  // config, so comments, formatting and trailing commas are preserved.
  let configText = config;

  // If `output` is already set, the deprecated fields are ignored and can simply be removed.
  if (!currentConfig.output) {
    // A missing `outDir` meant the default directory, relative to where the CLI was run from.
    const output = toOutput(toConfigRelative(currentConfig.outDir ?? defaultOutDir, context), {
      clean: currentConfig.clean,
    });
    if (output) {
      configText = applyEdits(
        configText,
        modify(configText, ['output'], output, {
          formattingOptions,
          // Place `output` right after `$schema` if present, otherwise at the top.
          getInsertionIndex: (properties) => properties.indexOf('$schema') + 1,
        }),
      );
    }
  }

  for (const key of deprecatedFields) {
    configText = removeProperty(configText, key);
  }

  return configText;
};

const migration: Automigrate = {
  name: 'New output field',
  check: hasDeprecatedFields,
  message: `Your config file uses the deprecated ${pc.yellow('outDir')} and ${pc.yellow('clean')} fields. \nThis migration will replace them with a new ${pc.blue('output')} field if necessary.\n`,
  yes: (config: string, context?: MigrationContext): string => {
    const migratedConfig = migrateToOutputField(config, context);
    console.log(pc.green(`\nConfig file successfully migrated.`));
    if (typeof parseJsonc<any>(migratedConfig).output === 'undefined') {
      console.log(
        pc.green(
          `\nNo new output field was added because the deprecated fields matched outputs default values and does not need to be added explicitly.`,
        ),
      );
    }

    return migratedConfig;
  },
  no: (config: string): string => {
    // The file is left as-is. `designsystemet` stops when `outDir` or `clean` are still set, while `tokens create`
    // keeps reading them.
    console.log(pc.yellow('\nMigration was skipped.\n'));
    return config;
  },
};

export default migration;
