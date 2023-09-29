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
    myProp: false, // we set this so "boolean" is set in props table
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Tabs> = () => (
  <>
    <Tabs myProp>I</Tabs>
    <Tabs>am</Tabs>
    <Tabs myProp>stacked</Tabs>
  </>
);
