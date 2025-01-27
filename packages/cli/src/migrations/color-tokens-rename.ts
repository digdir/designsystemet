import { cssVarRename } from './codemods/css/plugins.js';
import { runCssCodemod } from './codemods/css/run.js';

export default (glob?: string) =>
  runCssCodemod({
    globPattern: glob,
    plugins: [
      // https://github.com/digdir/designsystemet/issues/3046
      cssVarRename({
        // Background
        '--ds-color-background-subtle': '--ds-color-background-tinted',
        '--ds-color-neutral-background-subtle': '--ds-color-neutral-background-tinted',
        '--ds-color-accent-background-subtle': '--ds-color-accent-background-tinted',
        '--ds-color-brand1-background-subtle': '--ds-color-brand1-background-tinted',
        '--ds-color-brand2-background-subtle': '--ds-color-brand2-background-tinted',
        '--ds-color-brand3-background-subtle': '--ds-color-brand3-background-tinted',
        '--ds-color-danger-background-subtle': '--ds-color-danger-background-tinted',
        '--ds-color-warning-background-subtle': '--ds-color-warning-background-tinted',
        '--ds-color-success-background-subtle': '--ds-color-success-background-tinted',
        '--ds-color-info-background-subtle': '--ds-color-info-background-tinted',
        // Surface
        '--ds-color-surface-default': '--ds-color-surface-tinted',
        '--ds-color-neutral-surface-default': '--ds-color-neutral-surface-tinted',
        '--ds-color-accent-surface-default': '--ds-color-accent-surface-tinted',
        '--ds-color-brand1-surface-default': '--ds-color-brand1-surface-tinted',
        '--ds-color-brand2-surface-default': '--ds-color-brand2-surface-tinted',
        '--ds-color-brand3-surface-default': '--ds-color-brand3-surface-tinted',
        '--ds-color-danger-surface-default': '--ds-color-danger-surface-tinted',
        '--ds-color-warning-surface-default': '--ds-color-warning-surface-tinted',
        '--ds-color-success-surface-default': '--ds-color-success-surface-tinted',
        '--ds-color-info-surface-default': '--ds-color-info-surface-tinted',
        // Contrast
        '--ds-color-contrast-default': '--ds-color-base-contrast-default',
        '--ds-color-contrast-subtle': '--ds-color-base-contrast-subtle',
      }),
    ],
  });
