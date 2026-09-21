import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Select } from './';
import * as SelectStories from './select.stories';

const meta = preview.meta({
  title: 'Chromatic/Select',
  component: Select,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(SelectStories));
