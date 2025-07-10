import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Select } from './';
import * as SelectStories from './select.stories';

const meta: Meta = {
  title: 'Chromatic/Select',
  component: Select,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(SelectStories, meta);
