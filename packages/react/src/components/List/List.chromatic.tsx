import type { Meta } from '@storybook/react';
import { List } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ListStories from './List.stories';

const meta: Meta = {
  title: 'Chromatic/List',
  component: List.Unordered,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ListStories, meta);
