import type { Meta } from '@storybook/react';
import { Search } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as SearchStories from './Search.stories';

const meta: Meta = {
  title: 'Chromatic/Search',
  component: Search,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(SearchStories, meta);
