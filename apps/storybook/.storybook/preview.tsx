import './style.css';
/* We use relative imports to get HMR updates when developing */
import '../../../packages/css/src/index.css';
import '../../../packages/theme/brand/digdir.css';

import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import { customStylesDecorator } from '../story-utils/customStylesDecorator';
import { fontsLoader } from '../story-utils/fontsLoader';
import { allModes, viewportWidths } from '../story-utils/modes';
import customTheme from './customThemeLight';

const viewports: Record<string, object> = {};

for (const width of viewportWidths) {
  viewports[`${width}px`] = {
    name: `${width}px`,
    styles: {
      width: `${width}px`,
      height: '100%',
    },
  };
}

const DocsContainerWithWrapper: typeof DocsContainer = ({
  children,
  context,
  ...props
}) => {
  return (
    <div className='custom-docs-wrapper'>
      <DocsContainer context={context} {...props}>
        {children}
      </DocsContainer>
    </div>
  );
};

const preview: Preview = {
  tags: ['a11y-test'],
  globalTypes: {
    colorScheme: {
      description: 'Set color-scheme for stories only',
      toolbar: {
        title: 'Story Theme',
        icon: 'moon',
        items: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Auto', value: 'auto' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: 'auto',
  },
  parameters: {
    layout: 'centered',
    viewMode: 'docs',
    docs: {
      theme: customTheme,
      //@ts-ignore
      container: DocsContainerWithWrapper,
      /* @ts-ignore this is a type error as of 9.0.6*/
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Oversikt',
          'Kom i gang',
          'Endringslogger',
          'Komponenter',
          'Utilities',
          'Experimental',
          'Primitives',
          'Avviklet',
        ],
      },
    },
    viewport: {
      viewports,
    },
    chromatic: {
      // Disable snapshots by default
      disableSnapshot: true,
      modes: {
        mobile: allModes[320],
        desktop: allModes[1200],
      },
    },
    a11y: {
      test: 'error',
    },
    backgrounds: {
      disable: true,
    },
    html: {
      root: '[data-storybook-decorator]', // default: #root
    },
  },
  decorators: [customStylesDecorator],
  loaders: isChromatic() && document.fonts ? [fontsLoader] : [],
};

export default preview;
