import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Divider } from './divider';
import * as DividerStories from './divider.stories';

const meta = preview.meta({
  title: 'Chromatic/Divider',
  component: Divider,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(DividerStories));
