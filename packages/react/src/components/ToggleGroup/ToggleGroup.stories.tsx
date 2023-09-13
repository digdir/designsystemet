import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { ToggleGroup } from '.';

type Story = StoryObj<typeof ToggleGroup>;

export default {
  title: 'Felles/ToggleGroup',
  component: ToggleGroup,
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the ToggleGroup component!',
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof ToggleGroup> = () => (
  <>
    <ToggleGroup>
      <ToggleGroup.Item
        active={false}
        variant='filled'
      >
        Test
      </ToggleGroup.Item>
      <ToggleGroup.Item
        active={false}
        variant='outline'
      >
        Test
      </ToggleGroup.Item>
      <ToggleGroup.Item
        active={false}
        variant='outline'
      >
        Test Test
      </ToggleGroup.Item>
    </ToggleGroup>
  </>
);
