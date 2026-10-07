import { postMessage } from '../common';
import type { FigmaMessages } from '../types';
import { exportConfig } from './config-export/export-config';
import { readCollections } from './config-export/read-collections';
import { createTokenModel } from './config-import/create-token-model';
import {
  IMPORT_STEPS,
  importToFigma,
  type OnStep,
} from './config-import/import-to-figma';
import { createImportLog } from './config-import/log';

/** Steps reported to the UI: validating, creating tokens, preparing the import, then the Figma import's own steps. */
const TOTAL_STEPS = 3 + IMPORT_STEPS;

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

  if (msg.type === 'export-config') {
    try {
      const { config, warnings } = exportConfig(await readCollections());
      postMessage('export-config-result', {
        status: 'success',
        config: `${JSON.stringify(config, null, 2)}\n`,
        warnings,
      });
    } catch (error) {
      postMessage('export-config-result', {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
      console.error('Error exporting config:', error);
    }
    return;
  }

  if (msg.type !== 'import-config') {
    return;
  }

  let step = 0;
  let label = '';
  let note: string | undefined;
  const reportProgress = () =>
    postMessage('import-progress', { step, total: TOTAL_STEPS, label, note });
  const onStep: OnStep = async (stepLabel, stepNote) => {
    step += 1;
    label = stepLabel;
    note = stepNote;
    reportProgress();
    // Most steps run synchronous Figma API calls that block Figma until they finish. Wait a moment
    // so the UI receives and renders the step (and its note) before that happens.
    await new Promise((resolve) => setTimeout(resolve, 50));
  };
  const onDetail = (detail: string) => {
    label = detail;
    reportProgress();
  };

  const log = createImportLog();
  try {
    const tokenModel = await createTokenModel(msg.config, onStep, onDetail);
    // Warnings from building the model (unresolved aliases etc.) are reported with the import's own warnings.
    log.warnings.push(...tokenModel.warnings);

    await importToFigma(tokenModel, log, onStep, onDetail);
    // Always give feedback, so an import that changed nothing still has a log to show.
    if (log.info.length === 0) {
      log.info.push('No changes');
    }

    postMessage('import-result', {
      status: 'success',
      message:
        'You can now close this window. Check your variables and styles in Figma to make sure they were updated correctly.',
      info: log.info,
      warnings: log.warnings,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    postMessage('import-result', {
      status: 'error',
      message: `${label ? `${label} failed: ` : ''}${errorMessage}`,
      info: log.info,
      warnings: log.warnings,
    });
    console.error('Error importing config:', error);
  }
};
