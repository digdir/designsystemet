import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import { Tag } from '.';
import * as TagStories from './tag.stories';

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
