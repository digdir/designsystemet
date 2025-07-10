import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Pagination } from './';
import * as PaginationStories from './pagination.stories';

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
