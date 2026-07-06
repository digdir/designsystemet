import { createTokens } from '@digdir/designsystemet';
import type { FigmaMessages } from '../types';

if (figma.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 800,
    height: 650,
    title: 'Designsystemet',
    themeColors: true,
  });
}

figma.ui.onmessage = (msg: FigmaMessages) => {
  switch (msg.type) {
    case 'import-tokens': {
      const config = JSON.parse(msg.config);
      const _tokens = createTokens(config);
      console.log('Importing tokens with config:', _tokens);

      figma.ui.postMessage({
        type: 'import-tokens',
        message: 'Tokens imported successfully!',
      });
      break;
    }
  }
};
