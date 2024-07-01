import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Paragraph, Button } from '../..';

import { Tooltip } from '.';

type Story = StoryObj<typeof Tooltip>;

const defaultChildren = <Button>My trigger</Button>;
const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '2rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Komponenter/Tooltip',
  component: Tooltip,
} as Meta;

export const Preview: Story = {
  args: {
    content: 'Tooltip text',
    children: defaultChildren,
    placement: 'top',
  },
  decorators,
};

export const Placement: Story = {
  args: {
    content: 'Tooltip text',
    placement: 'bottom',
    children: defaultChildren,
  },
  decorators,
};

export const DefaultOpen: Story = {
  args: {
    content: 'Tooltip text',
    defaultOpen: true,
    children: defaultChildren,
  },
  decorators,
};

export const Complex: StoryFn<typeof Tooltip> = () => {
  return (
    <Paragraph>
      Du kan ha{' '}
      <Tooltip content='Kan gi bra brukeropplevelse'>
        <span
          style={{ fontWeight: 'bold', textDecoration: 'underline dotted' }}
        >
          tooltip
        </span>
      </Tooltip>{' '}
      inne i tekst også
    </Paragraph>
  );
};

Complex.decorators = decorators;

export const Portal: Story = {
  args: {
    content: 'Tooltip text',
    children: defaultChildren,
    placement: 'top',
    portal: true,
  },
};
