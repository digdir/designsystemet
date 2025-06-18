import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import css from '@digdir/designsystemet-css?raw';
import packageJson from '@digdir/designsystemet-react/package.json';
import theme from '@digdir/designsystemet-theme?raw';
import designSystemRaw from '~/sandpack-build/index.js?raw';

type SandpackComponentProps = {
  story: {
    name: string;
    code: string;
    decoratorCode?: string | null;
  };
};

export const SandpackComponent = ({ story }: SandpackComponentProps) => {
  return (
    <>
      <SandpackProvider
        theme={nightOwl}
        template='react'
        customSetup={{
          dependencies: {
            ...packageJson.dependencies,
          },
        }}
        files={{
          '/App.js': {
            code: `import Code from './component';
          import Decorator from './decorator';
          import './index.css';

          export default function Sample() {
            return <Decorator><Code /></Decorator>
            }`,
            hidden: true,
          },
          '/component.tsx': {
            code: story.code,
          },
          '/decorator.tsx': {
            code:
              story.decoratorCode ||
              'export default function Decorator({ children }) { return <>{children}</>; }',
            hidden: true,
          },
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
        options={{
          /* readOnly: true, */
          visibleFiles: ['/component.tsx'],
          activeFile: '/component.tsx',
        }}
      >
        <div
          style={{
            marginBlockEnd: 'var(--ds-size-8)',
          }}
        >
          <SandpackPreview />
          <SandpackCodeEditor showRunButton={false} />
        </div>
      </SandpackProvider>
    </>
  );
};
