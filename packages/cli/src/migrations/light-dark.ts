import { cssVarCodemod } from '../codemods/css-var-codemod.js';

export default (path?: string) =>
  cssVarCodemod({
    globPath: path,
    dictionary: {
      '--fds-semantic-surface-first-light': '--fds-semantic-surface-first-subtle',
      '--fds-semantic-surface-first-light-hover': '--fds-semantic-surface-first-subtle-hover',
      '--fds-semantic-surface-first-light-active': '--fds-semantic-surface-first-subtle-active',
      '--fds-semantic-surface-first-dark': '--fds-semantic-surface-first-strong',
      '--fds-semantic-surface-second-light': '--fds-semantic-surface-second-subtle',
      '--fds-semantic-surface-second-light-hover': '--fds-semantic-surface-second-subtle-hover',
      '--fds-semantic-surface-second-light-active': '--fds-semantic-surface-second-subtle-active',
      '--fds-semantic-surface-second-dark': '--fds-semantic-surface-second-strong',
      '--fds-semantic-surface-third-light': '--fds-semantic-surface-third-subtle',
      '--fds-semantic-surface-third-light-hover': '--fds-semantic-surface-third-subtle-hover',
      '--fds-semantic-surface-third-light-active': '--fds-semantic-surface-third-subtle-active',
      '--fds-semantic-surface-third-dark': '--fds-semantic-surface-third-strong',
      '--fds-semantic-surface-neutral-dark': '--fds-semantic-surface-neutral-strong',
      '--fds-semantic-surface-neutral-dark-hover': '--fds-semantic-surface-neutral-strong-hover',
      '--fds-semantic-border-action-dark': '--fds-semantic-border-action-strong',
      '--fds-semantic-border-action-dark-hover': '--fds-semantic-border-action-strong-hover',
    },
  });
