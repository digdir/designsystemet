import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { EXPERIMENTAL_AvatarStack as AvatarStack } from './avatar-stack';
import * as AvatarStackStories from './avatar-stack.stories';

const meta: Meta = {
  title: 'Chromatic/AvatarStack',
  component: AvatarStack,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(AvatarStackStories, meta);
