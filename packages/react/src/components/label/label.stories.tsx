import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'Komponenter/Typography/Label',
  component: Label,
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Preview: Story = {
  args: {
    children: 'Vennligst skriv inn fødselsnummer. 11 tegn',
    weight: 'medium',
  },
};
