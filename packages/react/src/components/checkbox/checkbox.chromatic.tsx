import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Checkbox } from './checkbox';
import * as CheckboxStories from './checkbox.stories';

const meta: Meta = {
  title: 'Chromatic/Checkbox',
  component: Checkbox,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(CheckboxStories, meta);
