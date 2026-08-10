import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Pagination } from './';
import * as PaginationStories from './pagination.stories';

const meta = preview.meta({
  title: 'Chromatic/Pagination',
  component: Pagination,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(PaginationStories));
