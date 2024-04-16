import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

const tokensTransform = {
  '--fds-semantic-surface-first-light': '--fds-semantic-surface-first-subtle',
  '--fds-semantic-surface-first-light-hover':
    '--fds-semantic-surface-first-subtle-hover',
  '--fds-semantic-surface-first-light-active':
    '--fds-semantic-surface-first-subtle-active',
  '--fds-semantic-surface-first-dark': '--fds-semantic-surface-first-strong',
  '--fds-semantic-surface-second-light': '--fds-semantic-surface-second-subtle',
  '--fds-semantic-surface-second-light-hover':
    '--fds-semantic-surface-second-subtle-hover',
  '--fds-semantic-surface-second-light-active':
    '--fds-semantic-surface-second-subtle-active',
  '--fds-semantic-surface-second-dark': '--fds-semantic-surface-second-strong',
  '--fds-semantic-surface-third-light': '--fds-semantic-surface-third-subtle',
  '--fds-semantic-surface-third-light-hover':
    '--fds-semantic-surface-third-subtle-hover',
  '--fds-semantic-surface-third-light-active':
    '--fds-semantic-surface-third-subtle-active',
  '--fds-semantic-surface-third-dark': '--fds-semantic-surface-third-strong',
  '--fds-semantic-surface-neutral-dark':
    '--fds-semantic-surface-neutral-strong',
  '--fds-semantic-surface-neutral-dark-hover':
    '--fds-semantic-surface-neutral-strong-hover',
  '--fds-semantic-border-action-dark': '--fds-semantic-border-action-strong',
  '--fds-semantic-border-action-dark-hover':
    '--fds-semantic-border-action-strong-hover',
};

const transformPlugin: Plugin = {
  postcssPlugin: 'Dark/Light tokens to Strong/Subtle tokens',
  Declaration(decl) {
    Object.keys(tokensTransform).forEach((key) => {
      if (decl.value.includes(key)) {
        decl.value = decl.value.replace(
          key,
          tokensTransform[key as keyof typeof tokensTransform],
        );
      }
    });
  },
};

const plugins: AcceptedPlugin[] = [transformPlugin];

const processor = postcss(plugins);

const transform = async () => {
  const files = glob.sync('./**/*.css');

  const filePromises = files.map(async (file) => {
    // Read the file and convert it to a string.
    // This is effectively equivalent to the `css`
    // variable that was previously defined above.
    const contents = fs.readFileSync(file).toString();

    // Identical, but the `css` variable was swapped for the file `contents`.
    const result = await processor.process(contents, { from: undefined });

    // Instead of logging the result, write the
    // result back to the original file, completing
    // the transformation for this file.
    fs.writeFileSync(file, result.css);
  });

  // Wait for the array of promises to all resolve.
  await Promise.all(filePromises);
};

// Run the transform.
void transform();
