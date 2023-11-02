import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import React from 'react';

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
  title: 'Felles/Tooltip',
  component: Tooltip,
  decorators,
} as Meta;

export const Preview: Story = {
  args: {
    content: 'Tooltip text',
    children: defaultChildren,
  },
};

export const Placement: Story = {
  args: {
    content: 'Tooltip text',
    placement: 'bottom',
    children: defaultChildren,
  },
};

export const DefaultOpen: Story = {
  args: {
    content: 'Tooltip text',
    defaultOpen: true,
    children: defaultChildren,
  },
};

export const Complex: StoryFn<typeof Tooltip> = () => {
  return (
    <Paragraph>
      Du kan ha{' '}
      <Tooltip content='Kan gi bra brukeropplevelse'>
        <abbr
          style={{ fontWeight: 'bold', textDecoration: 'underline dotted' }}
        >
          tooltip
        </abbr>
      </Tooltip>{' '}
      inne i tekst også
    </Paragraph>
  );
};
