import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Search } from './';
import * as SearchStories from './search.stories';

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
