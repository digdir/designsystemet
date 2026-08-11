import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Badge } from './';
import * as BadgeStories from './badge.stories';

const meta = preview.meta({
  title: 'Chromatic/Badge',
  component: Badge,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(BadgeStories));
