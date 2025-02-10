import type { Meta } from '@storybook/react';
import { Badge } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as BadgeStories from './Badge.stories';

const meta: Meta = {
  title: 'Chromatic/Badge',
  component: Badge,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(BadgeStories, meta);
