import React, { useState } from 'react';
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

export const Eksempel: StoryFn<typeof Pagination> = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        nextLabel={'Neste'}
        previousLabel={'Forrige'}
        hideLabels
        onChange={setCurrentPage}
        size={'medium'}
      ></Pagination>
    </>
  );
};

export const Preview: Story = {
  args: {
    currentPage: 1,
    onChange: () => null,
    nextLabel: 'Neste',
    previousLabel: 'Forrige',
  },
};
