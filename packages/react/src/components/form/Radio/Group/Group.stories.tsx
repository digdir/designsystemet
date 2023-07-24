import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Radio } from '../Radio';

import { RadioGroup } from '.';

export default {
  title: 'Kjernekomponenter/Form/Group',
  component: RadioGroup,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: StoryFn<typeof RadioGroup> = (args) => (
  <RadioGroup {...args}>
    <Radio value='yes'>Yes</Radio>
    <Radio
      value='no'
      description='description for option no'
    >
      No
    </Radio>
  </RadioGroup>
);

Preview.args = {
  legend: 'Descriptive information about name change',
  description: 'description',
  error: '',
  readOnly: false,
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof RadioGroup> = () => (
  <>
    <RadioGroup>I</RadioGroup>
    <RadioGroup>am</RadioGroup>
    <RadioGroup>stacked</RadioGroup>
  </>
);
