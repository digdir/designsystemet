import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Tabs } from '.';

type Story = StoryObj<typeof Tabs>;

export default {
  title: 'Felles/Tabs',
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
  <Tabs>
    <Tabs.List>
      <Tabs.Tab>Tab 1</Tabs.Tab>
      <Tabs.Tab>Tab 2</Tabs.Tab>
      <Tabs.Tab>Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Content>content 1</Tabs.Content>
    <Tabs.Content>content 2</Tabs.Content>
    <Tabs.Content>content 3</Tabs.Content>
  </Tabs>
);
