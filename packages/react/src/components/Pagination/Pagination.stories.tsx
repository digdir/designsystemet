import React, { useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Pagination } from '.';

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

export const Preview: StoryFn<typeof Pagination> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage);

  useEffect(() => {
    setCurrentPage(args.currentPage);
  }, [args.currentPage]);

  return (
    <>
      <Pagination
        {...args}
        onChange={setCurrentPage}
        currentPage={currentPage}
      ></Pagination>
    </>
  );
};

Preview.args = {
  size: 'medium',
  nextLabel: 'Neste',
  previousLabel: 'Forrige',
  totalPages: 10,
  hideLabels: false,
  compact: false,
  currentPage: 1,
  itemLabel: (num) => `Side ${num}`,
};
