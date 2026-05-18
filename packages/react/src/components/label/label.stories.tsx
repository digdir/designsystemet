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
    children: 'Fødselsnummer (11 sifre)',
    weight: 'medium',
  },
};

export const Inverted: Story = {
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
