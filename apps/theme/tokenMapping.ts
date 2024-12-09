export const mapTokens = () => {
  // ds-color
  setToken(
    '--ds-color-background-default',
    'var(--ds-color-accent-background-default)',
  );
  setToken(
    '--ds-color-background-subtle',
    'var(--ds-color-accent-background-subtle)',
  );
  setToken(
    '--ds-color-surface-default',
    'var(--ds-color-accent-surface-default)',
  );
  setToken('--ds-color-surface-hover', 'var(--ds-color-accent-surface-hover)');
  setToken(
    '--ds-color-surface-active',
    'var(--ds-color-accent-surface-active)',
  );
  setToken('--ds-color-border-subtle', 'var(--ds-color-accent-border-subtle)');
  setToken(
    '--ds-color-border-default',
    'var(--ds-color-accent-border-default)',
  );
  setToken('--ds-color-border-strong', 'var(--ds-color-accent-border-strong)');
  setToken('--ds-color-base-default', 'var(--ds-color-accent-base-default)');
  setToken('--ds-color-base-hover', 'var(--ds-color-accent-base-hover)');
  setToken('--ds-color-base-active', 'var(--ds-color-accent-base-active)');
  setToken('--ds-color-text-subtle', 'var(--ds-color-accent-text-subtle)');
  setToken('--ds-color-text-default', 'var(--ds-color-accent-text-default)');
  setToken(
    '--ds-color-contrast-default',
    'var(--ds-color-accent-contrast-default)',
  );
  setToken(
    '--ds-color-contrast-subtle',
    'var(--ds-color-accent-contrast-subtle)',
  );
};

const setToken = (token: string, color: string) => {
  const previewElement = document.getElementById('preview');
  if (previewElement) {
    previewElement.style.setProperty(token, color);
  }
};
