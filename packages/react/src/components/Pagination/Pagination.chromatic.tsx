import type { Meta } from '@storybook/react';
import { Pagination } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as PaginationStories from './Pagination.stories';

const meta: Meta = {
  title: 'Chromatic/Pagination',
  component: Pagination,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(PaginationStories, meta);
