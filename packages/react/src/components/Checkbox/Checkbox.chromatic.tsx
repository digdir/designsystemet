import type { Meta } from '@storybook/react';
import { Checkbox } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as CheckboxStories from './Checkbox.stories';

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
