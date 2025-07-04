import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { List } from '.';
import * as ListStories from './list.stories';

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
