import type { Meta } from '@storybook/react';
import { ToggleGroup } from '.';
import { createSingleStory } from '../../../stories/utils/createSingleStory';
import * as ToggleGroupStories from './ToggleGroup.stories';

const meta: Meta = {
  title: 'Chromatic/ToggleGroup',
  component: ToggleGroup,
  tags: ['chromatic'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

export const Snapshots = createSingleStory(ToggleGroupStories, meta);
