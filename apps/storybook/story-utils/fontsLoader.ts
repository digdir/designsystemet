import type { Loader } from '@storybook/react';

export const fontsLoader: Loader = async () => ({
  fonts: await document.fonts.ready,
});
