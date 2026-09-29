// biome-ignore-all lint/suspicious/noExplicitAny: the deprecated fields are no longer in the schema types, so we need to use any here
import path from 'node:path';
import { applyEdits, createScanner, findNodeAtLocation, modify, parseTree } from 'jsonc-parser';
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
 * The scanner's token kind for a comma. `SyntaxKind` is a `const enum`, which can't be imported with `isolatedModules`,
 * so it's read from the scanner instead.
 */
const COMMA_TOKEN = createScanner(',').scan();

/** Returns the offset of the next token from `offset` that isn't whitespace or a comment, and that token. */
const nextToken = (text: string, offset: number) => {
  const scanner = createScanner(text, true);
  scanner.setPosition(offset);
  const token = scanner.scan();

  return { token, offset: scanner.getTokenOffset() };
};

/**
 * Removes a top-level property and its comma, leaving surrounding comments and formatting intact.
 * `modify(text, [key], undefined)` removes everything up to the next property, including comments.
 *
 * Comments between the value and its comma are kept, so the comma is found with the JSONC scanner
 * rather than by looking for whitespace only.
 */
const removeProperty = (text: string, key: string): string => {
  const tree = parseTree(text);
  const property = tree && findNodeAtLocation(tree, [key])?.parent;
  if (!property || !tree.children) {
    return text;
  }

  const propertyStart = property.offset;
  const propertyEnd = property.offset + property.length;

  // Ranges to remove: the property itself, and one comma next to it.
  const removals: [number, number][] = [[propertyStart, propertyEnd]];

  const after = nextToken(text, propertyEnd);
  const hasTrailingComma = after.token === COMMA_TOKEN;
  if (hasTrailingComma) {
    removals.push([after.offset, after.offset + 1]);
  } else {
    // Last property: remove the comma after the previous property instead.
    const index = tree.children.indexOf(property);
    const previous = tree.children[index - 1];
    if (previous) {
      const comma = nextToken(text, previous.offset + previous.length);
      if (comma.token === COMMA_TOKEN) {
        removals.push([comma.offset, comma.offset + 1]);
      }
    }
  }

  let result = text;
  for (const [start, end] of removals.sort(([a], [b]) => b - a)) {
    result = result.slice(0, start) + result.slice(end);
  }

  // Remove the line the property was on when nothing but whitespace is left on it.
  const lineStart = result.lastIndexOf('\n', propertyStart - 1) + 1;
  const lineEnd = result.indexOf('\n', propertyStart);
  if (lineEnd !== -1 && lineStart > 0 && /^[ \t]*$/.test(result.slice(lineStart, lineEnd))) {
    result = result.slice(0, lineStart) + result.slice(lineEnd + 1);
  }

  return result;
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
    // CSS and types are built from the design tokens, so they must read them from the same directory.
    { type: 'css' as const, ...(!isDefaultDir && { tokensDir: outDir }), ...cleanDir },
    // `types` outputs are never cleaned, so they have no `cleanDir`.
    { type: 'types' as const, ...(!isDefaultDir && { tokensDir: outDir }) },
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
