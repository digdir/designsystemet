import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Search } from './';
import * as SearchStories from './search.stories';

const meta = preview.meta({
  title: 'Chromatic/Search',
  component: Search,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SearchStories));
