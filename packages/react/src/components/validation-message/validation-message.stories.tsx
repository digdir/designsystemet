import preview from '../../../../../apps/storybook/.storybook/preview';

import { ValidationMessage } from './validation-message';

const meta = preview.meta({
  title: 'Komponenter/Typography/ValidationMessage',
  component: ValidationMessage,
});

export const Preview = meta.story({
  args: {
    children: 'Dette er en valideringsmelding.',
  },
});
