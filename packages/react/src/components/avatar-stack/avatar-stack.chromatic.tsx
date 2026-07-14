import preview from '../../../../../apps/storybook/.storybook/preview';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { EXPERIMENTAL_AvatarStack as AvatarStack } from './avatar-stack';
import * as AvatarStackStories from './avatar-stack.stories';

const meta = preview.meta({
  title: 'Chromatic/AvatarStack',
  component: AvatarStack,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
});

export const Snapshots = meta.story(createSingleStory(AvatarStackStories));
