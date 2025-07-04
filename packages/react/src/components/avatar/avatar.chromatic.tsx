import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Avatar } from '.';
import * as AvatarStories from './avatar.stories';

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
