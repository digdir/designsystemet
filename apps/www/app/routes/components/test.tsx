import { Sandpack } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import css from '@digdir/designsystemet-css?raw';
import theme from '@digdir/designsystemet-theme?raw';
import { ContentContainer } from '@internal/components';
import designSystemRaw from '~/sandpack-build/index.cjs?raw';
import code from './_test/button.tsx?raw';

export default function Components() {
  return (
    <ContentContainer>
      <h2>Test av sandpack</h2>
      <Sandpack
        theme={nightOwl}
        template='react'
        customSetup={{
          dependencies: {
            '@floating-ui/dom': '^1.7.0',
            '@floating-ui/react': '0.26.23',
            '@navikt/aksel-icons': '^7.22.0',
            '@radix-ui/react-slot': '^1.2.3',
            '@tanstack/react-virtual': '^3.13.9',
            '@u-elements/u-datalist': '^0.1.5',
            '@u-elements/u-details': '^0.1.1',
            '@u-elements/u-tags': '^0.1.4',
            clsx: '^2.1.1',
          },
        }}
        files={{
          '/App.js': code,
          '/node_modules/@digdir/designsystemet-react/package.json': {
            code: JSON.stringify({
              name: '@digdir/designsystemet-react',
              main: './index.js',
            }),
            hidden: true,
          },
          '/node_modules/@digdir/designsystemet-react/index.js': {
            code: designSystemRaw,
            hidden: true,
          },
          '/index.css': {
            code: theme + '\n' + css,
            hidden: true,
          },
        }}
        options={
          {
            /* readOnly: true, */
          }
        }
      />
    </ContentContainer>
  );
}
