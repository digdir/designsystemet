// biome-ignore-all lint/suspicious/noExplicitAny: the deprecated fields are no longer in the schema types, so we need to use any here
import path from 'node:path';
import { applyEdits, findNodeAtLocation, modify, parseTree } from 'jsonc-parser';
import pc from 'picocolors';
import { parseJsonc } from '../schemas/helpers.ts';
import { outputConfigShape } from '../schemas/schema-output.ts';

const formattingOptions = { insertSpaces: true, tabSize: 2 } as const;

const deprecatedFields = ['outDir', 'clean'] as const;

type Automigrate = {
  name: string;
  check: (config: string) => boolean;
  message: string;
  yes: (config: string) => string;
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
 * Builds an `output` equivalent to the deprecated `outDir` field.
 * Returns `undefined` when `outDir` has its default value, since the default `output` covers it.
 *
 * `clean` never needs to be carried over: its default is covered by the default `output`,
 * and `clean: true` matches the default `cleanDir`.
 */
const toOutput = (outDir: string | undefined) => {
  if (outDir === undefined || path.posix.normalize(outDir) === path.posix.normalize(defaultOutDir)) {
    return undefined;
  }

  return [
    { type: 'design-tokens', dir: outDir },
    // CSS is built from the design tokens, so it must read them from the same directory.
    { type: 'css', tokenDir: outDir },
  ];
};

export const migrateToOutputField = (config: string): string => {
  const currentConfig = parseJsonc<any>(config);

  // Apply targeted edits to the original text instead of re-serializing the whole
  // config, so comments, formatting and trailing commas are preserved.
  let configText = config;

  // If `output` is already set, the deprecated fields are ignored and can simply be removed.
  if (!currentConfig.output) {
    const output = toOutput(currentConfig.outDir);
    if (output) {
      configText = applyEdits(configText, modify(configText, ['output'], output, { formattingOptions }));
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
  message: `Your config file uses the deprecated ${pc.yellow('outDir')} and ${pc.yellow('clean')} fields. \nThis migration will replace them with an ${pc.yellow('output')} field.\n`,
  yes: (config: string): string => {
    const migratedConfig = migrateToOutputField(config);
    console.log(
      pc.green(
        `\nConfig file successfully migrated, you now only need to run ${pc.blue('designsystemet')} to generate outputs`,
      ),
    );

    return migratedConfig;
  },
  no: (config: string): string => {
    // The deprecated fields still validate, so the config can be used as-is.
    console.log(pc.yellow('\nUsing existing config file but migration was skipped.\n'));
    return config;
  },
};

export default migration;
