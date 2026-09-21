import preview from '../../../../../apps/storybook/.storybook/preview';

import { Label } from './label';

const meta = preview.meta({
  title: 'Komponenter/Typography/Label',
  component: Label,
});

export const Preview = meta.story({
  args: {
    children: 'Fødselsnummer (11 sifre)',
    weight: 'medium',
  },
});
