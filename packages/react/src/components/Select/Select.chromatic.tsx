import type { Meta } from '@storybook/react';
import { Select } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as SelectStories from './Select.stories';

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
