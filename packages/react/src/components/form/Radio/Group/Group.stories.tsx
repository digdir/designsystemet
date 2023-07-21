import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Group } from '.';

type Story = StoryObj<typeof Group>;

export default {
  title: 'Kjernekomponenter/Form/Group',
  component: Group,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the Group component!',
    myProp: false, // we set this so "boolean" is set in props table
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Group> = () => (
  <>
    <Group myProp>I</Group>
    <Group>am</Group>
    <Group myProp>stacked</Group>
  </>
);
