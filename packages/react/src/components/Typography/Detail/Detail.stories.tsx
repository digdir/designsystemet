import type { Meta, StoryObj } from '@storybook/react';

import { Detail } from './';

const meta: Meta<typeof Detail> = {
  title: 'Kjernekomponenter/Typography/Detail',
  component: Detail,
};

export default meta;

type Story = StoryObj<typeof Detail>;

export const Preview: Story = {
  args: {
    children: 'Detaljer tekst som beskriver noe',
    spacing: false,
  },
};
