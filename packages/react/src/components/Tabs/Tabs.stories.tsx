import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Tabs } from '.';

type Story = StoryObj<typeof Tabs>;

export default {
  title: 'Kjernekomponenter/Tabs',
  component: Tabs,
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the Tabs component!',
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Tabs> = () => (
  <>
    <Tabs />
  </>
);
