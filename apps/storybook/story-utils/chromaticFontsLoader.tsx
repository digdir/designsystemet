import type { Loader } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';

export const chromaticFontsLoader: Loader = async () => {
  if (isChromatic() && document.fonts) {
    return {
      fonts: await document.fonts.ready,
    };
  }
};
