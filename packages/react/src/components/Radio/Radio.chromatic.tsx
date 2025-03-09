import type { Meta } from '@storybook/react';
import { Radio } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as RadioStories from './Radio.stories';

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
