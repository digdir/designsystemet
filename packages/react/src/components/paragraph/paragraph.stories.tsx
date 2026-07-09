import preview from '../../../../../apps/storybook/.storybook/preview';

import { Paragraph } from './paragraph';

const meta = preview.meta({
  title: 'Komponenter/Typography/Paragraph',
  component: Paragraph,
});

export const Preview = meta.story({
  args: {
    children:
      'Personvernerklæringen gir informasjon om hvilke personopplysninger vi behandler, hvordan disse blir behandlet og hvilke rettigheter du har.',
    variant: 'default',
  },
});
