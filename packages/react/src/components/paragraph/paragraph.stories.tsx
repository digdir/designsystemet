import type { Meta, StoryObj } from '@storybook/react-vite';

import { Paragraph } from './paragraph';

const meta: Meta<typeof Paragraph> = {
  title: 'Komponenter/Typography/Paragraph',
  component: Paragraph,
};

export default meta;

type Story = StoryObj<typeof Paragraph>;

export const Preview: Story = {
  args: {
    children:
      'Personvernerklæringen gir informasjon om hvilke personopplysninger vi behandler, hvordan disse blir behandlet og hvilke rettigheter du har.',
    variant: 'default',
  },
};

export const Inverted: StoryObj<typeof Paragraph> = {
  args: {
    ...Preview.args,
  },
};

Inverted.decorators = [
  (Story) => (
    <div
      data-color='inverted'
      style={{
        background: 'var(--ds-color-background-default)',
        padding: 'var(--ds-size-4)',
      }}
    >
      <Story />
    </div>
  ),
];
