export const mapTokens = () => {
  // Background subtle
  setToken('--fds-semantic-background-subtle', 'var(--grey2)');
  setToken('--fds-semantic-surface-neutral-default', 'var(--grey1)');

  // Background default
  setToken('--fds-semantic-background-default', 'var(--grey1)');

  // Component normal
  setToken('--fds-semantic-surface-action-first-subtle', 'var(--accent3)');
  setToken('--fds-semantic-surface-action-first-no_fill', 'var(--accent3)');
  setToken('--fds-semantic-surface-first-light', 'var(--brandOne3)');
  setToken('--fds-semantic-surface-second-light', 'var(--brandTwo3)');
  setToken('--fds-semantic-surface-third-light', 'var(--brandThree3)');
  setToken('--fds-semantic-surface-neutral-subtle', 'var(--grey3)');

  // Component hover
  setToken('--fds-semantic-surface-info-subtle-hover', 'var(--accent4)');
  setToken(
    '--fds-semantic-surface-action-first-subtle-hover',
    'var(--accent4)',
  );
  setToken(
    '--fds-semantic-surface-action-first-no_fill-hover',
    'var(--accent4)',
  );
  setToken('--fds-semantic-surface-first-light-hover', 'var(--brandOne4)');
  setToken('--fds-semantic-surface-second-light-hover', 'var(--brandTwo4)');
  setToken('--fds-semantic-surface-third-light-hover', 'var(--brandThree4)');

  // Component active
  setToken(
    '--fds-semantic-surface-action-first-subtle-active',
    'var(--accent5)',
  );

  // Border subtle
  setToken('--fds-semantic-border-neutral-subtle', 'var(--accent6)');
  setToken('--fds-semantic-border-action-first-subtle', 'var(--accent6)');
  setToken('--fds-semantic-border-first', 'var(--brandOne6)');
  setToken('--fds-semantic-border-second', 'var(--brandTwo6)');
  setToken('--fds-semantic-border-third', 'var(--brandThree6)');
  setToken('--fds-semantic-border-first-default', 'var(--brandOne6)');
  setToken('--fds-semantic-border-second-default', 'var(--brandTwo6)');
  setToken('--fds-semantic-border-third-default', 'var(--brandThree6)');
  setToken('--fds-semantic-border-divider-default', 'var(--grey6)');

  // Border default
  setToken('--fds-semantic-border-action-first-subtle-hover', 'var(--accent7)');
  setToken('--fds-semantic-border-neutral-default', 'var(--accent7)');
  setToken('--input-placeholder', '--grey7');
  setToken('--fds-semantic-surface-neutral-dark', 'var(--grey7)');
  setToken('--fds-semantic-border-input-default', 'var(--grey7)');

  // Solid normal
  setToken('--fds-semantic-border-input-hover', 'var(--accent9)');
  setToken('--fds-semantic-border-action-default', 'var(--accent9)');
  setToken('--fds-semantic-surface-success-default', 'var(--accent9)');
  setToken('--fds-semantic-surface-action-first-default', 'var(--accent9)');
  setToken('--fds-semantic-border-action-first-default', 'var(--accent9)');

  // Solid hover
  setToken('--fds-semantic-surface-success-hover', 'var(--accent10)');
  setToken('--fds-semantic-surface-action-first-hover', 'var(--accent10)');

  // Solid active
  setToken('--fds-semantic-surface-action-first-active', 'var(--accent11)');

  // Text subtle
  setToken('--fds-semantic-text-neutral-subtle', 'var(--grey12)');
  setToken('--fds-semantic-text-action-hover', 'var(--accent12)');
  setToken('--fds-semantic-text-action-first-hover', 'var(--accent12)');
  setToken('--fds-semantic-text-action-first-default', 'var(--accent12)');
  setToken('--fds-semantic-text-action-default', 'var(--accent12)');

  // Text default
  setToken('--fds-semantic-text-neutral-default', 'var(--grey13)');
  setToken('--fds-semantic-text-action-first-on_action', 'var(--accent14)');

  // Custom
  setToken('--background', 'var(--grey1)');
  setToken('--fds-semantic-text-visited-default', 'var(--accent12)');
};

const setToken = (token: string, color: string) => {
  const previewElement = document.getElementById('preview');
  if (previewElement) {
    previewElement.style.setProperty(token, color);
  }
};
