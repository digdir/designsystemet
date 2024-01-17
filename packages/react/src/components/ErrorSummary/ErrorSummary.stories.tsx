import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { ErrorSummary } from './';

type Story = StoryFn<typeof ErrorSummary>;

export default {
  title: 'Felles/ErrorSummary',
  component: ErrorSummary,
} as Meta;

export const Preview: Story = (args) => (
  <>
    <ErrorSummary {...args}>
      <ErrorSummary.Item href='#'>ErrorSummary.Item</ErrorSummary.Item>
      <ErrorSummary.Item href='#'>ErrorSummary.Item</ErrorSummary.Item>
      <ErrorSummary.Item href='#'>ErrorSummary.Item</ErrorSummary.Item>
    </ErrorSummary>
  </>
);
Preview.args = {
  size: 'medium',
  heading: 'ErrorSummary',
};
