import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'Komponenter/Typography/Heading',
  component: Heading,
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Preview: Story = {
  args: {
    children: 'Tittel tekst',
  },
};
