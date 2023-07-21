import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Pagination } from '.';

type Story = StoryObj<typeof Pagination>;

export default {
  title: 'Kjernekomponenter/Pagination',
  component: Pagination,
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
    children: 'You created the Pagination component!',
    myProp: false, // we set this so "boolean" is set in props table
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Pagination> = () => (
  <>
    <Pagination
      currentPage={1}
      totalPages={10}
      variant='compact'
      size={'small'}
      onChange={() => null}
    ></Pagination>
  </>
);
