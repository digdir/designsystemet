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

export const Normal: StoryFn<typeof Pagination> = () => (
  <>
    <Pagination
      currentPage={1}
      totalPages={10}
      nextLabel={'Neste'}
      previousLabel={'Forrige'}
      onChange={(currentPage) => currentPage}
    ></Pagination>
  </>
);

export const Kompakt: StoryFn<typeof Pagination> = () => (
  <>
    <Pagination
      currentPage={1}
      totalPages={10}
      nextLabel={'Neste'}
      previousLabel={'Forrige'}
      onChange={(currentPage) => currentPage}
      compact
    ></Pagination>
  </>
);
