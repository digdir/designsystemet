import type { TokenSets } from '@digdir/designsystemet/internal';
import {
  type ConfigSchema,
  configSchema,
  createSystemTokens,
  createTokens,
  externalConfigSchema,
  getTokenSetDimensions,
  parseConfig,
  validateConfig,
} from '@digdir/designsystemet/internal';
import { postMessage } from '../common';
import type { FigmaMessages } from '../types';
import { createSyncLog } from './token-sync/log';
import { SYNC_STEPS, syncToFigma } from './token-sync/sync-to-figma';
import { buildTokenModel } from './token-sync/token-model';
import type { TokenModel } from './token-sync/types';

/** Steps reported to the UI: validating, creating tokens, preparing the sync, then the Figma sync's own steps. */
const TOTAL_STEPS = 3 + SYNC_STEPS;

/**
 * Validates the pasted config and creates the token model to sync. `onStep` is called before each of its 3 steps;
 * `onDetail` updates the current step's label, e.g. with the theme being created.
 */
async function createTokenModel(
  configText: string,
  onStep: (label: string) => void,
  onDetail: (label: string) => void,
): Promise<TokenModel> {
  onStep('Validating config');
  const parsedConfig = parseConfig<ConfigSchema>(configText);

  // Validate the config against the public/external schema first, so configs using non-exposed
  // fields are rejected with a user-facing error. The normalized result (shorthands expanded,
  // public defaults applied) is then passed on to the full schema, which fills in the internal defaults.
  const externalConfig = validateConfig(externalConfigSchema, parsedConfig);

  // Populate internal defaults from the sanitized public configuration.
  const config = validateConfig<ConfigSchema>(configSchema, externalConfig);

  // `themes` is optional in the config, but the plugin creates everything from themes.
  if (!config.themes || Object.keys(config.themes).length === 0) {
    throw new Error('The config must define at least one theme.');
  }

  const themes = Object.entries(config.themes);
  const themeNames = themes.map(([name]) => name);

  // The dimensions come from the first theme, mirroring the CLI: size modes and
  // typography sets are expected to be the same across themes.
  const tokenSetDimensions = getTokenSetDimensions(themes[0][1]);

  // Token sets from every theme, keyed by token set path. Shared sets (e.g.
  // semantic/color) are identical across themes, so overwriting them is safe;
  // theme-specific sets have unique paths (themes/some-org, etc.).
  const tokenSets: TokenSets = new Map();

  // Color names are derived from the generated `semantic/color/<name>` token sets so
  // the auto-generated severity colors (danger, info, success, warning) are included
  // alongside the user-defined colors and neutral.
  const semanticColorNames = new Set<string>();

  onStep('Creating tokens');
  for (const [index, [themeName, themeConfig]] of themes.entries()) {
    onDetail(
      `Creating tokens for ${themeName} (${index + 1} of ${themes.length})`,
    );
    const themeTokens = await createTokens(
      { name: themeName, ...themeConfig },
      tokenSetDimensions,
    );

    for (const [tokenSetPath, tokenSet] of themeTokens.tokenSets) {
      tokenSets.set(tokenSetPath, tokenSet);

      const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
      if (colorMatch) {
        semanticColorNames.add(colorMatch[1]);
      }
    }
  }

  onStep('Preparing variables');
  const { $themes } = await createSystemTokens({
    tokenSetDimensions,
    colorNames: Array.from(semanticColorNames),
    themeNames,
  });

  return buildTokenModel({
    // Sorted by path so the model is stable regardless of theme order.
    tokenSets: new Map(
      Array.from(tokenSets).sort(([a], [b]) => a.localeCompare(b)),
    ),
    $themes,
  });
}

if (figma.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 900,
    height: 800,
    title: 'Designsystemet',
    themeColors: true,
  });
}

figma.ui.onmessage = async (msg: FigmaMessages) => {
  if (msg.type === 'open-external') {
    // Only open web pages, so the UI can't be used to open other kinds of URLs.
    if (msg.url.startsWith('https://')) {
      figma.openExternal(msg.url);
    }
    return;
  }

  if (msg.type !== 'sync-config-to-figma') {
    return;
  }

  let step = 0;
  let label = '';
  const reportProgress = () =>
    postMessage('sync-progress', { step, total: TOTAL_STEPS, label });
  const onStep = (stepLabel: string) => {
    step += 1;
    label = stepLabel;
    reportProgress();
  };
  const onDetail = (detail: string) => {
    label = detail;
    reportProgress();
  };

  const log = createSyncLog();
  try {
    const tokenModel = await createTokenModel(msg.config, onStep, onDetail);
    // Warnings from building the model (unresolved aliases etc.) are reported with the sync's own warnings.
    log.warnings.push(...tokenModel.warnings);

    await syncToFigma(tokenModel, log, onStep);

    postMessage('sync-result', {
      status: 'success',
      message:
        'Check your variables and styles in Figma to make sure they were updated correctly.',
      info: log.info,
      warnings: log.warnings,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    postMessage('sync-result', {
      status: 'error',
      message: `${label ? `${label} failed: ` : ''}${errorMessage}`,
      info: log.info,
      warnings: log.warnings,
    });
    console.error('Error syncing tokens:', error);
  }
};
