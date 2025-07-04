import type { Meta } from '@storybook/react-vite';
import { createSingleStory } from '../../../stories/utils/create-single-story';
import { Radio } from '.';
import * as RadioStories from './radio.stories';

const meta: Meta = {
  title: 'Chromatic/Radio',
  component: Radio,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(RadioStories, meta);
