import type { Meta } from '@storybook/react';
import { Avatar } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as AvatarStories from './Avatar.stories';

const meta: Meta = {
  title: 'Chromatic/Avatar',
  component: Avatar,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(AvatarStories, meta);
