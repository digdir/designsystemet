import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { List } from './';
import * as ListStories from './list.stories';

const meta = preview.meta({
  title: 'Chromatic/List',
  component: List.Unordered,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(ListStories));
