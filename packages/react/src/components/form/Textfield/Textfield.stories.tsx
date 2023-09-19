import type { Meta, StoryObj } from '@storybook/react';

import { Textfield } from '.';

type Story = StoryObj<typeof Textfield>;

export default {
  title: 'Felles/Textfield',
  component: Textfield,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    description: 'Description',
    disabled: false,
    readOnly: false,
    error: 'Annen feilmelding her',
    characterLimit: {
      label: (count) =>
        count > -1 ? `${count} tegn igjen` : `${Math.abs(count)} tegn for mye.`,
      maxCount: 20,
      srLabel: `Tekstfelt med plass til ${20} tegn.`,
    },
  },
};

export const WithCharacterCounter: Story = {
  args: {
    label: 'Label',
    error: 'Annen feilmelding her',
    characterLimit: {
      label: (count) =>
        count > -1 ? `${count} tegn igjen` : `${Math.abs(count)} tegn for mye.`,
      maxCount: 20,
      srLabel: `Tekstfelt med plass til ${20} tegn.`,
    },
  },
};
