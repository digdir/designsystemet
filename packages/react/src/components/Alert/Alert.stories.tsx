import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Heading, Paragraph } from '../';

import { Alert } from '.';

type Story = StoryObj<typeof Alert>;

export default {
  title: 'Kjernekomponenter/Alert',
  component: Alert,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
    layout: 'padded',
  },
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: StoryFn<typeof Alert> = (args) => (
  <Alert {...args}>
    <Heading
      level={2}
      size='medium'
    >
      Tittel
    </Heading>
    <Paragraph>En paragraftekst</Paragraph>
  </Alert>
);

Preview.args = {
  severity: 'info',
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Alert> = () => (
  <>
    <Alert>I</Alert>
    <Alert>am</Alert>
    <Alert>stacked</Alert>
  </>
);
