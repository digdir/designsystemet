import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Avatar } from './avatar';
import * as AvatarStories from './avatar.stories';

const meta = preview.meta({
  title: 'Chromatic/Avatar',
  component: Avatar,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(AvatarStories));
