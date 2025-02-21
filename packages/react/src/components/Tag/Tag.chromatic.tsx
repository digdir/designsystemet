import type { Meta } from '@storybook/react';
import { Tag } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as TagStories from './Tag.stories';

const meta: Meta = {
  title: 'Chromatic/Tag',
  component: Tag,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(TagStories, meta);
